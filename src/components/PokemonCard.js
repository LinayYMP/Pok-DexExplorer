import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { COLORS, MAX_CONTENT_WIDTH, RADIUS, SPACING } from '../constants/theme.js';
import { capitalize, formatPokemonNumber } from '../utils/pokemonUtils.js';

// Tarjeta de la cuadrícula: imagen, número de tres dígitos y nombre con mayúscula inicial.
export default function PokemonCard({ pokemon, onPress }) {
  // El tamaño de la imagen se calcula con el ancho de la pantalla (diseño adaptable).
  const { width } = useWindowDimensions();
  const imageSize = Math.min(Math.round(Math.min(width, MAX_CONTENT_WIDTH) * 0.3), 150);

  // Si la imagen remota no existe (algunas formas especiales no tienen arte oficial),
  // se muestra un marcador en lugar de un espacio vacío.
  const [hasImageError, setHasImageError] = useState(false);

  const displayName = capitalize(pokemon.name);
  const displayNumber = formatPokemonNumber(pokemon.id);

  return (
    <Pressable
      onPress={() => onPress(pokemon)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, número ${displayNumber}. Ver ficha`}
    >
      <View style={styles.imageBackground}>
        {hasImageError ? (
          <View style={[styles.imagePlaceholder, { width: imageSize, height: imageSize }]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        ) : (
          // CONCEPTO [Image]: una imagen con URL remota necesita width y height explícitos o no se ve.
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={{ width: imageSize, height: imageSize }}
            resizeMode="contain"
            onError={() => setHasImageError(true)}
          />
        )}
      </View>
      <Text style={styles.number}>{displayNumber}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {displayName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    boxShadow: '0px 2px 8px rgba(31, 36, 48, 0.08)',
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  imageBackground: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.border,
  },
  number: {
    marginTop: SPACING.sm,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  name: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
