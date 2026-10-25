# PokéDex Explorer
Aplicación móvil construida que muestra los Pokémon en una cuadrícula de dos columnas con scroll infinito, permite buscarlos por nombre o número y abre una ficha con imagen oficial, tipos, altura, peso y las seis estadísticas base.

## Integrantes
Linay Yuliani Muñoz Perez | Full

Repositorio: https://github.com/LinayYMP/Pok-DexExplorer

## Arquitectura y árbol de carpetas

La guía deja la estructura a decisión del equipo con una sola regla: **las llamadas a la API no deben quedar mezcladas con los estilos y el JSX. Por eso el código se separó en capas:

```
                     ┌──────────────────────────┐
                     │          App.js          │  alterna lista ↔ ficha (useState)
                     └────────────┬─────────────┘
              ┌───────────────────┴───────────────────┐
   ┌──────────▼──────────┐                 ┌──────────▼───────────┐
   │ PokemonListScreen   │                 │ PokemonDetailScreen  │  screens/: estado, efectos
   └──────────┬──────────┘                 └──────────┬───────────┘  y composición de componentes
              │ usa componentes                        │
   SearchBar · PokemonCard · LoadingView · ErrorView · EmptyView · TypeBadge · StatBar · AppButton
              │                                        │            components/: solo interfaz
              └──────────────┬─────────────────────────┘
                   ┌─────────▼──────────┐
                   │ services/pokemonApi│  única capa que usa fetch
                   └─────────┬──────────┘
                   ┌─────────▼──────────┐       ┌────────────────────┐
                   │ utils/pokemonUtils │◄──────│ constants/*        │  datos fijos (colores,
                   └────────────────────┘       └────────────────────┘  tipos, estadísticas)
```

**¿Por qué así?**

- **`services/`** concentra la red: si cambia la URL base o la forma de manejar errores, se modifica un solo archivo. Las pantallas reciben datos listos y nunca llaman a `fetch` directamente.
- **`utils/`** contiene funciones puras (sin red y sin JSX). Se pueden probar con Node sin abrir la app.
- **`components/`** son piezas visuales reutilizables que solo reciben *props*; no saben de dónde salen los datos.
- **`screens/`** guardan el estado (`useState`), deciden cuándo pedir datos (`useEffect`) y combinan los componentes.
- **`constants/`** reúne valores fijos (paleta, colores por tipo, nombres de estadísticas) para no repetirlos.

### Árbol final

```
pokedex-explorer/
├── App.js                       # Punto de entrada: SafeArea + alterna lista/ficha
├── index.js                     # registerRootComponent(App) (de la plantilla)
├── app.json                     # Configuración de Expo (nombre "PokéDex Explorer")
├── package.json                 # Dependencias y scripts
├── package-lock.json
├── README.md
├── LICENSE                      # Licencia de la plantilla de Expo
├── .gitignore
├── assets/                      # Iconos y splash de la plantilla
├── screenshots/
│   └── web-preview/             # 13 capturas reales de la versión web (ver sección 19)
├── src/
│   ├── components/
│   │   ├── AppButton.js
│   │   ├── EmptyView.js
│   │   ├── ErrorView.js
│   │   ├── LoadingView.js
│   │   ├── PokemonCard.js
│   │   ├── SearchBar.js
│   │   ├── StatBar.js
│   │   └── TypeBadge.js
│   ├── constants/
│   │   ├── pokemonStats.js
│   │   ├── pokemonTypes.js
│   │   └── theme.js
│   ├── screens/
│   │   ├── PokemonDetailScreen.js
│   │   └── PokemonListScreen.js
│   ├── services/
│   │   └── pokemonApi.js
│   └── utils/
│       └── pokemonUtils.js
└── tests/
    ├── pokemonApi.test.mjs
    ├── pokemonUtils.test.mjs
    └── live/
        └── pokeApi.live.test.mjs
```

## Responsabilidad de cada archivo

