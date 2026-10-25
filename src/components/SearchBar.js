import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS, RADIUS, SPACING } from '../constants/theme.js';
import AppButton from './AppButton.js';

// Barra de búsqueda: campo de texto + botón "Buscar". Solo dibuja; la lógica de la
// búsqueda (validar, normalizar y consultar la API) vive en PokemonListScreen.
export default function SearchBar({ value, onChangeText, onSubmit, onClear, validationMessage }) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit} // la tecla "buscar" del teclado también inicia la búsqueda
            placeholder="Busca por nombre o número..."
            placeholderTextColor={COLORS.textSecondary}
            // Evita que el teclado escriba "Pikachu" con mayúscula o "corrija" los nombres.
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Buscar Pokémon por nombre o número"
          />
          {value.length > 0 ? (
            <Pressable
              onPress={onClear}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Limpiar búsqueda"
              hitSlop={8}
            >
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          ) : null}
        </View>
        <AppButton title="Buscar" onPress={onSubmit} variant="accent" />
      </View>
      {validationMessage ? <Text style={styles.validation}>{validationMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 22,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  validation: {
    marginTop: SPACING.sm,
    color: COLORS.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
