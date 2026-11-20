# Spotify Wrapped — Front

SPA en React + Vite para llevar tu propia biblioteca musical y ver tu "Wrapped" con datos reales.
Consume el backend propio ([TPFinalDai](#backend)) y la [iTunes Search API](https://performance-partners.apple.com/search-api)
para explorar el catálogo.

Proyecto final de EFSI y DAI (2026).

## Enlaces del proyecto

| Qué | Dónde |
| --- | --- |
| Front desplegado (Vercel) | COMPLETAR |
| Repositorio del front | [https://github.com/tomigrins/Spotify-Front](https://github.com/tomigrins/Spotify-Front) |
| Repositorio del backend | [https://github.com/UriSuti/TPFinalDai](https://github.com/UriSuti/TPFinalDai) |
| Backend desplegado (Render) | [https://tpfinaldai-9fzc.onrender.com](https://tpfinaldai-9fzc.onrender.com) (probar con `/api/health`) |
| Diseño en Figma | COMPLETAR |
| Tablero en Trello | COMPLETAR |

> El backend está en el plan gratuito de Render: si pasa un rato sin uso, el primer pedido puede tardar
> unos 50 segundos.

## Integrantes

| Integrante | Responsabilidades |
| --- | --- |
| Tomi (`tomigrins`) | Base del proyecto y consumo de la API externa. Pantalla de detalle, diseño responsive y deploy del front en Vercel. |
| Uriel Suti | Integración del front con el backend, aplicación del diseño de Figma, actividad y estadísticas de la biblioteca. |
| Nico Cukier | Base de datos en Neon, despliegue del backend en Render, documentación de la API y tests del backend. |

## Qué se puede hacer

- **Explorar** canciones, álbumes y artistas del catálogo de iTunes, y ver el detalle de cada uno.
- **Biblioteca**: marcar cada canción como *Quiero escuchar*, *Escuchando* o *Escuchado*.
- **Favoritos y reseñas**: puntuar canciones (estrellas) y dejar un comentario.
- **Playlists**: crear, renombrar, borrar y agregar o quitar canciones.
- **Estadísticas / Wrapped**: importar el historial de escucha (export de Spotify en `.json` o usuario de Last.fm),
  ver el resumen de cada año, los artistas y géneros más escuchados y los números de la biblioteca.
- **Actividad**: historial de lo que fuiste haciendo (agregados, reseñas, playlists, importaciones).
- **Perfil** editable (avatar, bio, géneros y artistas preferidos, usuario de Last.fm) y tema claro/oscuro.

## Requisitos

- Node.js 20.19+ o 22.12+ (lo pide Vite 8).
- El backend corriendo y accesible.

## Arranque

1. Levantar el backend (ver su README). Tiene que permitir este origen en `CORS_ORIGIN`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear el `.env` (opcional: si no está, usa `http://localhost:3000/api`):
   ```bash
   cp .env.example .env
   ```
4. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   y abrir **http://localhost:5173**. Con `127.0.0.1` no funciona: es otro origen y otro sitio para la cookie.

Para probar el vencimiento de la sesión, levantar el backend con `JWT_ACCESS_TTL=1m`.

### Variables de entorno

| Variable           | Descripción                                   | Por defecto                 |
| ------------------ | --------------------------------------------- | --------------------------- |
| `VITE_BACKEND_URL` | URL del backend, **con** el prefijo `/api`.   | `http://localhost:3000/api` en desarrollo, `/api` en el build de producción |

Vite incrusta las variables `VITE_*` en el bundle al compilar: después de cambiarla hay que reiniciar `npm run dev`
o volver a hacer el build. No pongas secretos ahí, porque terminan en el navegador.

## Scripts

| Comando           | Qué hace                                         |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente.  |
| `npm run build`   | Build de producción en `dist/`.                  |
| `npm run preview` | Sirve el build de `dist/` para probarlo local.   |
| `npm run lint`    | Corre ESLint sobre todo el proyecto.             |

## Deploy (Vercel)

El front se publica en Vercel y le habla al backend (Render) **a través del mismo dominio**:

- `vercel.json` reenvía `/api/*` a `https://tpfinaldai-9fzc.onrender.com/api/*` y el resto de las rutas a
  `index.html` (así recargar en `/library` o `/detail/123` no da 404).
- Para el navegador, el backend está en el mismo sitio que el front. La cookie de sesión queda guardada
  como propia del dominio de Vercel, y los navegadores que bloquean cookies de terceros (Safari, Chrome con
  esa opción, modo incógnito) no la descartan. Tampoco hace falta CORS.
- En producción el front usa `/api` por defecto. En Vercel, `VITE_BACKEND_URL` se puede dejar sin definir
  o con el valor `/api`. **No** hay que poner la URL de Render: eso volvería a las cookies entre dominios.
- Si cambia la URL del backend, se actualiza el `destination` en `vercel.json`.

Configuración del proyecto en Vercel: framework **Vite**, build `npm run build`, salida `dist`.

## Rutas

| Ruta           | Pantalla            | Acceso                   |
| -------------- | ------------------- | ------------------------ |
| `/login`       | Iniciar sesión      | Solo sin sesión          |
| `/register`    | Registrarse         | Solo sin sesión          |
| `/`            | Inicio              | Con sesión               |
| `/explore`     | Buscar en el catálogo | Con sesión             |
| `/detail/:id`  | Canción, álbum o artista (id de iTunes) | Con sesión |
| `/library`     | Biblioteca          | Con sesión               |
| `/playlists`   | Playlists           | Con sesión               |
| `/profile`     | Perfil y actividad  | Con sesión               |
| `/stats`       | Estadísticas y Wrapped | Con sesión            |
| `*`            | 404                 | Pública                  |

`ProtectedRoute` manda al login si no hay sesión; `PublicRoute` manda al inicio si ya la hay.

## Cómo está armado

```
src/
├── components/   # Piezas de interfaz: common, forms, music, stats, activity
├── context/      # AuthContext (sesión) y ThemeContext (tema)
├── hooks/        # useAuth, useFetch
├── layout/       # Estructura de la app: AppShell, Navbar, Topbar, Footer
├── routes/       # AppRoutes y las rutas protegidas / públicas
├── screen/       # Una pantalla por ruta
├── services/     # Todas las llamadas HTTP
└── utils/        # Formato, estados de la biblioteca, textos de actividad
```

- **`src/services/`**: todas las llamadas HTTP, separadas de la interfaz.
  - `api.js` configura Axios para el backend (con `withCredentials` para mandar la cookie).
  - `authService`, `bibliotecaService`, `wrappedService` y `actividadService` lo usan.
  - `musicApi` consume iTunes y normaliza sus respuestas, así la interfaz no depende de su formato.
  - `errores.js` convierte cualquier falla en un `ApiError` con un `tipo`
    (`conexion`, `sesion`, `limite`, `servidor`, `solicitud`) y un mensaje para mostrar.
- **Sesión**: el JWT está en una cookie `HttpOnly` que pone el backend. El front no lo ve ni lo guarda. Al abrir la
  app pregunta a `GET /api/me` si la sesión sigue valiendo: la expiración la valida siempre el servidor.
  Si un `401` trae un código de sesión (`TOKEN_*`), `AuthContext` cierra la sesión y el login avisa que venció.
  Los demás `401` (por ejemplo, una contraseña incorrecta) no cierran la sesión.
- **Contextos**: `AuthContext` (usuario activo y sesión) y `ThemeContext` (tema). Biblioteca, favoritos, reseñas y
  playlists viven solo en la base de datos.
- **`localStorage`**: guarda únicamente la preferencia de tema.
- **Estados de pantalla**: `useFetch` expone carga, error y datos, y descarta respuestas viejas si cambian las
  dependencias. `LoadingSpinner`, `ErrorMessage` (con reintento) y `EmptyState` los muestran.
- **Catálogo**: las canciones vienen de iTunes. Antes de guardar una en la biblioteca, el front le pide al backend
  que la resuelva (`POST /canciones/resolver`) para obtener su id en el catálogo propio.

## Backend

Este front necesita el backend del TP ([`TPFinalDai`](https://github.com/UriSuti/TPFinalDai)), que expone la API bajo `/api`: autenticación, biblioteca,
favoritos, reseñas, playlists, actividad, estadísticas, Wrapped e importación de historial (Spotify y Last.fm).

## Stack

React 19 · React Router 7 · Axios · Vite 8 · ESLint · fuente Lexend (`@fontsource-variable/lexend`).
