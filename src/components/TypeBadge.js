import { StyleSheet, Text, View } from 'react-native';

import { RADIUS, SPACING } from '../constants/theme.js';
import { getTypeStyle } from '../utils/pokemonUtils.js';

// Distintivo de un tipo (Fuego, Agua, Planta...) con su color propio.
export default function TypeBadge({ type }) {
  const typeStyle = getTypeStyle(type);

  return (
    <View style={[styles.badge, { backgroundColor: typeStyle.color }]}>
      <Text style={[styles.label, { color: typeStyle.textColor }]}>{typeStyle.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
