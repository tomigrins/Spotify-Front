import api from './api';

// Todo esto vive en la base de datos del backend, nunca en localStorage.

const datos = (res) => res.data;

// --- Catálogo ---

// Canción del catálogo propio que corresponde a una de la API externa (la crea si hace falta).
export const resolverCancion = (cancion) => (
  api.post('/canciones/resolver', {
    nombre: cancion.titulo,
    artista: cancion.artista,
    album: cancion.album ?? null,
    duracionSegundos: cancion.duracionSegundos ?? null,
    itunesId: Number(cancion.id),
    portadaUrl: cancion.imagen ?? null,
  }).then(datos)
);

// Qué tiene guardado el usuario sobre una canción: estado, favorito, reseña y playlists.
export const obtenerRelacionConCancion = (artista, nombre) => (
  api.get('/me/canciones/estado', { params: { artista, nombre } }).then(datos)
);

// --- Biblioteca (estado de cada canción) ---

export const listarBiblioteca = ({ estado, page, limit } = {}) => (
  api.get('/me/biblioteca', { params: { estado, page, limit } }).then(datos)
);

export const guardarEnBiblioteca = (cancionId, estado) => (
  api.put(`/me/biblioteca/${cancionId}`, { estado }).then(datos)
);

export const quitarDeBiblioteca = (cancionId) => api.delete(`/me/biblioteca/${cancionId}`);

// --- Favoritos ---

export const listarFavoritos = ({ page, limit } = {}) => (
  api.get('/me/favoritos', { params: { page, limit } }).then(datos)
);

export const agregarFavorito = (cancionId) => api.put(`/me/favoritos/${cancionId}`);

export const quitarFavorito = (cancionId) => api.delete(`/me/favoritos/${cancionId}`);

// --- Reseñas ---

export const listarResenas = ({ page, limit } = {}) => (
  api.get('/me/resenas', { params: { page, limit } }).then(datos)
);

// resena: { puntuacion?, comentario? }. Solo cambia lo que se manda.
export const guardarResena = (cancionId, resena) => (
  api.put(`/me/resenas/${cancionId}`, resena).then(datos)
);

export const quitarResena = (cancionId) => api.delete(`/me/resenas/${cancionId}`);

// --- Playlists (colecciones) ---

export const listarPlaylists = () => api.get('/me/playlists').then(datos);

export const obtenerPlaylist = (id) => api.get(`/me/playlists/${id}`).then(datos);

export const crearPlaylist = (nombre) => api.post('/me/playlists', { nombre }).then(datos);

export const borrarPlaylist = (id) => api.delete(`/me/playlists/${id}`);

export const agregarCancionAPlaylist = (playlistId, cancionId) => (
  api.post(`/me/playlists/${playlistId}/canciones`, { cancionId }).then(datos)
);

export const quitarCancionDePlaylist = (playlistId, cancionId) => (
  api.delete(`/me/playlists/${playlistId}/canciones/${cancionId}`)
);
