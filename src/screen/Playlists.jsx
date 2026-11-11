import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Icon from '../components/common/Icon';
import CancionFila from '../components/music/CancionFila';
import { useFetch } from '../hooks/useFetch';
import { fondoDeColeccion } from '../utils/presentacion';
import {
  borrarPlaylist,
  crearPlaylist,
  listarPlaylists,
  obtenerPlaylist,
  quitarCancionDePlaylist,
} from '../services/bibliotecaService';

const PlaylistDetalle = ({ id, onCambio }) => {
  const { data: playlist, loading, error, recargar } = useFetch(() => obtenerPlaylist(id), [id]);
  const [errorAccion, setErrorAccion] = useState(null);

  const quitar = async (cancionId) => {
    setErrorAccion(null);
    try {
      await quitarCancionDePlaylist(id, cancionId);
      recargar();
      onCambio();
    } catch (err) {
      setErrorAccion(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={recargar} />;

  return (
    <section className="playlist-detalle card">
      <h2>{playlist.nombre}</h2>
      <ErrorMessage error={errorAccion} />
      {playlist.canciones.length === 0 ? (
        <EmptyState titulo="Esta playlist está vacía">
          Agregá canciones desde <Link to="/explore">Explorar</Link>.
        </EmptyState>
      ) : (
        <ul className="cancion-lista">
          {playlist.canciones.map((cancion) => (
            <CancionFila key={cancion.id} cancion={cancion}>
              <button type="button" className="btn-secondary" onClick={() => quitar(cancion.id)}>
                Quitar
              </button>
            </CancionFila>
          ))}
        </ul>
      )}
    </section>
  );
};

const Playlists = () => {
  const { data: playlists, loading, error, recargar } = useFetch(listarPlaylists);
  const [elegida, setElegida] = useState(null);
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  const crear = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setEnviando(true);
    setErrorAccion(null);
    try {
      await crearPlaylist(nombre.trim());
      setNombre('');
      recargar();
    } catch (err) {
      setErrorAccion(err);
    } finally {
      setEnviando(false);
    }
  };

  const borrar = async (playlist) => {
    if (!window.confirm(`¿Borrar la playlist "${playlist.nombre}"?`)) return;

    setErrorAccion(null);
    try {
      await borrarPlaylist(playlist.id);
      if (elegida === playlist.id) setElegida(null);
      recargar();
    } catch (err) {
      setErrorAccion(err);
    }
  };

  return (
    <div className="playlists-page">
      <header className="page-header">
        <div>
          <h1>Tus colecciones</h1>
          <p className="page-subtitulo">Tu música, en tu manera. Armá playlists para cada momento.</p>
        </div>
        <form className="inline-form crear-coleccion" onSubmit={crear}>
          <input
            aria-label="Nombre de la playlist"
            placeholder="Nombre de la playlist"
            maxLength={200}
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button type="submit" disabled={enviando}>
            <Icon nombre="mas" size={14} /> {enviando ? 'Creando...' : 'Crear playlist'}
          </button>
        </form>
      </header>

      <ErrorMessage error={errorAccion} />
      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} onRetry={recargar} />
      {playlists?.length === 0 && (
        <EmptyState titulo="Todavía no tenés playlists">Creá la primera con el formulario de arriba.</EmptyState>
      )}

      {playlists?.length > 0 && (
        <section>
          <div className="section-header">
            <h2>Hechas por vos</h2>
            <span className="texto-secundario section-contador">
              {playlists.length} {playlists.length === 1 ? 'colección' : 'colecciones'}
            </span>
          </div>
          <ul className="playlist-lista">
            {playlists.map((p) => (
              <li key={p.id} className={elegida === p.id ? 'playlist-card active' : 'playlist-card'}>
                <div className="playlist-portada" style={fondoDeColeccion(p.id)} aria-hidden="true">
                  <span className="playlist-chip">♪ Playlist</span>
                </div>
                <button
                  type="button"
                  className="playlist-nombre"
                  aria-pressed={elegida === p.id}
                  onClick={() => setElegida(p.id)}
                >
                  {p.nombre}
                  <span className="texto-secundario">
                    <span className="separador"> · </span>
                    {p.canciones} {p.canciones === 1 ? 'canción' : 'canciones'}
                  </span>
                </button>
                <div className="playlist-acciones">
                  <button type="button" className="btn-texto btn-texto-peligro" onClick={() => borrar(p)}>Borrar</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {elegida && <PlaylistDetalle key={elegida} id={elegida} onCambio={recargar} />}
    </div>
  );
};

export default Playlists;
