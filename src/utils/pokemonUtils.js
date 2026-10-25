// Funciones auxiliares puras: no hacen peticiones ni dibujan nada, solo transforman datos.
// Por eso se pueden probar con Node (ver carpeta tests/).
// Nota: las importaciones llevan la extensión ".js" para que Node también pueda cargar el archivo.
import { MAX_BASE_STAT, STAT_COLOR_RANGES, STAT_LABELS } from '../constants/pokemonStats.js';
import { DEFAULT_TYPE_STYLE, POKEMON_TYPES } from '../constants/pokemonTypes.js';

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// La lista solo trae nombre y URL; el id está al final de la URL:
// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
export function getIdFromUrl(url) {
  // filter(Boolean) elimina el texto vacío que deja la barra "/" final.
  const segments = url.split('/').filter(Boolean);
  return Number(segments[segments.length - 1]);
}

// Imagen oficial construida a partir del id, sin pedir la ficha completa.
export function getArtworkUrl(id) {
  return `${ARTWORK_BASE_URL}/${id}.png`;
}

// Número con tres dígitos: 25 -> "#025".
export function formatPokemonNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

// Primera letra en mayúscula: "pikachu" -> "Pikachu".
export function capitalize(text) {
  if (!text) {
    return '';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Prepara lo que escribe el usuario para la URL de la API:
// "  Pikachu " -> "pikachu", "025" o "#025" -> "25", "Mr Mime" -> "mr-mime".
export function normalizeSearchTerm(rawText) {
  const term = rawText
    .trim()
    .toLowerCase()
    .replace(/^#\s*/, '') // permite buscar copiando el formato de la tarjeta (#025)
    .replace(/\s+/g, '-'); // la API usa guiones en los nombres compuestos

  // Los números se envían sin ceros a la izquierda: la API espera /pokemon/25, no /pokemon/025.
  if (/^\d+$/.test(term)) {
    return String(Number(term));
  }
  return term;
}

// La API entrega la altura en decímetros: dividir entre 10 da metros.
export function convertHeightToMeters(heightInDecimeters) {
  return heightInDecimeters / 10;
}

// La API entrega el peso en hectogramos: dividir entre 10 da kilogramos.
export function convertWeightToKilograms(weightInHectograms) {
  return weightInHectograms / 10;
}

// 0.4 -> "0,4 m" (coma decimal, como se escribe en español).
export function formatMeasure(value, unit) {
  return `${value.toFixed(1).replace('.', ',')} ${unit}`;
}

// Porcentaje de ancho de la barra respecto al máximo (255). Siempre queda entre 0 y 100,
// así una estadística en 0 o un valor inesperado no rompen el estilo.
export function getStatPercentage(value, maxValue = MAX_BASE_STAT) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.min((value / maxValue) * 100, 100);
}

export function getStatColor(value) {
  return STAT_COLOR_RANGES.find((range) => value < range.max).color;
}

export function getStatLabel(statName) {
  return STAT_LABELS[statName] ?? capitalize(statName);
}

export function getTypeStyle(typeName) {
  return POKEMON_TYPES[typeName] ?? { ...DEFAULT_TYPE_STYLE, label: capitalize(typeName) };
}

// Convierte un resultado de GET /pokemon?limit&offset en el objeto que usa la tarjeta.
export function mapPokemonListItem(result) {
  const id = getIdFromUrl(result.url);
  return {
    id,
    name: result.name,
    imageUrl: getArtworkUrl(id),
  };
}

// Toma de GET /pokemon/{nombre-o-id} solo los campos que muestra la ficha.
export function mapPokemonDetail(data) {
  return {
    id: data.id,
    name: data.name,
    imageUrl: data.sprites?.other?.['official-artwork']?.front_default ?? getArtworkUrl(data.id),
    // "slot" indica el orden de los tipos (1 = tipo principal).
    types: [...data.types].sort((a, b) => a.slot - b.slot).map((entry) => entry.type.name),
    heightInMeters: convertHeightToMeters(data.height),
    weightInKilograms: convertWeightToKilograms(data.weight),
    stats: data.stats.map((entry) => ({ name: entry.stat.name, value: entry.base_stat })),
  };
}

// Agrega una página nueva a la lista sin repetir Pokémon (mismo id = misma clave en FlatList).
export function mergeUniqueById(currentItems, newItems) {
  const knownIds = new Set(currentItems.map((item) => item.id));
  const mergedItems = [...currentItems];

  for (const item of newItems) {
    if (!knownIds.has(item.id)) {
      knownIds.add(item.id);
      mergedItems.push(item);
    }
  }
  return mergedItems;
}
