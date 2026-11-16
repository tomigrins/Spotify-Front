import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RatingStars from '../components/common/RatingStars';
import StatusBadge from '../components/common/StatusBadge';
import CancionFila from '../components/music/CancionFila';
import { useFetch } from '../hooks/useFetch';
import {
  listarBiblioteca,
  listarFavoritos,
  listarResenas,
  quitarDeBiblioteca,
  quitarFavorito,
  quitarResena,
} from '../services/bibliotecaService';
import { ESTADOS } from '../utils/estados';

const PESTANAS = [
  { id: 'todas', label: 'Todas' },
  ...ESTADOS,
  { id: 'favoritos', label: 'Favoritos' },
  { id: 'resenas', label: 'Reseñas' },
];

function cargar(pestana, page) {
  if (pestana === 'favoritos') return listarFavoritos({ page });
  if (pestana === 'resenas') return listarResenas({ page });
  return listarBiblioteca({ estado: pestana === 'todas' ? undefined : pestana, page });
}

function quitar(pestana, cancionId) {
  if (pestana === 'favoritos') return quitarFavorito(cancionId);
  if (pestana === 'resenas') return quitarResena(cancionId);
  return quitarDeBiblioteca(cancionId);
}

const Library = () => {
  const [pestana, setPestana] = useState('todas');
  const [page, setPage] = useState(1);
  const [errorAccion, setErrorAccion] = useState(null);
  const { data, loading, error, recargar } = useFetch(() => cargar(pestana, page), [pestana, page]);

  const cambiarPestana = (nueva) => {
    setPestana(nueva);
    setPage(1);
    setErrorAccion(null);
  };

  const handleQuitar = async (cancionId) => {
    setErrorAccion(null);
    try {
      await quitar(pestana, cancionId);
      // Si era la última fila de la página, esa página ya no existe
      if (data.data.length === 1 && page > 1) setPage(page - 1);
      else recargar();
    } catch (err) {
      setErrorAccion(err);
    }
  };

  return (
    <div className="library-page">
      <header className="page-header">
        <div>
          <h1>Tu biblioteca</h1>
          <p className="page-subtitulo">Lo que querés escuchar, lo que estás escuchando y lo que ya escuchaste.</p>
        </div>
      </header>

      <div className="filter-panel">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={pestana === p.id ? 'active' : ''}
            aria-pressed={pestana === p.id}
            onClick={() => cambiarPestana(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} onRetry={recargar} />
      <ErrorMessage error={errorAccion} />

      {data?.total === 0 && (
        <EmptyState titulo="No hay nada acá todavía">
          <Link to="/explore">Explorá música</Link> y guardá lo que te guste.
        </EmptyState>
      )}

      {data?.data.length > 0 && (
        <>
          <ul className="cancion-lista card">
            {data.data.map((cancion) => (
              <CancionFila key={cancion.id} cancion={cancion}>
                <StatusBadge estado={cancion.estado} />
                {pestana === 'resenas' && cancion.puntuacion && <RatingStars rating={cancion.puntuacion} />}
                {cancion.comentario && <p className="cancion-comentario">{cancion.comentario}</p>}
                <button type="button" className="btn-secondary" onClick={() => handleQuitar(cancion.id)}>
                  Quitar
                </button>
              </CancionFila>
            ))}
          </ul>

          {data.totalPages > 1 && (
            <div className="paginacion">
              <button type="button" className="btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Anterior
              </button>
              <span>Página {data.page} de {data.totalPages}</span>
              <button
                type="button"
                className="btn-secondary"
                disabled={page === data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Library;
