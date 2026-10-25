import { StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING } from '../constants/theme.js';
import AppButton from './AppButton.js';

// Estado "Sin resultados": se muestra cuando el Pokémon buscado no existe (respuesta 404).
// El botón es opcional (por ejemplo, "Limpiar búsqueda").
export default function EmptyView({ title = 'Sin resultados', message, actionLabel, onAction, compact = false }) {
  return (
    <View style={[styles.container, compact ? styles.compact : styles.fullSize]}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>?</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? <AppButton title={actionLabel} onPress={onAction} variant="outline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  fullSize: {
    flex: 1,
    padding: SPACING.xl,
  },
  compact: {
    margin: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: COLORS.textSecondary,
    fontSize: 24,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
});
