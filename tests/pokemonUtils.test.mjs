// Pruebas de las funciones auxiliares (sin red). Ejecutar con: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  capitalize,
  convertHeightToMeters,
  convertWeightToKilograms,
  formatMeasure,
  formatPokemonNumber,
  getArtworkUrl,
  getIdFromUrl,
  getStatColor,
  getStatLabel,
  getStatPercentage,
  getTypeStyle,
  mapPokemonDetail,
  mapPokemonListItem,
  mergeUniqueById,
  normalizeSearchTerm,
} from '../src/utils/pokemonUtils.js';

test('getIdFromUrl extrae el id del final de la URL', () => {
  assert.equal(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/1/'), 1);
  assert.equal(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/'), 25);
  assert.equal(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/10001/'), 10001);
  assert.equal(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/150'), 150);
});

test('getArtworkUrl sigue el patrón de la imagen oficial', () => {
  assert.equal(
    getArtworkUrl(25),
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  );
});

test('formatPokemonNumber muestra tres dígitos', () => {
  assert.equal(formatPokemonNumber(1), '#001');
  assert.equal(formatPokemonNumber(25), '#025');
  assert.equal(formatPokemonNumber(150), '#150');
  assert.equal(formatPokemonNumber(1025), '#1025');
});

test('capitalize pone la primera letra en mayúscula', () => {
  assert.equal(capitalize('pikachu'), 'Pikachu');
  assert.equal(capitalize('mr-mime'), 'Mr-mime');
  assert.equal(capitalize(''), '');
});

test('normalizeSearchTerm ignora mayúsculas y espacios al inicio o al final', () => {
  assert.equal(normalizeSearchTerm('pikachu'), 'pikachu');
  assert.equal(normalizeSearchTerm(' Pikachu '), 'pikachu');
  assert.equal(normalizeSearchTerm('PIKACHU'), 'pikachu');
  assert.equal(normalizeSearchTerm('25'), '25');
  assert.equal(normalizeSearchTerm(' 025 '), '25');
  assert.equal(normalizeSearchTerm('#025'), '25');
  assert.equal(normalizeSearchTerm('Mr Mime'), 'mr-mime');
  assert.equal(normalizeSearchTerm('   '), '');
});

test('altura en metros y peso en kilogramos (divididos entre 10)', () => {
  assert.equal(convertHeightToMeters(4), 0.4); // Pikachu: 4 dm
  assert.equal(convertWeightToKilograms(60), 6); // Pikachu: 60 hg
  assert.equal(convertWeightToKilograms(4600), 460); // Snorlax
  assert.equal(formatMeasure(0.4, 'm'), '0,4 m');
  assert.equal(formatMeasure(6, 'kg'), '6,0 kg');
});

test('getStatPercentage es proporcional a 255 y soporta valores extremos', () => {
  assert.equal(getStatPercentage(255), 100);
  assert.equal(getStatPercentage(51), 20);
  assert.equal(getStatPercentage(0), 0);
  assert.equal(getStatPercentage(-5), 0);
  assert.equal(getStatPercentage(300), 100);
  assert.equal(getStatPercentage(Number.NaN), 0);
});

test('getStatColor devuelve un color para cualquier valor', () => {
  assert.equal(getStatColor(0), '#E53935');
  assert.equal(getStatColor(255), '#1E88E5');
});

test('getStatLabel y getTypeStyle traducen al español con respaldo', () => {
  assert.equal(getStatLabel('hp'), 'PS');
  assert.equal(getStatLabel('special-attack'), 'At. especial');
  assert.equal(getTypeStyle('fire').label, 'Fuego');
  assert.equal(getTypeStyle('electric').label, 'Eléctrico');
  assert.equal(getTypeStyle('shadow').label, 'Shadow');
});

test('mapPokemonListItem construye id e imagen desde la URL', () => {
  const item = mapPokemonListItem({ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' });
  assert.deepEqual(item, { id: 1, name: 'bulbasaur', imageUrl: getArtworkUrl(1) });
});

test('mapPokemonDetail ordena los tipos por slot y convierte las medidas', () => {
  const detail = mapPokemonDetail({
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    types: [
      { slot: 2, type: { name: 'poison' } },
      { slot: 1, type: { name: 'grass' } },
    ],
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
    ],
    sprites: { other: { 'official-artwork': { front_default: null } } },
  });
  assert.deepEqual(detail.types, ['grass', 'poison']);
  assert.equal(detail.heightInMeters, 0.7);
  assert.equal(detail.weightInKilograms, 6.9);
  assert.equal(detail.imageUrl, getArtworkUrl(1)); // respaldo si la API no trae imagen
  assert.deepEqual(detail.stats[0], { name: 'hp', value: 45 });
});

test('mergeUniqueById agrega sin duplicar y conserva el orden', () => {
  const firstPage = [{ id: 1 }, { id: 2 }];
  const secondPage = [{ id: 2 }, { id: 3 }, { id: 3 }];
  assert.deepEqual(mergeUniqueById(firstPage, secondPage), [{ id: 1 }, { id: 2 }, { id: 3 }]);
});
