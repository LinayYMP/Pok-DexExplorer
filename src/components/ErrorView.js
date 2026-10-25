import { StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING } from '../constants/theme.js';
import AppButton from './AppButton.js';

// Estado "Error": mensaje claro en español y botón "Reintentar".
export default function ErrorView({ title = 'Algo salió mal', message, onRetry, compact = false }) {
  return (
    <View style={[styles.container, compact ? styles.compact : styles.fullSize]} accessibilityRole="alert">
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <AppButton title="Reintentar" onPress={onRetry} />
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
    backgroundColor: COLORS.dangerSoft,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: COLORS.textOnPrimary,
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
