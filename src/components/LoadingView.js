import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING } from '../constants/theme.js';

// Estado "Cargando": indicador de actividad con un texto en español.
// compact = versión pequeña para el pie de la lista o el panel de búsqueda.
export default function LoadingView({ message = 'Cargando...', compact = false }) {
  return (
    <View
      style={[styles.container, compact ? styles.compact : styles.fullSize]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size={compact ? 'small' : 'large'} color={COLORS.primary} />
      <Text style={[styles.message, compact && styles.messageCompact]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullSize: {
    flex: 1,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  compact: {
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  messageCompact: {
    fontSize: 14,
  },
});
