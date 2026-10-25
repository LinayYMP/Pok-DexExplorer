import { StyleSheet, Text, View } from 'react-native';

import { MAX_BASE_STAT } from '../constants/pokemonStats.js';
import { COLORS, RADIUS, SPACING } from '../constants/theme.js';
import { getStatColor, getStatPercentage } from '../utils/pokemonUtils.js';

// Una estadística base: nombre, valor y barra de ancho proporcional al máximo (255).
export default function StatBar({ label, value }) {
  const percentage = getStatPercentage(value); // 0 a 100; un valor 0 da una barra vacía sin errores

  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value} de ${MAX_BASE_STAT}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: getStatColor(value) }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: SPACING.sm,
  },
  label: {
    width: 104,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  value: {
    width: 36,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.barTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
});
