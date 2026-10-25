// Identidad visual de cada tipo: etiqueta en español (texto de la interfaz), color del
// distintivo y color de texto legible sobre ese fondo.
// Las claves coinciden con el campo "type.name" que entrega la API.
const DARK_TEXT = '#1F2430';
const LIGHT_TEXT = '#FFFFFF';

export const POKEMON_TYPES = {
  normal: { label: 'Normal', color: '#A8A77A', textColor: DARK_TEXT },
  fire: { label: 'Fuego', color: '#EE8130', textColor: DARK_TEXT },
  water: { label: 'Agua', color: '#6390F0', textColor: LIGHT_TEXT },
  grass: { label: 'Planta', color: '#7AC74C', textColor: DARK_TEXT },
  electric: { label: 'Eléctrico', color: '#F7D02C', textColor: DARK_TEXT },
  ice: { label: 'Hielo', color: '#96D9D6', textColor: DARK_TEXT },
  fighting: { label: 'Lucha', color: '#C22E28', textColor: LIGHT_TEXT },
  poison: { label: 'Veneno', color: '#A33EA1', textColor: LIGHT_TEXT },
  ground: { label: 'Tierra', color: '#E2BF65', textColor: DARK_TEXT },
  flying: { label: 'Volador', color: '#A98FF3', textColor: DARK_TEXT },
  psychic: { label: 'Psíquico', color: '#F95587', textColor: LIGHT_TEXT },
  bug: { label: 'Bicho', color: '#A6B91A', textColor: DARK_TEXT },
  rock: { label: 'Roca', color: '#B6A136', textColor: DARK_TEXT },
  ghost: { label: 'Fantasma', color: '#735797', textColor: LIGHT_TEXT },
  dragon: { label: 'Dragón', color: '#6F35FC', textColor: LIGHT_TEXT },
  dark: { label: 'Siniestro', color: '#705746', textColor: LIGHT_TEXT },
  steel: { label: 'Acero', color: '#B7B7CE', textColor: DARK_TEXT },
  fairy: { label: 'Hada', color: '#D685AD', textColor: DARK_TEXT },
  stellar: { label: 'Astral', color: '#40B5A5', textColor: DARK_TEXT },
};

// Se usa si la API devuelve un tipo que no está en la tabla anterior.
export const DEFAULT_TYPE_STYLE = { label: 'Desconocido', color: '#9CA3AF', textColor: DARK_TEXT };
