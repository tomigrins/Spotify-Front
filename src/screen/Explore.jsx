import { useSearchParams } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FilterPanel from '../components/music/FilterPanel';
import MusicGrid from '../components/music/MusicGrid';
import SearchBar from '../components/music/SearchBar';
import { useFetch } from '../hooks/useFetch';
import { buscarCatalogo } from '../services/musicApi';

const TODOS = 'track,album,artist';

// La búsqueda vive en la URL: se puede volver atrás y llegar con un link desde la biblioteca.
const Explore = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const tipo = params.get('tipo') ?? TODOS;

  const { data: resultados, loading, error, recargar } = useFetch(
    () => (q ? buscarCatalogo(q, tipo) : Promise.resolve(null)),
    [q, tipo],
  );

  return (
    <div className="explore-page">
      <header className="page-header">
        <div>
          <h1>Encontrá tu próxima obsesión</h1>
          <p className="page-subtitulo">Álbumes, artistas y canciones que todavía no sabés que te gustan.</p>
        </div>
      </header>

      <SearchBar key={q} valorInicial={q} onSearch={(nueva) => setParams({ q: nueva, tipo })} />
      <FilterPanel activeType={tipo} onSelectType={(nuevo) => setParams(q ? { q, tipo: nuevo } : { tipo: nuevo })} />

      {!q && <EmptyState titulo="¿Qué querés escuchar?">Buscá una canción, un álbum o un artista.</EmptyState>}
      {q && loading && <LoadingSpinner mensaje="Buscando..." />}
      <ErrorMessage error={error} onRetry={recargar} />
      {resultados?.length === 0 && (
        <EmptyState titulo={`No encontramos resultados para "${q}"`}>
          Probá con otras palabras o cambiá el filtro.
        </EmptyState>
      )}
      {resultados?.length > 0 && (
        <section>
          <div className="section-header">
            <h2>
              Resultados para «{q}»{' '}
              <span className="texto-secundario section-contador">
                {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </h2>
          </div>
          <MusicGrid items={resultados} />
        </section>
      )}
    </div>
  );
};

export default Explore;
