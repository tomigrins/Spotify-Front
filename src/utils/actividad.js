import { ESTADOS } from './estados';

const etiquetaEstado = (id) => ESTADOS.find((e) => e.id === id)?.label.toLowerCase() ?? id;

// Texto de cada evento de actividad. "cancion" es el nombre guardado en el detalle,
// así se puede mostrar aunque la canción o la playlist ya no existan.
export function describirActividad({ tipo, detalle }) {
  const cancion = detalle.cancion ? `«${detalle.cancion}»` : 'una canción';
  const playlist = detalle.playlist ? `«${detalle.playlist}»` : 'una playlist';

  switch (tipo) {
    case 'biblioteca_agregar':
      return `Agregaste ${cancion} a tu biblioteca como ${etiquetaEstado(detalle.estado)}`;
    case 'biblioteca_estado':
      return `Marcaste ${cancion} como ${etiquetaEstado(detalle.estado)}`;
    case 'biblioteca_quitar':
      return `Quitaste ${cancion} de tu biblioteca`;
    case 'favorito_agregar':
      return `Marcaste ${cancion} como favorita`;
    case 'favorito_quitar':
      return `Sacaste ${cancion} de favoritos`;
    case 'resena_crear':
      return detalle.conComentario ? `Reseñaste ${cancion}` : `Puntuaste ${cancion}`;
    case 'resena_editar':
      return `Editaste tu reseña de ${cancion}`;
    case 'resena_borrar':
      return `Borraste tu reseña de ${cancion}`;
    case 'playlist_crear':
      return `Creaste la playlist ${playlist}`;
    case 'playlist_renombrar':
      return `Renombraste «${detalle.anterior}» a ${playlist}`;
    case 'playlist_borrar':
      return `Borraste la playlist ${playlist}`;
    case 'playlist_agregar_cancion':
      return `Agregaste ${cancion} a ${playlist}`;
    case 'playlist_quitar_cancion':
      return `Quitaste ${cancion} de ${playlist}`;
    case 'importacion':
      return `Importaste ${detalle.insertadas ?? 0} reproducciones de ${detalle.fuente === 'lastfm' ? 'Last.fm' : 'Spotify'}`;
    default:
      return 'Actividad';
  }
}

const relativo = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });

// "hace 5 minutos", "ayer", "hace 3 semanas"
export function haceCuanto(fecha, ahora = new Date()) {
  const segundos = Math.round((new Date(fecha) - ahora) / 1000);
  const unidades = [
    ['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60],
  ];
  for (const [unidad, s] of unidades) {
    if (Math.abs(segundos) >= s) return relativo.format(Math.round(segundos / s), unidad);
  }
  return 'recién';
}
