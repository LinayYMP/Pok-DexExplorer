import { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';

import EmptyView from '../components/EmptyView.js';
import ErrorView from '../components/ErrorView.js';
import LoadingView from '../components/LoadingView.js';
import PokemonCard from '../components/PokemonCard.js';
import SearchBar from '../components/SearchBar.js';
import { COLORS, MAX_CONTENT_WIDTH, RADIUS, SPACING } from '../constants/theme.js';
import { API_ERROR_TYPES, fetchPokemonDetail, fetchPokemonPage, PAGE_SIZE } from '../services/pokemonApi.js';
import { mergeUniqueById, normalizeSearchTerm } from '../utils/pokemonUtils.js';

const SEARCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  NOT_FOUND: 'notFound',
  ERROR: 'error',
};

// Vista de lista: encabezado, barra de búsqueda y cuadrícula con scroll infinito.
// onSelectPokemon(id, pokemonYaCargado?) abre la ficha de detalle (la controla App.js).
export default function PokemonListScreen({ onSelectPokemon }) {
  // CONCEPTO [useState]: cada dato que cambia y debe redibujar la pantalla es un estado.
  // --- Lista y paginación ---
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0); // offset de la página que se está pidiendo
  const [nextOffset, setNextOffset] = useState(0); // offset de la siguiente página disponible
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [retryCount, setRetryCount] = useState(0); // cambia solo al pulsar "Reintentar"

  // --- Búsqueda ---
  const [searchText, setSearchText] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // término normalizado que se consultó
  const [searchStatus, setSearchStatus] = useState(SEARCH_STATUS.IDLE);
  const [searchErrorMessage, setSearchErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  // useRef guarda un valor que sobrevive a los renderizados sin provocar uno nuevo.
  // Aquí identifica la búsqueda más reciente: si llega la respuesta de una búsqueda
  // anterior, se descarta para que no sobrescriba la actual.
  const latestSearchIdRef = useRef(0);

  // CONCEPTO [useEffect]: ejecuta la petición de una página después de dibujar la pantalla.
  // CONCEPTO [array de dependencias]: [offset, retryCount] hace que el efecto se ejecute
  //   - al montar la pantalla (offset 0 -> primeros 20 Pokémon),
  //   - cuando el scroll infinito cambia "offset" (siguiente página),
  //   - cuando el usuario pulsa "Reintentar" (retryCount + 1).
  // Ningún otro cambio (escribir en la búsqueda, recibir datos...) vuelve a ejecutarlo,
  // por eso la petición no se repite sin parar.
  useEffect(() => {
    let isCurrentRequest = true;

    async function loadPage() {
      setIsLoadingPage(true);
      setPageError(null);

      try {
        const page = await fetchPokemonPage(offset, PAGE_SIZE);
        if (!isCurrentRequest) {
          return;
        }
        // Se agregan los nuevos sin repetir ids (evita duplicados en el estado y en las claves).
        setPokemonList((currentList) => mergeUniqueById(currentList, page.items));
        setNextOffset(page.nextOffset);
        setHasMore(page.hasMore);
        setTotalCount(page.total);
      } catch (error) {
        // Un error al cargar más NO borra la lista que ya se ve: solo se guarda el mensaje.
        if (isCurrentRequest) {
          setPageError(error.message);
        }
      } finally {
        // El indicador de carga siempre se apaga, haya éxito o error.
        if (isCurrentRequest) {
          setIsLoadingPage(false);
        }
      }
    }

    loadPage();

    // Limpieza: si la pantalla se desmonta o las dependencias cambian antes de que llegue
    // la respuesta, esa respuesta antigua se ignora.
    return () => {
      isCurrentRequest = false;
    };
  }, [offset, retryCount]);

  // CONCEPTO [onEndReached]: FlatList lo llama al acercarse al final de la lista.
  function handleEndReached() {
    // Evita peticiones duplicadas: no se pide otra página si ya hay una en camino,
    // si la anterior falló (se espera a "Reintentar") o si ya no quedan más.
    if (isLoadingPage || pageError || !hasMore) {
      return;
    }
    // Asignar el mismo nextOffset varias veces no cambia el estado, así que aunque
    // onEndReached se dispare dos veces seguidas el efecto se ejecuta una sola vez.
    setOffset(nextOffset);
  }

  function handleRetryPage() {
    setRetryCount((count) => count + 1);
  }

  // La búsqueda se hace en el manejador del evento (no en un useEffect) porque la dispara
  // una acción concreta del usuario: pulsar "Buscar".
  async function runSearch(term) {
    const searchId = latestSearchIdRef.current + 1;
    latestSearchIdRef.current = searchId;

    setSearchTerm(term);
    setSearchErrorMessage('');
    setSearchStatus(SEARCH_STATUS.LOADING);

    try {
      const pokemon = await fetchPokemonDetail(term);
      if (searchId !== latestSearchIdRef.current) {
        return; // llegó tarde: ya hay una búsqueda más reciente o se limpió la búsqueda
      }
      setSearchStatus(SEARCH_STATUS.IDLE);
      onSelectPokemon(pokemon.id, pokemon); // se envía la ficha ya cargada: no se pide dos veces
    } catch (error) {
      if (searchId !== latestSearchIdRef.current) {
        return;
      }
      // Un 404 significa "no existe" (Sin resultados); cualquier otro fallo es un error con reintento.
      if (error.type === API_ERROR_TYPES.NOT_FOUND) {
        setSearchStatus(SEARCH_STATUS.NOT_FOUND);
      } else {
        setSearchErrorMessage(error.message);
        setSearchStatus(SEARCH_STATUS.ERROR);
      }
    }
  }

  function handleSearch() {
    const term = normalizeSearchTerm(searchText);
    Keyboard.dismiss();

    if (!term) {
      setValidationMessage('Escribe un nombre o un número para buscar.');
      return;
    }
    // Pulsar varias veces "Buscar" con el mismo texto no lanza peticiones repetidas.
    if (searchStatus === SEARCH_STATUS.LOADING && term === searchTerm) {
      return;
    }
    setValidationMessage('');
    runSearch(term);
  }

  function handleChangeSearchText(text) {
    setSearchText(text);
    setValidationMessage('');
    // El mensaje anterior ya no corresponde a lo que el usuario está escribiendo.
    if (searchStatus === SEARCH_STATUS.NOT_FOUND || searchStatus === SEARCH_STATUS.ERROR) {
      setSearchStatus(SEARCH_STATUS.IDLE);
    }
  }

  function clearSearchState() {
    latestSearchIdRef.current += 1; // invalida cualquier búsqueda que siga en camino
    setSearchTerm('');
    setSearchErrorMessage('');
    setValidationMessage('');
    setSearchStatus(SEARCH_STATUS.IDLE);
  }

  function handleClearSearch() {
    setSearchText('');
    clearSearchState();
  }

  function handleCardPress(pokemon) {
    clearSearchState(); // si había una búsqueda en curso, no debe abrir otra ficha después
    onSelectPokemon(pokemon.id);
  }

  function renderSearchFeedback() {
    if (searchStatus === SEARCH_STATUS.LOADING) {
      return <LoadingView compact message={`Buscando "${searchTerm}"...`} />;
    }
    if (searchStatus === SEARCH_STATUS.NOT_FOUND) {
      return (
        <EmptyView
          compact
          title="Sin resultados"
          message={`No se encontró ningún Pokémon con el nombre o número "${searchTerm}". Revisa la escritura e inténtalo de nuevo.`}
          actionLabel="Limpiar búsqueda"
          onAction={handleClearSearch}
        />
      );
    }
    if (searchStatus === SEARCH_STATUS.ERROR) {
      return (
        <ErrorView
          compact
          title="No pudimos completar la búsqueda"
          message={searchErrorMessage}
          onRetry={() => runSearch(searchTerm)}
        />
      );
    }
    return null;
  }

  // Lo que se ve cuando la lista todavía está vacía: carga inicial o error inicial.
  function renderListEmpty() {
    if (isLoadingPage) {
      return <LoadingView message="Cargando Pokémon..." />;
    }
    if (pageError) {
      return <ErrorView title="No pudimos cargar la Pokédex" message={pageError} onRetry={handleRetryPage} />;
    }
    return <EmptyView title="Lista vacía" message="No hay Pokémon para mostrar." />;
  }

  // Pie de la lista: indicador al cargar más, error con reintento o fin de la Pokédex.
  function renderListFooter() {
    if (pokemonList.length === 0) {
      return null;
    }
    if (isLoadingPage) {
      return <LoadingView compact message="Cargando más Pokémon..." />;
    }
    if (pageError) {
      return (
        <ErrorView
          compact
          title="No se pudieron cargar más Pokémon"
          message={pageError}
          onRetry={handleRetryPage}
        />
      );
    }
    if (!hasMore) {
      return <Text style={styles.footerText}>Has llegado al final de la Pokédex.</Text>;
    }
    return null;
  }

  function renderListHeader() {
    if (pokemonList.length === 0) {
      return null;
    }
    return (
      <Text style={styles.counterText}>
        Mostrando {pokemonList.length} de {totalCount} Pokémon
      </Text>
    );
  }

  function renderPokemon({ item }) {
    return (
      <View style={styles.gridCell}>
        <PokemonCard pokemon={item} onPress={handleCardPress} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerDecoration} />
        <View style={styles.headerContent}>
          <Text style={styles.title} accessibilityRole="header">
            PokéDex Explorer
          </Text>
          <Text style={styles.subtitle}>Explora, busca y descubre Pokémon</Text>
          <SearchBar
            value={searchText}
            onChangeText={handleChangeSearchText}
            onSubmit={handleSearch}
            onClear={handleClearSearch}
            validationMessage={validationMessage}
          />
        </View>
      </View>

      <View style={styles.body}>
        {renderSearchFeedback()}

        {/* CONCEPTO [FlatList]: solo dibuja las tarjetas visibles (más eficiente que ScrollView + map). */}
        <FlatList
          data={pokemonList}
          renderItem={renderPokemon}
          // CONCEPTO [keyExtractor]: clave estable y única por elemento (el id del Pokémon).
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5} // se dispara a media pantalla del final
          ListHeaderComponent={renderListHeader()}
          ListEmptyComponent={renderListEmpty()}
          ListFooterComponent={renderListFooter()}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  // Aro decorativo que recuerda a una Pokébola.
  headerDecoration: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 26,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerContent: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: SPACING.md,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  listContent: {
    flexGrow: 1, // permite centrar el estado de carga/error cuando la lista está vacía
    padding: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  // Cada celda ocupa exactamente la mitad: la última tarjeta no se estira si queda sola.
  gridCell: {
    width: '50%',
    padding: SPACING.sm,
  },
  counterText: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xs,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  footerText: {
    paddingVertical: SPACING.lg,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
