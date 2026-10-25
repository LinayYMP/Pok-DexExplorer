// Pruebas del servicio de red con un fetch simulado (sin internet). Ejecutar con: npm test
// Verifican que response.ok se revisa antes de response.json() y que cada fallo se clasifica bien.
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { API_ERROR_TYPES, fetchPokemonDetail, fetchPokemonPage } from '../src/services/pokemonApi.js';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockResponse({ status = 200, body = null, invalidJson = false }) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (status === 404) {
        throw new Error('response.json() no debe llamarse con una respuesta 404');
      }
      if (invalidJson) {
        throw new SyntaxError('Unexpected token');
      }
      return body;
    },
  };
}

test('fetchPokemonPage pide limit=20&offset y mapea los resultados', async () => {
  let requestedUrl = '';
  globalThis.fetch = async (url) => {
    requestedUrl = url;
    return mockResponse({
      body: {
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      },
    });
  };

  const page = await fetchPokemonPage(0);
  assert.equal(requestedUrl, 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
  assert.equal(page.items[0].id, 1);
  assert.equal(page.items[1].name, 'ivysaur');
  assert.equal(page.hasMore, true);
  assert.equal(page.nextOffset, 2);
  assert.equal(page.total, 1302);
});

test('hasMore es false cuando "next" es null', async () => {
  globalThis.fetch = async () => mockResponse({ body: { count: 1, next: null, results: [] } });
  const page = await fetchPokemonPage(1300);
  assert.equal(page.hasMore, false);
});

test('un 404 se clasifica como NOT_FOUND sin llamar a response.json()', async () => {
  globalThis.fetch = async () => mockResponse({ status: 404 });
  await assert.rejects(fetchPokemonDetail('pokemoninexistente'), (error) => {
    assert.equal(error.type, API_ERROR_TYPES.NOT_FOUND);
    assert.equal(error.status, 404);
    return true;
  });
});

test('un 500 se clasifica como SERVER (no como "sin resultados")', async () => {
  globalThis.fetch = async () => mockResponse({ status: 500 });
  await assert.rejects(fetchPokemonDetail('pikachu'), (error) => {
    assert.equal(error.type, API_ERROR_TYPES.SERVER);
    assert.match(error.message, /500/);
    return true;
  });
});

test('sin conexión (fetch rechaza) se clasifica como NETWORK', async () => {
  globalThis.fetch = async () => {
    throw new TypeError('Network request failed');
  };
  await assert.rejects(fetchPokemonPage(0), (error) => {
    assert.equal(error.type, API_ERROR_TYPES.NETWORK);
    assert.match(error.message, /conexión/);
    return true;
  });
});

test('tiempo de espera agotado (AbortError) se clasifica como NETWORK', async () => {
  globalThis.fetch = async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    throw abortError;
  };
  await assert.rejects(fetchPokemonDetail('25'), (error) => {
    assert.equal(error.type, API_ERROR_TYPES.NETWORK);
    assert.match(error.message, /tardó demasiado/);
    return true;
  });
});

test('una respuesta que no es JSON válido se clasifica como SERVER', async () => {
  globalThis.fetch = async () => mockResponse({ invalidJson: true });
  await assert.rejects(fetchPokemonDetail('pikachu'), (error) => {
    assert.equal(error.type, API_ERROR_TYPES.SERVER);
    return true;
  });
});

test('fetchPokemonDetail arma la URL /pokemon/{nombre-o-id}', async () => {
  const requestedUrls = [];
  globalThis.fetch = async (url) => {
    requestedUrls.push(url);
    return mockResponse({
      body: { id: 25, name: 'pikachu', height: 4, weight: 60, types: [], stats: [], sprites: {} },
    });
  };
  await fetchPokemonDetail('pikachu');
  await fetchPokemonDetail(25);
  assert.deepEqual(requestedUrls, [
    'https://pokeapi.co/api/v2/pokemon/pikachu',
    'https://pokeapi.co/api/v2/pokemon/25',
  ]);
});
