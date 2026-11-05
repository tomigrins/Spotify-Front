import api from './api';

const datos = (res) => res.data;

// --- Estadísticas ---

// Años con datos y el resumen de cada uno
export const listarAniosWrapped = () => api.get('/me/wrapped').then(datos);

export const obtenerWrapped = (anio) => api.get(`/me/wrapped/${anio}`).then(datos);

// --- Importación del historial ---

export const importarSpotify = (archivos) => {
  const formulario = new FormData();
  archivos.forEach((archivo) => formulario.append('archivos', archivo));
  // Sin timeout: un export grande tarda más que una request común
  return api.post('/me/importaciones/spotify', formulario, { timeout: 0 }).then(datos);
};

export const importarLastfm = (usuario) => (
  api.post('/me/importaciones/lastfm', { usuario }, { timeout: 0 }).then(datos)
);

// Completa con Last.fm los géneros de los artistas escuchados. Consulta artista por artista.
export const sincronizarGeneros = () => (
  api.post('/generos/sincronizar', {}, { timeout: 0 }).then(datos)
);
