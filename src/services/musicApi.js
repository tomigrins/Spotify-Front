import axios from 'axios';
import { errorDeApiExterna } from './errores';

// API externa para explorar el catálogo: iTunes Search API. No pide credenciales y permite
// CORS, así que no hay ningún secreto en el navegador. Se normaliza la respuesta para que
// la interfaz no dependa del formato de iTunes.
const itunes = axios.create({
  baseURL: 'https://itunes.apple.com',
  timeout: 10000,
  params: { country: 'AR' },
});

itunes.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(errorDeApiExterna(error)),
);

const ENTIDADES = { track: 'song', album: 'album', artist: 'musicArtist' };

const agrandarImagen = (url) => url?.replace('100x100bb', '600x600bb') ?? null;

function normalizar(resultado) {
  const genero = resultado.primaryGenreName ?? null;

  if (resultado.wrapperType === 'artist') {
    return {
      id: String(resultado.artistId),
      tipo: 'artista',
      titulo: resultado.artistName,
      subtitulo: genero ?? 'Artista',
      imagen: null,
      genero,
    };
  }

  const comun = {
    artista: resultado.artistName,
    subtitulo: resultado.artistName,
    imagen: agrandarImagen(resultado.artworkUrl100),
    genero,
    anio: resultado.releaseDate?.slice(0, 4) ?? null,
  };

  if (resultado.wrapperType === 'collection') {
    return {
      ...comun,
      id: String(resultado.collectionId),
      tipo: 'album',
      titulo: resultado.collectionName,
      cantidadCanciones: resultado.trackCount ?? null,
    };
  }

  return {
    ...comun,
    id: String(resultado.trackId),
    tipo: 'cancion',
    titulo: resultado.trackName,
    album: resultado.collectionName ?? null,
    albumId: resultado.collectionId ? String(resultado.collectionId) : null,
    duracionSegundos: resultado.trackTimeMillis ? Math.round(resultado.trackTimeMillis / 1000) : null,
    previewUrl: resultado.previewUrl ?? null,
  };
}

// tipo: 'track', 'album', 'artist' o varios separados por coma. Devuelve [] si no hay resultados.
export async function buscarCatalogo(termino, tipo = 'track,album,artist') {
  const tipos = tipo.split(',');
  const limit = tipos.length > 1 ? 6 : 12;
  const respuestas = await Promise.all(tipos.map((t) => (
    itunes.get('/search', { params: { term: termino, entity: ENTIDADES[t], limit } })
  )));
  return respuestas.flatMap((res) => res.data.results).map(normalizar);
}

// Detalle de una canción, álbum o artista (el id alcanza para saber cuál es).
// Un álbum trae sus canciones y un artista sus álbumes en `contenido`. Null si no existe.
export async function obtenerDetalle(id) {
  if (!/^\d+$/.test(id)) return null;

  const { data } = await itunes.get('/lookup', { params: { id } });
  if (!data.results.length) return null;

  const item = normalizar(data.results[0]);
  if (item.tipo === 'cancion') return item;

  const entity = item.tipo === 'album' ? 'song' : 'album';
  const hijos = await itunes.get('/lookup', { params: { id, entity } });
  // El primer resultado es el propio álbum o artista
  return { ...item, contenido: hijos.data.results.slice(1).map(normalizar) };
}
