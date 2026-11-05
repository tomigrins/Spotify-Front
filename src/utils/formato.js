const numero = new Intl.NumberFormat('es-AR');

// 1 -> "1 stream", 1200 -> "1.200 streams"
export const formatearStreams = (n) => `${numero.format(n)} ${n === 1 ? 'stream' : 'streams'}`;

// 212 -> "3:32"
export function formatearDuracion(segundos) {
  if (!segundos) return null;
  const resto = String(segundos % 60).padStart(2, '0');
  return `${Math.floor(segundos / 60)}:${resto}`;
}

// A dónde lleva una canción guardada en el backend: a su detalle si se guardó desde la API
// externa; si vino de una importación no tiene id externo, así que a buscarla.
export function rutaDeCancion(cancion) {
  if (cancion.itunes_id) return `/detail/${cancion.itunes_id}`;
  return `/explore?q=${encodeURIComponent(`${cancion.artista} ${cancion.nombre}`)}`;
}
