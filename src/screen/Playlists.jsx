import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CancionFila from '../components/music/CancionFila';
import { useFetch } from '../hooks/useFetch';
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
    <section className="playlist-detalle">
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
      <h1>Tus playlists</h1>

      <form className="inline-form" onSubmit={crear}>
        <input
          aria-label="Nombre de la playlist"
          placeholder="Nombre de la playlist"
          maxLength={200}
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit" disabled={enviando}>{enviando ? 'Creando...' : 'Crear'}</button>
      </form>

      <ErrorMessage error={errorAccion} />
      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} onRetry={recargar} />
      {playlists?.length === 0 && (
        <EmptyState titulo="Todavía no tenés playlists">Creá la primera con el formulario de arriba.</EmptyState>
      )}

      {playlists?.length > 0 && (
        <ul className="playlist-lista">
          {playlists.map((p) => (
            <li key={p.id} className={elegida === p.id ? 'active' : ''}>
              <button type="button" className="playlist-nombre" onClick={() => setElegida(p.id)}>
                {p.nombre}
                <span className="texto-secundario"> · {p.canciones} {p.canciones === 1 ? 'canción' : 'canciones'}</span>
              </button>
              <button type="button" className="btn-secondary" onClick={() => borrar(p)}>Borrar</button>
            </li>
          ))}
        </ul>
      )}

      {elegida && <PlaylistDetalle key={elegida} id={elegida} onCambio={recargar} />}
    </div>
  );
};

export default Playlists;
