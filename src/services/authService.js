import api from './api';

// El backend guarda el JWT en una cookie HttpOnly y solo devuelve el usuario.

export const iniciarSesion = (credenciales) => (
  api.post('/auth/login', credenciales).then((res) => res.data.usuario)
);

export const registrarse = (datos) => (
  api.post('/auth/register', datos).then((res) => res.data.usuario)
);

export const cerrarSesion = () => api.post('/auth/logout');

export const obtenerPerfil = () => api.get('/me').then((res) => res.data);

export const actualizarPerfil = (datos) => api.patch('/me', datos).then((res) => res.data);
