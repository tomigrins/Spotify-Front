import axios from 'axios';

const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para setear el Access Token que te da Spotify (Client Credentials)
export const setSpotifyToken = (token) => {
  spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// --- Funciones para consumir Spotify ---

// Buscar por texto (Canciones, Álbumes, Artistas)
export const searchCatalog = async (query, type = 'track,album,artist') => {
  const response = await spotifyApi.get('/search', {
    params: {
      q: query,
      type: type,
      limit: 12,
    },
  });
  return response.data;
};

// Obtener detalle de una canción por ID
export const getTrackDetail = async (trackId) => {
  const response = await spotifyApi.get(`/tracks/${trackId}`);
  return response.data;
};

// Obtener detalle de un álbum por ID
export const getAlbumDetail = async (albumId) => {
  const response = await spotifyApi.get(`/albums/${albumId}`);
  return response.data;
};

// Obtener lanzamientos destacados (Para la Home)
export const getNewReleases = async () => {
  const response = await spotifyApi.get('/browse/new-releases', {
    params: { limit: 6 },
  });
  return response.data;
};

export default spotifyApi;