| `App.js` | Envuelve la app en `SafeAreaProvider`/`SafeAreaView`. Guarda en `selection` qué Pokémon está abierto: `null` muestra la lista; `{ id, pokemon }` muestra la ficha encima de la lista. Maneja el botón físico "atrás" de Android con `BackHandler`. |
| `src/services/pokemonApi.js` | **Única capa de red.** `requestJson()` hace `fetch` con `async/await`, revisa `response.ok` antes de `response.json()`, cancela a los 15 s y clasifica los errores (`NOT_FOUND`, `NETWORK`, `SERVER`). Expone `fetchPokemonPage(offset, limit)` y `fetchPokemonDetail(nombreOId)`. |
| `src/utils/pokemonUtils.js` | Funciones puras: extraer el id de la URL, construir la URL de la imagen, formatear `#025`, poner mayúscula inicial, normalizar la búsqueda, convertir altura/peso, calcular el porcentaje de las barras, traducir tipos y estadísticas, mapear respuestas de la API y unir páginas sin duplicados. |
| `src/constants/theme.js` | Paleta de colores, espaciados, radios y ancho máximo del contenido. |
| `src/constants/pokemonTypes.js` | Para cada tipo de la API: nombre en español, color del distintivo y color de texto legible. |
| `src/constants/pokemonStats.js` | Nombres en español de las 6 estadísticas, el máximo `255` y los rangos de color de las barras. |
| `src/screens/PokemonListScreen.js` | Vista de lista: encabezado, barra de búsqueda, `FlatList` de 2 columnas con scroll infinito, estados de carga/error/sin resultados y la lógica de búsqueda. |
| `src/screens/PokemonDetailScreen.js` | Vista de detalle: pide la ficha si no llegó desde la búsqueda, y muestra imagen grande, nombre, número, tipos, altura, peso, 6 estadísticas y "Volver a la lista". |
| `src/components/SearchBar.js` | `TextInput` (placeholder "Busca por nombre o número...", `autoCapitalize="none"`, `autoCorrect={false}`), botón para limpiar y botón "Buscar". |
| `src/components/PokemonCard.js` | Tarjeta: imagen remota con `width`/`height` explícitos, número de 3 dígitos y nombre. Si la imagen falla muestra "?". |
| `src/components/LoadingView.js` | Estado **Cargando**: `ActivityIndicator` + texto. Versión grande o compacta. |
| `src/components/ErrorView.js` | Estado **Error**: mensaje en español + botón **"Reintentar"**. |
| `src/components/EmptyView.js` | Estado **Sin resultados**: mensaje + acción opcional ("Limpiar búsqueda"). |
| `src/components/TypeBadge.js` | Distintivo de un tipo con su color propio. |
| `src/components/StatBar.js` | Fila de estadística: nombre, valor y barra proporcional a 255. |
| `src/components/AppButton.js` | Botón reutilizable con `Pressable` (el `Button` del núcleo no permite cambiar su estilo). |
| `tests/pokemonUtils.test.mjs` | 12 pruebas de las funciones auxiliares. |
| `tests/pokemonApi.test.mjs` | 8 pruebas del servicio con un `fetch` simulado (404, 500, sin conexión, tiempo agotado, JSON inválido, URLs). |
| `tests/live/pokeApi.live.test.mjs` | 7 pruebas contra la PokéAPI real. |


## Decisiones técnicas

Donde la guía dejaba libertad, se eligió la opción más sencilla y compatible:

1. **Sin librería de navegación:** `App.js` usa un estado (`selection`) para mostrar la ficha **encima** de la lista. La lista sigue montada debajo, así que al volver se conserva el scroll y no se repiten peticiones.
2. **La búsqueda abre la ficha directamente** y le pasa los datos ya consultados (una sola petición).
3. **"Sin resultados" y el error de búsqueda se muestran en un panel sobre la cuadrícula** para no perder la lista ni la posición del scroll.
4. **Normalización ampliada:** además de `trim()` y minúsculas, se aceptan `#025` / `025` y nombres con espacios.
5. **Coma decimal** en altura y peso (`0,4 m`), como se escribe en español.
6. **Idioma:** identificadores (variables, funciones, archivos) en inglés y textos de la interfaz en español, como pide la guía. Los comentarios explicativos están en español para facilitar la sustentación.
7. **Componentes adicionales** a la estructura sugerida: `SearchBar`, `EmptyView` (estado sin resultados) y `AppButton` (evita repetir estilos de botón en 5 lugares).
8. **Importaciones con extensión `.js`**: Metro las acepta y permiten que Node ejecute las pruebas de `utils` y `services` sin herramientas extra.
9. **Tiempo máximo de 15 s por petición** con `AbortController`, para que ningún estado de carga quede activo indefinidamente.
10. **`count` de la API** (1351 al momento de las pruebas) incluye formas especiales con ids desde 10001; aparecen al final del scroll infinito. Si alguna no tiene imagen oficial, la tarjeta muestra "?".


## respuestas de reflexion

**1. ¿Qué es una API REST?**
Es un servicio al que se accede por HTTP usando URLs que representan recursos (`/pokemon`, `/pokemon/25`) y métodos como `GET`. Responde datos (aquí en JSON). La PokéAPI es pública y no requiere API key.

**2. ¿Qué hace `fetch`?**
Envía una petición HTTP y devuelve una promesa con un objeto `Response`. En el proyecto solo se usa dentro de `requestJson()` en `src/services/pokemonApi.js`. `fetch` solo rechaza la promesa cuando no hay conexión; un 404 llega como respuesta normal.

**3. ¿Para qué sirven `async` y `await`?**
`async` convierte una función en asíncrona (siempre devuelve una promesa). `await` pausa esa función hasta que la promesa se resuelve, sin congelar la interfaz. Permite escribir `const response = await fetch(url)` como si fuera código secuencial y capturar errores con `try/catch`.

