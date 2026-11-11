import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import Icon from '../components/common/Icon';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MusicGrid from '../components/music/MusicGrid';
import Portada from '../components/music/Portada';
import StatCard from '../components/stats/StatCard';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { listarBiblioteca, listarFavoritos, listarPlaylists } from '../services/bibliotecaService';
import { buscarCatalogo } from '../services/musicApi';
import { listarAniosWrapped } from '../services/wrappedService';
import { fechaLarga, fondoDeColeccion, saludo } from '../utils/presentacion';

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
    // La misma respuesta de arriba: se muestran las primeras en "Hechas por vos"
    listaPlaylists: playlists,
    ultimoWrapped: wrapped[0] ?? null,
  };
};

const cargarDestacados = () => buscarCatalogo('rock nacional', 'album');

// Primer álbum de los destacados, en grande.
const Destacado = ({ item }) => (
  <article className="hero-card">
    <div className="hero-texto">
      <p className="etiqueta-acento">
        <Icon nombre="disco" size={12} /> Para descubrir
      </p>
      <h2 className="hero-titulo">{item.titulo}</h2>
      <p className="hero-meta">
        {[item.artista, 'Álbum', item.anio].filter(Boolean).join(' · ')}
      </p>
      {item.genero && <p className="hero-descripcion">{item.genero}</p>}
      <Link to={`/detail/${item.id}`} className="btn btn-chico">
        <Icon nombre="flecha" size={14} /> Ver álbum
      </Link>
    </div>
    <Portada src={item.imagen} className="hero-img" />
  </article>
);

// Cada sección carga por separado: si se cae una API, la otra se sigue viendo.
const Home = () => {
  const { user } = useAuth();
  const resumen = useFetch(cargarResumen);
  const destacados = useFetch(cargarDestacados);
  const [primero, ...resto] = destacados.data ?? [];

  return (
    <div className="home-page">
      <header className="page-header">
        <div>
          <h1>{saludo()}, {user.nombre}</h1>
          <p className="page-subtitulo">Un nuevo descubrimiento, una nueva historia para tu colección.</p>
        </div>
        <p className="page-fecha">{fechaLarga()}</p>
      </header>

      <div className="home-top">
        <div className="home-hero">
          {destacados.loading && <LoadingSpinner />}
          <ErrorMessage error={destacados.error} onRetry={destacados.recargar} />
          {primero && <Destacado item={primero} />}
        </div>

        <section className="card numeros-card" aria-labelledby="titulo-numeros">
          <div className="card-header">
            <h2 id="titulo-numeros">Tu música en números</h2>
            <Icon nombre="estadisticas" size={16} className="texto-acento" />
          </div>
          {resumen.loading && <LoadingSpinner />}
          <ErrorMessage error={resumen.error} onRetry={resumen.recargar} />
          {resumen.data && (
            <>
              <div className="stats-grid stats-grid-compacta">
                <StatCard label="Favoritos" value={numero.format(resumen.data.favoritos)} />
                <StatCard label="En tu biblioteca" value={numero.format(resumen.data.biblioteca)} />
                <StatCard label="Playlists" value={numero.format(resumen.data.playlists)} />
              </div>
              <div className="numeros-wrapped">
                {resumen.data.ultimoWrapped ? (
                  <StatCard
                    label={`Minutos escuchados en ${resumen.data.ultimoWrapped.anio}`}
                    value={numero.format(resumen.data.ultimoWrapped.minutos_escuchados)}
                  />
                ) : (
                  <StatCard label="Wrapped" value="Sin datos" detalle={<Link to="/stats">Importá tu historial</Link>} />
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {resumen.data?.listaPlaylists.length > 0 && (
        <section>
          <div className="section-header">
            <h2>Hechas por vos</h2>
            <Link to="/playlists" className="link-acento">
              {resumen.data.playlists === 1 ? 'Ver tu colección' : `Ver las ${resumen.data.playlists} colecciones`}{' '}
              <Icon nombre="flecha" size={12} />
            </Link>
          </div>
          <ul className="mini-colecciones">
            {resumen.data.listaPlaylists.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Link to="/playlists" className="mini-coleccion">
                  <span className="mini-coleccion-img" style={fondoDeColeccion(p.id)} aria-hidden="true">♪</span>
                  <span className="mini-coleccion-texto">
                    <span className="mini-coleccion-nombre">{p.nombre}</span>
                    <span className="texto-secundario">
                      {p.canciones} {p.canciones === 1 ? 'canción' : 'canciones'}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="section-header">
          <h2>Para descubrir</h2>
          <Link to="/explore" className="link-acento">
            Buscar más <Icon nombre="flecha" size={12} />
          </Link>
        </div>
        {destacados.data?.length === 0 && (
          <EmptyState titulo="No hay destacados por ahora">
            <Link to="/explore">Buscá algo en Explorar</Link>
          </EmptyState>
        )}
        {resto.length > 0 && <MusicGrid items={resto} />}
      </section>
    </div>
  );
};

export default Home;
