import axios from 'axios';
import { errorDelBackend } from './errores';

// Cliente del backend propio. Solo configura la conexión: las llamadas están en los
// módulos authService, bibliotecaService y wrappedService.
const api = axios.create({
  // En producción (Vercel) el backend se llama por el mismo dominio: vercel.json reenvía /api a
  // Render. Así la cookie de sesión es del propio sitio y el navegador no la bloquea.
  baseURL: import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'),
  timeout: 15000,
  // Manda la cookie HttpOnly con el JWT. El front nunca ve ni guarda el token.
  withCredentials: true,
});

let alPerderSesion = () => {};

// AuthContext se registra acá para enterarse cuando el backend rechaza la sesión.
// Devuelve la función para desregistrarse.
export function registrarAlPerderSesion(manejador) {
  alPerderSesion = manejador;
  return () => {
    alPerderSesion = () => {};
  };
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = errorDelBackend(error);
    if (apiError.tipo === 'sesion') alPerderSesion(apiError.codigo);
    return Promise.reject(apiError);
  },
);

export default api;
