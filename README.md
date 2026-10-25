# PokéDex Explorer

Aplicación móvil construida con **React Native + Expo** que consume la **PokéAPI**. Muestra los Pokémon en una cuadrícula de dos columnas con scroll infinito, permite buscarlos por nombre o número y abre una ficha con imagen oficial, tipos, altura, peso y las seis estadísticas base.

> Proyecto desarrollado para el taller **"Consumo de API con React Native y Expo — PokéDex"** (Guía del estudiante, 20 de octubre de 2026).

## Integrantes

| Nombre | Rol en el equipo |
| --- | --- |
| `[Nombre del integrante 1]` | `[Rol]` |
| `[Nombre del integrante 2]` | `[Rol]` |
| `[Nombre del integrante 3 (opcional)]` | `[Rol]` |

Repositorio: https://github.com/LinayYMP/Pok-DexExplorer

---

## Contenido

1. [Objetivos](#1-objetivos)
2. [Tecnologías utilizadas](#2-tecnologías-utilizadas)
3. [Requisitos previos](#3-requisitos-previos)
4. [Instalación](#4-instalación)
5. [Ejecución](#5-ejecución)
6. [Endpoints consumidos](#6-endpoints-consumidos)
7. [Arquitectura y árbol de carpetas](#7-arquitectura-y-árbol-de-carpetas)
8. [Responsabilidad de cada archivo](#8-responsabilidad-de-cada-archivo)
9. [Funcionamiento de la búsqueda](#9-funcionamiento-de-la-búsqueda)
10. [Funcionamiento de la paginación](#10-funcionamiento-de-la-paginación-scroll-infinito)
11. [Conversión de altura y peso](#11-conversión-de-altura-y-peso)
12. [Barras de estadísticas](#12-barras-de-estadísticas)
13. [Manejo de errores](#13-manejo-de-errores)
14. [Estados de la interfaz](#14-estados-de-la-interfaz)
15. [useState y useEffect](#15-usestate-y-useeffect)
16. [Decisiones técnicas](#16-decisiones-técnicas)
17. [Pruebas realizadas](#17-pruebas-realizadas)
18. [Lista de verificación de requisitos](#18-lista-de-verificación-de-requisitos)
19. [Capturas de pantalla](#19-capturas-de-pantalla)
20. [Git y GitHub](#20-git-y-github)
21. [Preguntas de preparación para la sustentación](#21-preguntas-de-preparación-para-la-sustentación)
22. [Limitaciones y pruebas pendientes](#22-limitaciones-y-pruebas-pendientes)

---

## 1. Objetivos

Según la guía del taller, al terminar el estudiante podrá:

1. Consumir una API REST con `fetch` y `async/await`, manejando respuesta, error y carga.
2. Diseñar una arquitectura propia que separe la lógica de red de la interfaz, y justificarla.
3. Controlar cuándo se ejecuta una petición con el array de dependencias de `useEffect`.
4. Renderizar listas eficientes con `FlatList` y mostrar imágenes remotas con `Image`.
5. Diseñar estados de interfaz: cargando, error, vacío (sin resultados) y éxito.

## 2. Tecnologías utilizadas

| Tecnología | Versión | Para qué se usa |
| --- | --- | --- |
| Expo (SDK 58) | `~58.0.19` | Plantilla `blank`, servidor de desarrollo y Expo Go |
| React Native | `0.88.0` | Componentes móviles (`View`, `Text`, `TextInput`, `Image`, `FlatList`...) |
| React | `19.3.0` | `useState`, `useEffect`, `useRef` |
| JavaScript | — | Todo el código (sin TypeScript) |
| `fetch` + `async/await` | incluidos | Peticiones HTTP a la PokéAPI (no se instaló ninguna librería HTTP) |
| `react-native-safe-area-context` | `~5.10.1` | `SafeAreaProvider` y `SafeAreaView` (lo pide la guía) |
| `expo-status-bar` | `~58.0.4` | Color del texto de la barra de estado (viene en la plantilla) |
| `react-dom` + `react-native-web` | `19.3.0` / `^0.21.4` | **Opcionales**: solo para abrir la app en el navegador (`npm run web`) |

**Justificación de dependencias:**

- `react-native-safe-area-context`: la guía lo instala con `npx expo install`. Además, en React Native 0.88 el `SafeAreaView` del núcleo está **deprecado** (muestra un aviso pidiendo usar esta librería).
- `react-dom` y `react-native-web`: se agregaron con `npx expo install` para poder probar la app en el navegador y generar las capturas de verificación. La app móvil no las usa; se pueden quitar sin afectarla.
- No se usan TypeScript, Expo Router, librerías de navegación, bases de datos, autenticación ni backend propio.

## 3. Requisitos previos

- **Node.js 22 LTS o superior** (probado con Node 24.14.0) y npm (probado con 11.9.0).
- **Git** (probado con 2.53).
- **Visual Studio Code** (recomendado).
- Para ver la app en el celular: **Expo Go** actualizado (compatible con SDK 58) desde Play Store o App Store, y el computador y el celular en la **misma red Wi-Fi**.
- Para el emulador: **Android Studio** con un dispositivo virtual (AVD) creado.
- Conexión a internet (la app consulta la PokéAPI en vivo).

## 4. Instalación

### 4.1 Cómo se creó el proyecto (comandos de la guía)

```bash
npx create-expo-app@latest pokedex-explorer --template blank
cd pokedex-explorer
npx expo install react-native-safe-area-context
npx expo start
```

Opcional, para probar en el navegador:

```bash
npx expo install react-dom react-native-web
```

### 4.2 Instalar desde GitHub (Windows, PowerShell o terminal de VS Code)

```powershell
cd $HOME\Desktop
git clone https://github.com/LinayYMP/Pok-DexExplorer.git pokedex-explorer
cd pokedex-explorer
npm install
```

> Se clona con el nombre `pokedex-explorer` para que la carpeta coincida con el nombre del proyecto en `package.json`.

### 4.3 Instalar desde el ZIP

1. Descomprime `pokedex-explorer.zip` (por ejemplo en el Escritorio).
2. Abre una terminal dentro de la carpeta `pokedex-explorer`.
3. Ejecuta `npm install` (el ZIP no incluye `node_modules`).

### 4.4 Abrir en Visual Studio Code

- Desde la terminal, dentro de la carpeta: `code .`
- O en VS Code: **Archivo → Abrir carpeta…** y elegir `pokedex-explorer`.
- Terminal integrada: **Terminal → Nueva terminal** (o `` Ctrl + ` ``).

## 5. Ejecución

```bash
npx expo start
```

Cuando aparezca el código QR:

| Dónde | Cómo |
| --- | --- |
| **Celular Android** | Abre Expo Go → "Scan QR code" → escanea el QR de la terminal |
| **iPhone** | Escanea el QR con la cámara y ábrelo en Expo Go |
| **Emulador Android** | Inicia el emulador desde Android Studio (Device Manager) y presiona `a` en la terminal de Expo |
| **Navegador (opcional)** | Presiona `w` o ejecuta `npm run web` |

Atajos útiles en la terminal de Expo: `r` recarga la app, `j` abre las herramientas de depuración.
Si el celular no se conecta (redes de universidad o con firewall), prueba `npx expo start --tunnel`.
Si algo se ve desactualizado, limpia la caché con `npx expo start -c`.

### Scripts de `package.json`

| Comando | Qué hace |
| --- | --- |
| `npm start` | `expo start` |
| `npm run android` | Inicia Expo y abre el emulador Android |
| `npm run web` | Inicia Expo en el navegador |
| `npm test` | Pruebas sin internet de `utils` y `services` (Node) |
| `npm run test:live` | Pruebas contra la PokéAPI real (necesita internet) |

## 6. Endpoints consumidos

Base: `https://pokeapi.co/api/v2/` (pública, gratuita, sin API key, responde JSON).

| Endpoint | Uso en la app | Ejemplo | Función |
| --- | --- | --- | --- |
| `GET /pokemon?limit={n}&offset={m}` | Lista paginada (20 por página) | `/pokemon?limit=20&offset=0` | `fetchPokemonPage()` |
| `GET /pokemon/{nombre o id}` | Ficha de un Pokémon y búsqueda | `/pokemon/pikachu` o `/pokemon/25` | `fetchPokemonDetail()` |
| Imagen oficial (sin pedir la ficha) | Imagen de cada tarjeta | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png` | `getArtworkUrl()` |

## 7. Arquitectura y árbol de carpetas

La guía deja la estructura a decisión del equipo con una sola regla: **las llamadas a la API no deben quedar mezcladas con los estilos y el JSX**. Por eso el código se separó en capas:

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

## 8. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
| --- | --- |
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

## 9. Funcionamiento de la búsqueda

Todo ocurre en `PokemonListScreen.js` (funciones `handleSearch` y `runSearch`):

1. El usuario escribe en el `TextInput` (estado `searchText`) y pulsa **"Buscar"** (o la tecla buscar del teclado).
2. `normalizeSearchTerm()` limpia el texto: `trim()` + minúsculas. También acepta `#025` o `025` (se envía `25`) y convierte espacios internos en guiones (`Mr Mime` → `mr-mime`).
3. Si queda vacío se muestra *"Escribe un nombre o un número para buscar."* y **no** se hace ninguna petición.
4. Si ya hay una búsqueda en curso con el mismo término, se ignora el clic (evita peticiones repetidas).
5. `runSearch()` marca el estado `loading` (se ve *"Buscando "pikachu"..."*) y llama a `fetchPokemonDetail(term)` → `GET /pokemon/pikachu`.
6. Resultado:
   - **Existe** → `onSelectPokemon(pokemon.id, pokemon)` abre la ficha **con los datos ya cargados** (no se pide dos veces).
   - **404** → estado **Sin resultados**: *"No se encontró ningún Pokémon con el nombre o número "…""* + botón "Limpiar búsqueda".
   - **Fallo de conexión** → estado **Error**: *"No pudimos completar la búsqueda"* + **"Reintentar"**, que repite la misma búsqueda.
7. **Respuestas antiguas:** cada búsqueda recibe un número (`latestSearchIdRef`). Si llega la respuesta de una búsqueda anterior, se descarta. Al limpiar la búsqueda o tocar una tarjeta también se invalida la búsqueda en curso.
8. Al cambiar el texto se borran el mensaje de validación y el mensaje anterior de "sin resultados" o error.

## 10. Funcionamiento de la paginación (scroll infinito)

Estados en `PokemonListScreen.js`: `pokemonList`, `offset`, `nextOffset`, `hasMore`, `totalCount`, `isLoadingPage`, `pageError` y `retryCount`.

1. Al montar la pantalla, `offset = 0` y el `useEffect` con dependencias `[offset, retryCount]` pide `GET /pokemon?limit=20&offset=0`.
2. Cada resultado se convierte con `mapPokemonListItem()`: el id sale del final de la URL (`getIdFromUrl`) y la imagen se construye con ese id (`getArtworkUrl`).
3. `mergeUniqueById()` agrega la página nueva **sin repetir ids**.
4. `nextOffset` queda en `offset + resultados recibidos` y `hasMore` en `data.next !== null`.
5. Cuando el usuario se acerca al final (`onEndReachedThreshold={0.5}`), `FlatList` llama a `handleEndReached()`:
   - Si ya hay una página cargando, si la anterior falló o si no hay más páginas, **no hace nada**.
   - Si no, ejecuta `setOffset(nextOffset)`. Ese cambio vuelve a ejecutar el efecto y se piden 20 más.
6. Mientras carga, el pie de la lista muestra *"Cargando más Pokémon..."*. Si falla, el pie muestra el error con **"Reintentar"** y la lista ya cargada **se conserva**.
7. **¿Por qué no hay peticiones duplicadas?** Aunque `onEndReached` se dispare varias veces seguidas, todas asignan el mismo `nextOffset`; asignar el mismo valor no cambia el estado, así que el efecto se ejecuta una sola vez. Además se bloquea mientras `isLoadingPage` es `true`.
8. El encabezado de la lista muestra el progreso: *"Mostrando 40 de 1351 Pokémon"*.

## 11. Conversión de altura y peso

La API entrega la altura en **decímetros** y el peso en **hectogramos**:

| Dato | Fórmula | Pikachu (API) | En la app |
| --- | --- | --- | --- |
| Altura | `height / 10` → metros | `4` | `0,4 m` |
| Peso | `weight / 10` → kilogramos | `60` | `6,0 kg` |

Funciones: `convertHeightToMeters()`, `convertWeightToKilograms()` y `formatMeasure()` (un decimal con coma, como se escribe en español).

## 12. Barras de estadísticas

- Se muestran las 6 estadísticas reales de la respuesta (`hp`, `attack`, `defense`, `special-attack`, `special-defense`, `speed`) con su valor numérico.
- Nombres en español: PS, Ataque, Defensa, At. especial, Def. especial, Velocidad (`STAT_LABELS`).
- Ancho de la barra: `getStatPercentage(valor) = valor / 255 × 100`, limitado entre 0 % y 100 %. Un valor `0` da una barra vacía sin errores.
- Color según el valor: menor de 50 rojo, menor de 80 naranja, menor de 110 ámbar, menor de 150 verde y desde 150 azul.

## 13. Manejo de errores

`requestJson()` en `pokemonApi.js` sigue este orden:

1. `await fetch(url)`: **solo falla por problemas de conexión** (sin internet, DNS, tiempo agotado). Un 404 **no** hace fallar a `fetch`.
2. Revisa **`response.ok` antes de `response.json()`**: un nombre inexistente responde 404 con texto plano ("Not Found"), que no es JSON.
3. Clasifica el resultado:

| Situación | Tipo de error | Lo que ve el usuario |
| --- | --- | --- |
| HTTP 404 | `NOT_FOUND` | **Sin resultados** (sin botón Reintentar, porque repetir no cambia nada) |
| Sin internet / DNS | `NETWORK` | "No pudimos conectarnos con la PokéAPI. Revisa tu conexión a internet." + **Reintentar** |
| Más de 15 s sin respuesta | `NETWORK` | "La PokéAPI tardó demasiado en responder…" + **Reintentar** |
| Otro código (500, 503…) | `SERVER` | "La PokéAPI respondió con un error (código 500)…" + **Reintentar** |
| Respuesta que no es JSON | `SERVER` | "La respuesta de la PokéAPI no tiene un formato válido." + **Reintentar** |

Así **un 404 nunca se confunde con un error de conexión**. Además, todos los efectos apagan el indicador de carga en `finally`, y el `AbortController` evita que una petición colgada deje la app cargando para siempre.

## 14. Estados de la interfaz

| Estado | Dónde aparece | Componente | Texto |
| --- | --- | --- | --- |
| **Cargando** | Apertura de la app | `LoadingView` | "Cargando Pokémon..." |
| **Cargando** | Pie de la lista | `LoadingView` compacto | "Cargando más Pokémon..." |
| **Cargando** | Panel de búsqueda | `LoadingView` compacto | "Buscando "pikachu"..." |
| **Cargando** | Ficha desde una tarjeta | `LoadingView` | "Cargando ficha del Pokémon..." |
| **Error** | Primera carga | `ErrorView` | "No pudimos cargar la Pokédex" + Reintentar |
| **Error** | Pie de la lista | `ErrorView` compacto | "No se pudieron cargar más Pokémon" + Reintentar |
| **Error** | Búsqueda | `ErrorView` compacto | "No pudimos completar la búsqueda" + Reintentar |
| **Error** | Ficha | `ErrorView` | "No pudimos cargar la ficha" + Reintentar |
| **Sin resultados** | Búsqueda con 404 | `EmptyView` compacto | "Sin resultados" + Limpiar búsqueda |
| **Éxito** | Lista / ficha | `FlatList` / `PokemonDetailScreen` | Cuadrícula o ficha completa |

## 15. useState y useEffect

- **`useState`** guarda datos que cambian y que deben redibujar la pantalla. Al llamar a `setAlgo(nuevoValor)`, React vuelve a dibujar el componente con el valor nuevo. Ejemplos: `pokemonList`, `searchText`, `isLoadingPage`, `selection`.
- **`useEffect`** ejecuta código **después** de dibujar (efectos secundarios: peticiones, listeners). Su **array de dependencias** indica **cuándo** debe volver a ejecutarse.
- Si un efecto guardara datos en un estado que también está en sus dependencias, se ejecutaría sin parar. Ninguno de los efectos del proyecto hace eso.

| Efecto | Dependencias | Se ejecuta cuando… | Por qué no se repite sin parar |
| --- | --- | --- | --- |
| `PokemonListScreen` → cargar página | `[offset, retryCount]` | Se abre la app, cambia `offset` (scroll infinito) o se pulsa Reintentar | Guarda en `pokemonList`, `nextOffset`, etc., que **no** son dependencias |
| `PokemonDetailScreen` → cargar ficha | `[pokemonId, initialPokemon, retryCount]` | Se abre una ficha o se pulsa Reintentar | `setPokemon` no cambia ninguna dependencia |
| `App` → botón atrás de Android | `[selection]` | Se abre o se cierra una ficha | Solo registra/quita un listener |

**Función de limpieza (`return () => { ... }`):** en los efectos de red una variable `isCurrentRequest` pasa a `false` si la pantalla se cierra o si cambian las dependencias antes de que llegue la respuesta. Así una respuesta vieja no actualiza el estado.

**¿Por qué la búsqueda no usa `useEffect`?** Porque la dispara una acción concreta del usuario (pulsar "Buscar"); por eso se hace en el manejador del evento. Para descartar respuestas antiguas se usa `useRef`, que guarda un valor entre renderizados sin provocar uno nuevo.

En el código, cada concepto visto en clase está marcado con un comentario `CONCEPTO [nombre]` (por ejemplo `CONCEPTO [response.ok]`, `CONCEPTO [array de dependencias]`, `CONCEPTO [keyExtractor]`). Búscalo en VS Code con `Ctrl + Shift + F`.

## 16. Decisiones técnicas

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

## 17. Pruebas realizadas

### 17.1 Ejecutadas realmente (24/10/2026, Windows 11, Node 24.14.0)

| Prueba | Comando | Resultado |
| --- | --- | --- |
| Funciones auxiliares + servicio con `fetch` simulado | `npm test` | **20/20** correctas |
| Servicio contra la PokéAPI real | `npm run test:live` | **7/7** correctas |
| Compilación del bundle Android (Metro + Hermes) | `npx expo export --platform android` | Compiló sin errores (640 módulos) |
| Diagnóstico de dependencias y configuración | `npx expo-doctor` | **20/20** comprobaciones superadas |
| Prueba de punta a punta en la versión web (Edge sin interfaz, pantalla de 390×844) | script externo con Chrome DevTools Protocol (no incluido en el repositorio) | **51/51** comprobaciones, 0 errores y 0 avisos en consola |

La prueba de punta a punta en web verificó, interactuando con la app real: estado de carga inicial; primera petición `limit=20&offset=0`; 20 tarjetas en 2 columnas; imágenes con tamaño definido; `#001` y nombres con mayúscula; scroll infinito con indicador al final; 40, 60, 80… sin duplicados y **sin peticiones repetidas** al hacer scroll varias veces; búsqueda de `"  Pikachu  "`, `25` y `#006`; ficha con tipo, `0,4 m`, `6,0 kg`, 6 estadísticas y barras proporcionales a 255 (error < 1 %); "Volver a la lista" sin volver a pedir la lista; tocar una tarjeta abre su ficha; validación de búsqueda vacía sin petición; 404 → "Sin resultados"; error de conexión simulado → mensaje distinto + "Reintentar" que funciona; una respuesta antigua **no** sobrescribe una búsqueda más reciente; error al cargar más **conserva la lista** y no genera peticiones en bucle; error en la carga inicial + "Reintentar"; pantalla ancha con 2 columnas y ancho limitado.

### 17.2 No ejecutadas (pendientes)

- **No se ejecutó en un celular real ni en un emulador Android/iOS.** En este equipo no había un dispositivo virtual creado ni un celular conectado. Falta comprobar en Expo Go: márgenes seguros (notch y barra de navegación), botón físico "atrás" de Android, teclado y fluidez del scroll.

## 18. Lista de verificación de requisitos

Leyenda de evidencia: **E2E** = prueba de punta a punta en la versión web · **Node** = `npm test` / `npm run test:live` · **Código** = revisión del código · **Pendiente** = falta probar en dispositivo.

| # | Requisito | Estado | Evidencia |
| --- | --- | --- | --- |
| 1 | La aplicación inicia correctamente | ✅ (web) / ⏳ (móvil) | E2E, bundle Android compilado · Pendiente en Expo Go |
| 2 | Se cargan los primeros 20 Pokémon | ✅ | E2E, Node |
| 3 | Tarjetas en dos columnas (`numColumns={2}`) | ✅ | E2E, Código |
| 4 | Imágenes remotas con `width` y `height` | ✅ | E2E, Código |
| 5 | Números con tres dígitos (`padStart(3, '0')`) | ✅ | E2E, Node |
| 6 | Búsqueda por nombre | ✅ | E2E, Node |
| 7 | Búsqueda por número | ✅ | E2E, Node |
| 8 | Espacios al inicio/final y mayúsculas no afectan | ✅ | E2E, Node |
| 9 | Pokémon inexistente → "Sin resultados" | ✅ | E2E, Node |
| 10 | Error de conexión → mensaje + "Reintentar" | ✅ | E2E, Node |
| 11 | Paginación de 20 en 20 sin duplicados | ✅ | E2E, Node |
| 12 | Sin peticiones infinitas al hacer scroll | ✅ | E2E |
| 13 | Ficha con tipos, altura (m) y peso (kg) | ✅ | E2E, Node |
| 14 | Seis estadísticas con barras proporcionales a 255 | ✅ | E2E, Node |
| 15 | Botón "Volver a la lista" | ✅ | E2E |
| 16 | Estados de carga y error visibles | ✅ | E2E (capturas 1, 3, 6, 10, 12, 13) |
| 17 | Código separado por responsabilidades | ✅ | Código (sección 7) |
| 18 | Comentarios con los conceptos de clase | ✅ | Código (`CONCEPTO [...]`) |
| 19 | README con instalación, ejecución y explicación | ✅ | Este archivo |
| — | Placeholder "Busca por nombre o número..." y botón "Buscar" | ✅ | E2E |
| — | `autoCapitalize="none"` y `autoCorrect={false}` | ✅ | Código (`SearchBar.js`) |
| — | `FlatList` con `numColumns`, `keyExtractor`, `onEndReached` (sin `ScrollView` + `map`) | ✅ | Código |
| — | `response.ok` antes de `response.json()` | ✅ | Node (prueba del 404) |
| — | Distintivo con color propio por tipo | ✅ | E2E (captura 11) |
| — | Código en inglés, interfaz en español | ✅ | Código |
| — | Capturas de pantalla del celular | ⏳ | Pendiente (sección 19) |
| — | Respuestas de reflexión | ✅ | Sección 21 (la guía no trae preguntas exactas) |
| — | Nombres de los integrantes | ⏳ | Completar la tabla del inicio |

## 19. Capturas de pantalla

### 19.1 Capturas de verificación ya incluidas (versión web)

La carpeta `screenshots/web-preview/` contiene **13 capturas reales** tomadas durante la prueba automática de la **versión web** (navegador Edge, pantalla simulada de 390×844). **No son capturas de un celular.**

| Archivo | Muestra |
| --- | --- |
| `1.png` | Estado cargando al abrir la app |
| `2.png` | Pantalla principal con la cuadrícula |
| `3.png` | Indicador al final de la lista |
| `4.png` | Nuevos Pokémon (#021 en adelante) |
| `5.png` | Barra de búsqueda con texto |
| `6.png` | Estado cargando durante la búsqueda |
| `7.png` | Resultado de la búsqueda: ficha de Pikachu con tipos y estadísticas |
| `8.png` | Búsqueda vacía |
| `9.png` | Estado sin resultados |
| `10.png` | Error de conexión en la búsqueda |
| `11.png` | Ficha con dos tipos (Bulbasaur) |
| `12.png` | Error al cargar más (la lista se conserva) |
| `13.png` | Error en la carga inicial |

### 19.2 Capturas que debe tomar el equipo en el celular

Guárdalas en `screenshots/` (por ejemplo `screenshots/movil-01-lista.png`):

| Captura | Cómo obtenerla |
| --- | --- |
| Pantalla principal con la cuadrícula | Abre la app y espera la carga |
| Barra de búsqueda | Escribe `pikachu` sin pulsar "Buscar" |
| Resultado de una búsqueda | Pulsa "Buscar" y captura la ficha |
| Ficha con tipos y estadísticas | Busca `charizard` o `bulbasaur` (dos tipos) |
| Estado de carga | Recarga con `r` y captura enseguida, o haz scroll rápido al final para ver "Cargando más Pokémon..." |
| Sin resultados | Busca `pokemoninexistente` |
| Error | Activa el modo avión y pulsa "Buscar"; luego desactívalo y pulsa "Reintentar" |
| Paginación | Baja hasta ver `#021` o más y el contador "Mostrando 40 de…" |

Atajos para capturar: **Android** botón de encendido + bajar volumen · **iPhone** botón lateral + subir volumen · **Emulador Android** ícono de cámara en la barra lateral.

## 20. Git y GitHub

### Subir cambios nuevos

```bash
git add .
git commit -m "Describe el cambio"
git push
```

### Si se empieza desde cero en otro computador

```bash
git init
git add .
git commit -m "PokéDex Explorer"
git branch -M main
git remote add origin https://github.com/LinayYMP/Pok-DexExplorer.git
git push -u origin main
```

La primera vez, Git para Windows abre una ventana para iniciar sesión en GitHub. `node_modules/`, `.expo/` y `dist/` no se suben (están en `.gitignore`).

## 21. Preguntas de preparación para la sustentación

> La guía del taller pide "respuestas de reflexión" pero **no incluye preguntas exactas**. Estas preguntas son de preparación, basadas en el código del proyecto.

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

### Flujo completo: del texto escrito a la ficha

1. El usuario escribe `" Pikachu "` → `onChangeText` guarda el texto en `searchText` (`useState`).
2. Pulsa **"Buscar"** → `handleSearch()` → `normalizeSearchTerm()` devuelve `"pikachu"`.
3. `runSearch("pikachu")` asigna un número de búsqueda (`latestSearchIdRef`), cambia el estado a `loading` y la pantalla muestra *"Buscando "pikachu"..."*.
4. `fetchPokemonDetail("pikachu")` → `requestJson()` → `await fetch("https://pokeapi.co/api/v2/pokemon/pikachu")`.
5. `response.ok` es `true` → `await response.json()` → `mapPokemonDetail()` deja solo id, nombre, imagen, tipos, altura en metros, peso en kg y estadísticas.
6. De vuelta en `runSearch()`, se comprueba que sigue siendo la búsqueda más reciente y se llama a `onSelectPokemon(25, pokemon)`.
7. `App.js` guarda `{ id: 25, pokemon }` en `selection` y dibuja `PokemonDetailScreen` encima de la lista.
8. Como recibió `initialPokemon`, la ficha **no** hace otra petición y muestra imagen, `#025`, "Eléctrico", `0,4 m`, `6,0 kg` y las 6 barras.
9. "Volver a la lista" (o el botón atrás de Android) pone `selection` en `null` y la lista reaparece tal como estaba.

## 22. Limitaciones y pruebas pendientes

- Falta probar en **Expo Go** (celular) o en un **emulador Android**; las pruebas interactivas se hicieron en la versión web.
- La app necesita internet; no guarda datos para uso sin conexión.
- La búsqueda es exacta (nombre completo o número); no sugiere nombres parecidos.
- Las capturas del celular y los nombres de los integrantes deben completarlos el equipo.
- `npm audit` reporta avisos en dependencias internas de las herramientas de Expo; no afectan el código de la app y no se forzaron actualizaciones para no romper la compatibilidad con SDK 58.
