// Textos de la pantalla de detalle, armados con los datos que trae el catálogo.

const decada = (anio) => (anio ? `Años ${String(anio).slice(0, 3)}0` : null);

const unir = (partes) => partes.filter(Boolean).join(' ');

// "«Crimen» es una canción de Gustavo Cerati, del álbum Ahí Vamos, publicada en 2006. Género: Rock."
export function describir(item) {
  if (!item) return '';
  const genero = item.genero ? `Género: ${item.genero}.` : null;

  if (item.tipo === 'artista') {
    return unir([
      `${item.titulo} es un artista${item.genero ? ` de ${item.genero}` : ''}.`,
      item.contenido?.length ? 'Abajo están sus álbumes en el catálogo.' : null,
    ]);
  }

  if (item.tipo === 'album') {
    return unir([
      `«${item.titulo}» es un álbum${item.artista ? ` de ${item.artista}` : ''}`
        + `${item.anio ? `, publicado en ${item.anio}` : ''}`
        + `${item.cantidadCanciones ? `, con ${item.cantidadCanciones} ${item.cantidadCanciones === 1 ? 'canción' : 'canciones'}` : ''}.`,
      genero,
    ]);
  }

  return unir([
    `«${item.titulo}» es una canción${item.artista ? ` de ${item.artista}` : ''}`
      + `${item.album ? `, del álbum ${item.album}` : ''}`
      + `${item.anio ? `, publicada en ${item.anio}` : ''}.`,
    genero,
  ]);
}

// Categorías para mostrar como etiquetas: género, década y contenido explícito.
export function categorias(item) {
  if (!item) return [];
  return [
    item.genero,
    decada(item.anio),
    item.explicito ? 'Explícito' : null,
  ].filter(Boolean);
}
