import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, RADIUS, SPACING } from '../constants/theme.js';

// Botón reutilizable (Buscar, Reintentar, Volver a la lista...).
// Se usa Pressable en lugar de Button porque Button no permite personalizar su estilo.
export default function AppButton({ title, onPress, variant = 'primary', disabled = false, style }) {
  const variantStyles = VARIANTS[variant] ?? VARIANTS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        variantStyles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, variantStyles.text]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
});

const VARIANTS = {
  primary: StyleSheet.create({
    button: { backgroundColor: COLORS.primary },
    text: { color: COLORS.textOnPrimary },
  }),
  accent: StyleSheet.create({
    button: { backgroundColor: COLORS.accent },
    text: { color: COLORS.textPrimary },
  }),
  outline: StyleSheet.create({
    button: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
    text: { color: COLORS.textPrimary },
  }),
};
