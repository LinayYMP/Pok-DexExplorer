import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import AppButton from '../components/AppButton.js';
import EmptyView from '../components/EmptyView.js';
import ErrorView from '../components/ErrorView.js';
import LoadingView from '../components/LoadingView.js';
import StatBar from '../components/StatBar.js';
import TypeBadge from '../components/TypeBadge.js';
import { COLORS, MAX_CONTENT_WIDTH, RADIUS, SPACING } from '../constants/theme.js';
import { API_ERROR_TYPES, fetchPokemonDetail } from '../services/pokemonApi.js';
import {
  capitalize,
  formatMeasure,
  formatPokemonNumber,
  getStatLabel,
  getTypeStyle,
} from '../utils/pokemonUtils.js';

// Vista de detalle: imagen grande, nombre, número, tipos, altura, peso y estadísticas base.
// - Desde una tarjeta llega solo pokemonId y la ficha se pide aquí.
// - Desde la búsqueda llega initialPokemon (ya consultado) y no se repite la petición.
export default function PokemonDetailScreen({ pokemonId, initialPokemon = null, onBack }) {
  const { width } = useWindowDimensions();

  // CONCEPTO [useState]: datos de la ficha y estado de la petición.
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [isLoading, setIsLoading] = useState(initialPokemon === null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // CONCEPTO [useEffect]: pide la ficha al abrir la vista.
  // CONCEPTO [array de dependencias]: [pokemonId, initialPokemon, retryCount] -> se ejecuta al abrir
  // la ficha de un Pokémon y de nuevo solo si el usuario pulsa "Reintentar". Guardar la
  // respuesta con setPokemon no cambia ninguna dependencia, así que no hay bucle infinito.
  useEffect(() => {
    if (initialPokemon) {
      return undefined; // la búsqueda ya trajo la ficha completa
    }

    let isCurrentRequest = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonDetail(pokemonId);
        if (isCurrentRequest) {
          setPokemon(data);
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(requestError);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      isCurrentRequest = false; // si se vuelve a la lista antes de la respuesta, se ignora
    };
  }, [pokemonId, initialPokemon, retryCount]);

  function renderContent() {
    if (isLoading) {
      return <LoadingView message="Cargando ficha del Pokémon..." />;
    }
    if (error?.type === API_ERROR_TYPES.NOT_FOUND) {
      return (
        <EmptyView
          message="No encontramos la ficha de este Pokémon."
          actionLabel="Volver a la lista"
          onAction={onBack}
        />
      );
    }
    if (error) {
      return (
        <ErrorView
          title="No pudimos cargar la ficha"
          message={error.message}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      );
    }
    if (!pokemon) {
      return null;
    }

    const primaryType = getTypeStyle(pokemon.types[0]);
    const imageSize = Math.min(Math.round(Math.min(width, MAX_CONTENT_WIDTH) * 0.6), 280);

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* El fondo toma el color del tipo principal. */}
        <View style={[styles.hero, { backgroundColor: primaryType.color }]}>
          {/* CONCEPTO [Image]: imagen remota grande con width y height explícitos. */}
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={{ width: imageSize, height: imageSize }}
            resizeMode="contain"
            accessibilityLabel={`Imagen oficial de ${capitalize(pokemon.name)}`}
          />
        </View>

        <View style={styles.sheet}>
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
          <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>

          <View style={styles.typesRow}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>

          <View style={styles.measuresRow}>
            <MeasureBox label="Altura" value={formatMeasure(pokemon.heightInMeters, 'm')} />
            <MeasureBox label="Peso" value={formatMeasure(pokemon.weightInKilograms, 'kg')} />
          </View>

          <Text style={styles.sectionTitle}>Estadísticas base</Text>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} label={getStatLabel(stat.name)} value={stat.value} />
          ))}
          <Text style={styles.statsNote}>Las barras son proporcionales al valor máximo posible (255).</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <AppButton title="Volver a la lista" onPress={onBack} variant="outline" style={styles.backButton} />
      </View>
      <View style={styles.body}>{renderContent()}</View>
    </View>
  );
}

// Caja pequeña para altura y peso; solo la usa esta pantalla.
function MeasureBox({ label, value }) {
  return (
    <View style={styles.measureBox}>
      <Text style={styles.measureValue}>{value}</Text>
      <Text style={styles.measureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  sheet: {
    marginTop: -SPACING.xl,
    marginHorizontal: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    boxShadow: '0px 2px 10px rgba(31, 36, 48, 0.08)',
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  number: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  measuresRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  measureBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  measureValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  measureLabel: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statsNote: {
    marginTop: SPACING.sm,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
