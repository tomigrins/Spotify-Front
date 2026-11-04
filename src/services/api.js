import axios from 'axios';

// Instancia apuntando a tu backend (usa variable de entorno o localhost)
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT guardado en localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para capturar token vencido (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      // Redirigir al login si el token expiró
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Métodos Helper para tu Backend ---

// Autenticación
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/users/profile', data);

// Biblioteca y Estados
export const getLibrary = () => api.get('/library');
export const addToLibrary = (itemData) => api.post('/library', itemData);
export const updateLibraryStatus = (id, status) => api.put(`/library/${id}`, { status });
export const removeFromLibrary = (id) => api.delete(`/library/${id}`);

// Playlists / Colecciones
export const getPlaylists = () => api.get('/playlists');
export const createPlaylist = (data) => api.post('/playlists', data);
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`);
export const addTrackToPlaylist = (playlistId, itemData) => 
  api.post(`/playlists/${playlistId}/items`, itemData);

// Reseñas y Puntuaciones
export const saveReview = (data) => api.post('/reviews', data);
export const saveRating = (data) => api.post('/ratings', data);

// Estadísticas (Spotify Wrapped)
export const getWrappedStats = () => api.get('/stats');

export default api;