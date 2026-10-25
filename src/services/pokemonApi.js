// Capa de red: todas las llamadas a la PokéAPI viven aquí, separadas de los estilos y del JSX.
// Las pantallas solo llaman a fetchPokemonPage() y fetchPokemonDetail() y reciben datos listos.
import { mapPokemonDetail, mapPokemonListItem } from '../utils/pokemonUtils.js';

// API pública y gratuita: no requiere API key.
const BASE_URL = 'https://pokeapi.co/api/v2';

// Cantidad de Pokémon por página (al abrir la app y en cada scroll infinito).
export const PAGE_SIZE = 20;

// Si la API no responde en este tiempo se cancela la petición: así ningún indicador
// de carga se queda activo para siempre.
const REQUEST_TIMEOUT_MS = 15000;

// Tipos de error para que cada pantalla muestre el estado correcto.
export const API_ERROR_TYPES = {
  NOT_FOUND: 'NOT_FOUND', // HTTP 404: el Pokémon no existe -> estado "Sin resultados"
  NETWORK: 'NETWORK', // sin internet o tiempo agotado -> estado "Error" con "Reintentar"
  SERVER: 'SERVER', // otro código HTTP fallido o una respuesta que no es JSON válido
};

function createApiError(type, message, status = null) {
  const error = new Error(message);
  error.type = type;
  error.status = status;
  return error;
}

function createHttpError(status) {
  if (status === 404) {
    return createApiError(API_ERROR_TYPES.NOT_FOUND, 'No se encontraron resultados.', status);
  }
  return createApiError(
    API_ERROR_TYPES.SERVER,
    `La PokéAPI respondió con un error (código ${status}). Inténtalo de nuevo en unos segundos.`,
    status,
  );
}

function createNetworkError(error) {
  const message =
    error.name === 'AbortError'
      ? 'La PokéAPI tardó demasiado en responder. Revisa tu conexión e inténtalo de nuevo.'
      : 'No pudimos conectarnos con la PokéAPI. Revisa tu conexión a internet.';
  return createApiError(API_ERROR_TYPES.NETWORK, message);
}

// CONCEPTO [async/await]: una función async siempre devuelve una promesa; "await" pausa
// la función hasta que la promesa se resuelve, sin bloquear la interfaz.
async function requestJson(url) {
  // AbortController permite cancelar fetch cuando se agota el tiempo de espera.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // CONCEPTO [fetch]: hace la petición HTTP GET y devuelve un objeto Response.
    // fetch solo falla (rechaza la promesa) por problemas de conexión; un 404 NO es un fallo de fetch.
    const response = await fetch(url, { signal: controller.signal });

    // CONCEPTO [response.ok]: es true solo con códigos 200-299. Se revisa ANTES de response.json()
    // porque un nombre inexistente responde 404 con texto plano ("Not Found"), que no es JSON.
    if (!response.ok) {
      throw createHttpError(response.status);
    }

    // "return await" mantiene el try activo mientras se lee el cuerpo de la respuesta.
    return await response.json();
  } catch (error) {
    if (error.type) {
      throw error; // ya clasificado como 404 u otro error HTTP
    }
    if (error instanceof SyntaxError) {
      throw createApiError(API_ERROR_TYPES.SERVER, 'La respuesta de la PokéAPI no tiene un formato válido.');
    }
    throw createNetworkError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}

// GET /pokemon?limit={n}&offset={m} -> una página de la lista.
export async function fetchPokemonPage(offset = 0, limit = PAGE_SIZE) {
  const data = await requestJson(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  return {
    items: data.results.map(mapPokemonListItem),
    hasMore: data.next !== null, // "next" es null cuando ya no hay más páginas
    nextOffset: offset + data.results.length,
    total: data.count,
  };
}

// GET /pokemon/{nombre o id} -> ficha completa de un Pokémon.
export async function fetchPokemonDetail(nameOrId) {
  const data = await requestJson(`${BASE_URL}/pokemon/${encodeURIComponent(String(nameOrId))}`);
  return mapPokemonDetail(data);
}
