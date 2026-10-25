// Pruebas contra la PokéAPI real (necesitan internet). Ejecutar con: npm run test:live
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { API_ERROR_TYPES, fetchPokemonDetail, fetchPokemonPage } from '../../src/services/pokemonApi.js';
import { getArtworkUrl, normalizeSearchTerm } from '../../src/utils/pokemonUtils.js';

const STAT_NAMES = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

test('la primera página trae 20 Pokémon (#001 a #020)', async () => {
  const page = await fetchPokemonPage(0);
  assert.equal(page.items.length, 20);
  assert.deepEqual(
    page.items.map((item) => item.id),
    Array.from({ length: 20 }, (_, index) => index + 1),
  );
  assert.equal(page.items[0].name, 'bulbasaur');
  assert.equal(page.hasMore, true);
  assert.equal(page.nextOffset, 20);
});

test('la segunda página trae otros 20 sin repetir ninguno', async () => {
  const firstPage = await fetchPokemonPage(0);
  const secondPage = await fetchPokemonPage(firstPage.nextOffset);
  const firstIds = new Set(firstPage.items.map((item) => item.id));
  assert.equal(secondPage.items.length, 20);
  assert.equal(secondPage.items[0].id, 21);
  assert.ok(secondPage.items.every((item) => !firstIds.has(item.id)));
});

test('la ficha de Pikachu tiene tipos, medidas convertidas y 6 estadísticas', async () => {
  const pikachu = await fetchPokemonDetail('pikachu');
  assert.equal(pikachu.id, 25);
  assert.deepEqual(pikachu.types, ['electric']);
  assert.equal(pikachu.heightInMeters, 0.4);
  assert.equal(pikachu.weightInKilograms, 6);
  assert.deepEqual(
    pikachu.stats.map((stat) => stat.name),
    STAT_NAMES,
  );
  assert.ok(pikachu.stats.every((stat) => Number.isInteger(stat.value) && stat.value <= 255));
});

test('buscar por número y con espacios/mayúsculas devuelve el mismo Pokémon', async () => {
  const byNumber = await fetchPokemonDetail(normalizeSearchTerm('25'));
  const withSpaces = await fetchPokemonDetail(normalizeSearchTerm('  Pikachu  '));
  assert.equal(byNumber.name, 'pikachu');
  assert.equal(withSpaces.id, 25);
});

test('un Pokémon con dos tipos los trae en orden (Bulbasaur: planta y veneno)', async () => {
  const bulbasaur = await fetchPokemonDetail('1');
  assert.deepEqual(bulbasaur.types, ['grass', 'poison']);
});

test('un nombre inexistente responde NOT_FOUND (404)', async () => {
  await assert.rejects(fetchPokemonDetail('pokemoninexistente'), (error) => {
    assert.equal(error.type, API_ERROR_TYPES.NOT_FOUND);
    return true;
  });
});

test('la URL de la imagen oficial existe y es un PNG', async () => {
  const response = await fetch(getArtworkUrl(25), { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/png/);
});
