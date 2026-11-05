# Spotify Wrapped — Front

SPA en React + Vite. Consume el backend propio (`TPFinalDai`) y la iTunes Search API para explorar música.

## Arranque

1. Levantar el backend (ver su README). Tiene que permitir este origen en `CORS_ORIGIN`.
2. `npm install`
3. `cp .env.example .env` (opcional: por defecto usa `http://localhost:3000/api`)
4. `npm run dev` y abrir **http://localhost:5173**. Con `127.0.0.1` no funciona: es otro origen y otro sitio para la cookie.

Para probar el vencimiento de la sesión, levantar el backend con `JWT_ACCESS_TTL=1m`.

## Cómo está armado

- **`src/services/`**: todas las llamadas HTTP, separadas de la interfaz. `api.js` configura Axios para el
  backend; `authService`, `bibliotecaService` y `wrappedService` lo usan; `musicApi` consume iTunes y normaliza
  sus respuestas; `errores.js` convierte cualquier falla en un `ApiError` con un `tipo` y un mensaje para mostrar.
- **Sesión**: el JWT está en una cookie `HttpOnly` que pone el backend. El front no lo ve ni lo guarda. Al abrir la
  app pregunta a `GET /api/me` si la sesión sigue valiendo: la expiración la valida siempre el servidor.
  Si un `401` trae un código de sesión (`TOKEN_*`), `AuthContext` cierra la sesión y el login avisa que venció.
- **Contextos**: `AuthContext` (usuario activo y sesión) y `ThemeContext` (tema). Biblioteca, favoritos, reseñas y
  playlists viven solo en la base de datos.
- **`localStorage`**: guarda únicamente la preferencia de tema.
- **Estados de pantalla**: `useFetch` expone carga, error y datos; `LoadingSpinner`, `ErrorMessage` (con reintento)
  y `EmptyState` los muestran.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# Spotify-Front" 
