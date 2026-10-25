// Nombres en español de las seis estadísticas base.
// Las claves coinciden con el campo "stat.name" de la respuesta de la API.
export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. especial',
  'special-defense': 'Def. especial',
  speed: 'Velocidad',
};

// Valor base más alto posible para una estadística: las barras son proporcionales a él.
export const MAX_BASE_STAT = 255;

// Color de la barra según el valor (de menor a mayor). Se usa el primer rango cuyo "max" supere el valor.
export const STAT_COLOR_RANGES = [
  { max: 50, color: '#E53935' },
  { max: 80, color: '#FB8C00' },
  { max: 110, color: '#F9A825' },
  { max: 150, color: '#43A047' },
  { max: Infinity, color: '#1E88E5' },
];
