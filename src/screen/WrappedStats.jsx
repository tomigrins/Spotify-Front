import { useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BibliotecaStats from '../components/stats/BibliotecaStats';
import ImportPanel from '../components/stats/ImportPanel';
import TopArtistsCard from '../components/stats/TopArtistsCard';
import TopGenresChart from '../components/stats/TopGenresChart';
import WrappedSummaryCard from '../components/stats/WrappedSummaryCard';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { obtenerEstadisticas } from '../services/actividadService';
import { listarAniosWrapped, obtenerWrapped, sincronizarGeneros } from '../services/wrappedService';
import { formatearStreams } from '../utils/formato';

// Los géneros no vienen en el historial: se completan aparte con Last.fm.
const GenerosVacios = ({ onSincronizado }) => {
  const [sincronizando, setSincronizando] = useState(false);
  const [error, setError] = useState(null);

  const sincronizar = async () => {
    setSincronizando(true);
    setError(null);
    try {
      const { errores, conGeneros } = await sincronizarGeneros();
      // El backend responde 200 aunque Last.fm haya fallado para algún artista
      if (errores.length > 0) setError(errores[0].error);
      else if (conGeneros === 0) setError('Last.fm no tiene géneros para los artistas que escuchaste.');
      else onSincronizado();
    } catch (err) {
      setError(err);
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <section className="stats-card">
      <h2>Tus géneros</h2>
      <EmptyState titulo="Todavía no hay géneros">
        Se completan con Last.fm a partir de los artistas que escuchaste.
      </EmptyState>
      <ErrorMessage error={error} />
      <button type="button" onClick={sincronizar} disabled={sincronizando}>
        {sincronizando ? 'Completando...' : 'Completar géneros'}
      </button>
    </section>
  );
};

const ResumenAnual = ({ anio }) => {
  const { data: wrapped, loading, error, recargar } = useFetch(() => obtenerWrapped(anio), [anio]);

  if (loading) return <LoadingSpinner mensaje={`Armando tu ${anio}...`} />;
  if (error) return <ErrorMessage error={error} onRetry={recargar} />;

  return (
    <>
      <WrappedSummaryCard
        resumen={wrapped.resumen}
        habitos={wrapped.habitos}
        minutosEstimados={wrapped.minutosEstimados}
      />

      <div className="stats-columnas">
        {wrapped.topArtistas.length > 0 && <TopArtistsCard artistas={wrapped.topArtistas} />}

        {wrapped.topCanciones.length > 0 && (
          <section className="stats-card">
            <h2>Tus canciones</h2>
            <ol className="ranking">
              {wrapped.topCanciones.map((c) => (
                <li key={c.cancion_id}>
                  <span className="ranking-puesto">{c.puesto}</span>
                  <span className="ranking-nombre">
                    {c.cancion} <span className="texto-secundario">· {c.artista}</span>
                  </span>
                  <span className="ranking-valor">{formatearStreams(c.streams)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {wrapped.topGeneros.length > 0 ? (
        <TopGenresChart generos={wrapped.topGeneros} />
      ) : (
        <GenerosVacios onSincronizado={recargar} />
      )}
    </>
  );
};

// Se recalcula en cada visita: refleja lo último que guardaste, puntuaste o cambiaste.
const EstadisticasBiblioteca = () => {
  const { data, loading, error, recargar } = useFetch(obtenerEstadisticas);

  return (
    <section className="stats-seccion" aria-labelledby="titulo-biblioteca">
      <div className="section-header">
        <h2 id="titulo-biblioteca">Tu biblioteca</h2>
      </div>
      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} onRetry={recargar} />
      {data && <BibliotecaStats e={data} />}
    </section>
  );
};

const WrappedStats = () => {
  const { user } = useAuth();
  const { data: anios, loading, error, recargar } = useFetch(listarAniosWrapped);
  const [anioElegido, setAnioElegido] = useState(null);

  const anio = anioElegido ?? anios?.[0]?.anio;

  return (
    <div className="wrapped-page">
      <header className="page-header">
        <div>
          <h1>Tus estadísticas</h1>
          <p className="page-subtitulo">Tu biblioteca en números y tu resumen del año, con tus datos reales.</p>
        </div>
      </header>

      <EstadisticasBiblioteca />

      <div className="section-header">
        <h2>Tu Wrapped</h2>
        <span className="texto-secundario section-contador">Artistas, canciones y géneros del año, a partir de tu historial</span>
      </div>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} onRetry={recargar} />
      {anios?.length === 0 && (
        <EmptyState titulo="Todavía no hay estadísticas">
          Importá tu historial de escucha para ver tu resumen.
        </EmptyState>
      )}
      {anios?.length > 0 && (
        <>
          <label className="wrapped-anio">
            Año
            <select value={anio} onChange={(e) => setAnioElegido(Number(e.target.value))}>
              {anios.map((a) => (
                <option key={a.anio} value={a.anio}>{a.anio}</option>
              ))}
            </select>
          </label>
          <ResumenAnual key={anio} anio={anio} />
        </>
      )}

      <ImportPanel usuarioLastfm={user.lastfm_usuario} onImportado={recargar} />
    </div>
  );
};

export default WrappedStats;