**4. ¿Qué diferencia hay entre `useState` y `useEffect`?**
`useState` **guarda** datos que, al cambiar, redibujan la pantalla (por ejemplo `pokemonList`). `useEffect` **ejecuta** código después del dibujado y controla **cuándo** con su array de dependencias (por ejemplo, pedir una página cuando cambia `offset`).

**5. ¿Por qué es importante `response.ok`?**
Porque indica si el código HTTP está entre 200 y 299. Si se llama a `response.json()` con un 404, falla: la PokéAPI responde "Not Found" en texto plano. En `requestJson()` se revisa `response.ok` primero y se lanza un error clasificado.

**6. ¿Qué ocurre cuando la API responde 404?**
`createHttpError(404)` crea un error de tipo `NOT_FOUND`. En la búsqueda, `runSearch()` lo detecta y muestra el estado **Sin resultados** (sin "Reintentar"). Un error de conexión, en cambio, es de tipo `NETWORK` y muestra **Error** con "Reintentar".

**7. ¿Cómo se obtiene el id desde la URL?**
Con `getIdFromUrl()`: `"https://pokeapi.co/api/v2/pokemon/25/".split('/')` y `filter(Boolean)` (quita el texto vacío de la barra final); el último elemento es `"25"` y se convierte con `Number()`.

**8. ¿Por qué `FlatList` en lugar de `ScrollView` con `map`?**
`ScrollView` dibuja **todos** los elementos a la vez; con cientos de Pokémon consume mucha memoria. `FlatList` solo dibuja los que están cerca de la pantalla y trae `numColumns` y `onEndReached`, necesarios para la cuadrícula y el scroll infinito.

**9. ¿Qué hace `keyExtractor`?**
Da una clave única y estable a cada elemento: `keyExtractor={(item) => String(item.id)}`. React usa esa clave para saber qué tarjeta cambió y no volver a dibujar las demás. Por eso `mergeUniqueById()` evita ids repetidos.

**10. ¿Cómo funciona la paginación?**
El efecto con `[offset, retryCount]` pide `limit=20&offset={offset}`. Cuando `FlatList` llama a `onEndReached`, `handleEndReached()` hace `setOffset(nextOffset)`; ese cambio vuelve a ejecutar el efecto y se agregan 20 más con `mergeUniqueById()`. Cuando `next` es `null`, `hasMore` pasa a `false` y se muestra "Has llegado al final de la Pokédex".

**11. ¿Cómo se evitan las solicitudes duplicadas?**
(a) `handleEndReached()` no hace nada si `isLoadingPage`, `pageError` o `!hasMore`. (b) Varias llamadas seguidas asignan el mismo `nextOffset`, y asignar el mismo valor no vuelve a ejecutar el efecto. (c) En la búsqueda, pulsar "Buscar" con el mismo término mientras carga se ignora. (d) Volver de la ficha no vuelve a pedir la lista porque la lista nunca se desmonta. (e) La búsqueda pasa la ficha ya cargada, así que la ficha no la pide otra vez.

**12. ¿Por qué se separó la lógica de red de los componentes visuales?**
Es la regla de la guía y además: el código de red está en un solo lugar (`pokemonApi.js`), los componentes son reutilizables porque solo reciben *props*, y las funciones de `utils` y `services` se pueden probar con Node sin abrir la app (`npm test`).

**13. ¿Cómo se convierten la altura y el peso?**
La API da la altura en decímetros y el peso en hectogramos. `convertHeightToMeters(h) = h / 10` y `convertWeightToKilograms(w) = w / 10`. Pikachu: `4` → `0,4 m` y `60` → `6,0 kg`.

**14. ¿Cómo se calcula la proporción de las barras de estadísticas?**
`getStatPercentage(valor) = Math.min(valor / 255 * 100, 100)`, y devuelve `0` si el valor es 0, negativo o no es un número. Ese porcentaje es el `width` del relleno de la barra en `StatBar.js`. La velocidad de Pikachu (90) da una barra del 35,3 %.

**15. ¿Qué pasaría si se quitara el array de dependencias del efecto de la lista?**
El efecto se ejecutaría después de **cada** renderizado. Como guarda la respuesta en el estado (lo que provoca otro renderizado), pediría páginas sin parar: un bucle infinito de peticiones.

**16. ¿Para qué sirve la función de limpieza de `useEffect`?**
Se ejecuta antes de volver a correr el efecto o cuando el componente se desmonta. En el proyecto marca `isCurrentRequest = false` para ignorar respuestas que llegan tarde, y en `App.js` quita el listener del botón "atrás".

**17. ¿Por qué `autoCapitalize="none"` y `autoCorrect={false}`?**
Para que el teclado no escriba "Pikachu" con mayúscula ni "corrija" nombres como "Bulbasaur". Aun así, `normalizeSearchTerm()` convierte a minúsculas por seguridad.

