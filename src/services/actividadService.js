import api from './api';

const datos = (res) => res.data;

// Actividad del usuario (lo que fue haciendo con su biblioteca), de la más nueva a la más vieja.
// tipo: 'biblioteca' | 'favorito' | 'resena' | 'playlist' | 'importacion' (opcional)
export const listarActividad = ({ page, limit, tipo } = {}) => (
  api.get('/me/actividad', { params: { page, limit, tipo } }).then(datos)
);

// Estadísticas de la biblioteca: estados, reseñas, favoritos, playlists y actividad.
// Las calcula el backend en cada pedido con los datos guardados.
export const obtenerEstadisticas = () => api.get('/me/estadisticas').then(datos);
