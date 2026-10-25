import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from './src/constants/theme.js';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen.js';
import PokemonListScreen from './src/screens/PokemonListScreen.js';

// Punto de entrada. Una sola pantalla principal con dos vistas (lista y ficha), sin
// bibliotecas de navegación: un estado decide si la ficha está abierta.
export default function App() {
  // CONCEPTO [useState]: null = vista de lista; { id, pokemon } = ficha abierta.
  const [selection, setSelection] = useState(null);

  function handleSelectPokemon(id, preloadedPokemon = null) {
    setSelection({ id, pokemon: preloadedPokemon });
  }

  function handleBackToList() {
    setSelection(null);
  }

  // CONCEPTO [useEffect]: en Android, el botón físico "atrás" debe volver a la lista en lugar de cerrar la app.
  // CONCEPTO [array de dependencias]: [selection] -> el efecto se vuelve a ejecutar solo cuando se abre
  // o se cierra una ficha; la función de limpieza quita el listener anterior.
  useEffect(() => {
    if (!selection) {
      return undefined;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setSelection(null);
      return true; // true = evento atendido, la app no se cierra
    });
    return () => subscription.remove();
  }, [selection]);

  const isDetailOpen = selection !== null;

  return (
    // SafeAreaProvider + SafeAreaView (react-native-safe-area-context) evitan que el contenido
    // quede debajo de la barra de estado, el notch o la barra de navegación.
    <SafeAreaProvider>
      <SafeAreaView style={styles.topArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.content} edges={['bottom']}>
          <View style={styles.stage}>
            {/* La lista permanece montada debajo de la ficha: al volver se conserva el scroll
                y no se piden de nuevo las páginas ya cargadas. */}
            <View
              style={styles.stage}
              accessibilityElementsHidden={isDetailOpen}
              importantForAccessibility={isDetailOpen ? 'no-hide-descendants' : 'auto'}
            >
              <PokemonListScreen onSelectPokemon={handleSelectPokemon} />
            </View>

            {isDetailOpen ? (
              <View style={StyleSheet.absoluteFill}>
                <PokemonDetailScreen
                  key={selection.id}
                  pokemonId={selection.id}
                  initialPokemon={selection.pokemon}
                  onBack={handleBackToList}
                />
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // La franja superior (barra de estado) toma el rojo del encabezado.
  topArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stage: {
    flex: 1,
  },
});
