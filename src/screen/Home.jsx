import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MusicGrid from '../components/music/MusicGrid';
import StatCard from '../components/stats/StatCard';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { listarBiblioteca, listarFavoritos, listarPlaylists } from '../services/bibliotecaService';
import { buscarCatalogo } from '../services/musicApi';
import { listarAniosWrapped } from '../services/wrappedService';

const numero = new Intl.NumberFormat('es-AR');

const cargarResumen = async () => {
  const [biblioteca, favoritos, playlists, wrapped] = await Promise.all([
    listarBiblioteca({ limit: 1 }),
    listarFavoritos({ limit: 1 }),
    listarPlaylists(),
    listarAniosWrapped(),
  ]);
  return {
    biblioteca: biblioteca.total,
    favoritos: favoritos.total,
    playlists: playlists.length,
    ultimoWrapped: wrapped[0] ?? null,
  };
};

const cargarDestacados = () => buscarCatalogo('rock nacional', 'album');

// Cada sección carga por separado: si se cae una API, la otra se sigue viendo.
const Home = () => {
  const { user } = useAuth();
  const resumen = useFetch(cargarResumen);
  const destacados = useFetch(cargarDestacados);

  return (
    <div className="home-page">
      <h1>Hola, {user.nombre}</h1>

      <section>
        <h2>Tu música</h2>
        {resumen.loading && <LoadingSpinner />}
        <ErrorMessage error={resumen.error} onRetry={resumen.recargar} />
        {resumen.data && (
          <div className="stats-grid">
            <StatCard label="En tu biblioteca" value={numero.format(resumen.data.biblioteca)} />
            <StatCard label="Favoritos" value={numero.format(resumen.data.favoritos)} />
            <StatCard label="Playlists" value={numero.format(resumen.data.playlists)} />
            {resumen.data.ultimoWrapped ? (
              <StatCard
                label={`Minutos escuchados en ${resumen.data.ultimoWrapped.anio}`}
                value={numero.format(resumen.data.ultimoWrapped.minutos_escuchados)}
              />
            ) : (
              <StatCard label="Wrapped" value="Sin datos" detalle={<Link to="/stats">Importá tu historial</Link>} />
            )}
          </div>
        )}
      </section>

      <section>
        <h2>Para descubrir</h2>
        {destacados.loading && <LoadingSpinner />}
        <ErrorMessage error={destacados.error} onRetry={destacados.recargar} />
        {destacados.data?.length === 0 && (
          <EmptyState titulo="No hay destacados por ahora">
            <Link to="/explore">Buscá algo en Explorar</Link>
          </EmptyState>
        )}
        {destacados.data?.length > 0 && <MusicGrid items={destacados.data} />}
      </section>
    </div>
  );
};

export default Home;
