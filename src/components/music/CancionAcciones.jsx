import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import {
  agregarCancionAPlaylist,
  agregarFavorito,
  guardarEnBiblioteca,
  guardarResena,
  listarPlaylists,
  obtenerRelacionConCancion,
  quitarDeBiblioteca,
  quitarFavorito,
  resolverCancion,
} from '../../services/bibliotecaService';
import { ESTADOS } from '../../utils/estados';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import RatingStars from '../common/RatingStars';
import ReviewForm from '../forms/ReviewForm';

// Lo que el usuario guarda de una canción de la API externa. Todo va a la base de datos.
const PanelCancion = ({ cancion, relacion, playlists }) => {
  const [cancionId, setCancionId] = useState(relacion.id);
  const [estado, setEstado] = useState(relacion.estado);
  const [favorito, setFavorito] = useState(relacion.favorito);
  const [puntuacion, setPuntuacion] = useState(relacion.resena?.puntuacion ?? 0);
  const [enPlaylists, setEnPlaylists] = useState(relacion.playlists);
  const [playlistElegida, setPlaylistElegida] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  // La canción entra al catálogo propio recién cuando el usuario guarda algo sobre ella
  const asegurarCancionId = async () => {
    if (cancionId) return cancionId;
    const { id } = await resolverCancion(cancion);
    setCancionId(id);
    return id;
  };

  const guardar = async (accion) => {
    setGuardando(true);
    setError(null);
    try {
      await accion(await asegurarCancionId());
    } catch (err) {
      setError(err);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = (nuevo) => guardar(async (id) => {
    // Tocar el estado activo lo quita de la biblioteca
    if (nuevo === estado) {
      await quitarDeBiblioteca(id);
      setEstado(null);
    } else {
      await guardarEnBiblioteca(id, nuevo);
      setEstado(nuevo);
    }
  });

  const cambiarFavorito = () => guardar(async (id) => {
    await (favorito ? quitarFavorito(id) : agregarFavorito(id));
    setFavorito(!favorito);
  });

  const puntuar = (valor) => guardar(async (id) => {
    await guardarResena(id, { puntuacion: valor });
    setPuntuacion(valor);
  });

  const agregarAPlaylist = (e) => {
    e.preventDefault();
    const playlistId = Number(playlistElegida);
    guardar(async (id) => {
      await agregarCancionAPlaylist(playlistId, id);
      setEnPlaylists((actuales) => [...new Set([...actuales, playlistId])]);
      setPlaylistElegida('');
    });
  };

  const guardarComentario = async (comentario) => {
    await guardarResena(await asegurarCancionId(), { comentario });
  };

  const nombresEnPlaylists = playlists.filter((p) => enPlaylists.includes(p.id)).map((p) => p.nombre);

  return (
    <div className="cancion-acciones">
      <div className="card experiencia-card">
        <h2 className="card-titulo">Tu experiencia</h2>
        <section>
          <h3>Tu biblioteca</h3>
          <div className="status-buttons">
            {ESTADOS.map((e) => (
              <button
                key={e.id}
                type="button"
                className={estado === e.id ? 'active' : ''}
                aria-pressed={estado === e.id}
                disabled={guardando}
                onClick={() => cambiarEstado(e.id)}
              >
                {e.label}
              </button>
            ))}
            <button
              type="button"
              className={favorito ? 'active' : ''}
              aria-pressed={favorito}
              disabled={guardando}
              onClick={cambiarFavorito}
            >
              {favorito ? '♥ Favorito' : '♡ Favorito'}
            </button>
          </div>
        </section>

        <section>
          <h3>Tu puntuación</h3>
          <RatingStars rating={puntuacion} onRate={puntuar} disabled={guardando} />
        </section>

        <section>
          <h3>Agregar a una playlist</h3>
          {playlists.length === 0 ? (
            <p>
              Todavía no tenés playlists. <Link to="/playlists">Creá la primera</Link>.
            </p>
          ) : (
            <form className="inline-form" onSubmit={agregarAPlaylist}>
              <select
                aria-label="Elegí una playlist"
                required
                value={playlistElegida}
                onChange={(e) => setPlaylistElegida(e.target.value)}
              >
                <option value="">Elegí una playlist</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              <button type="submit" disabled={guardando}>Agregar</button>
            </form>
          )}
          {nombresEnPlaylists.length > 0 && (
            <p className="texto-secundario">Está en: {nombresEnPlaylists.join(', ')}</p>
          )}
        </section>

        <ErrorMessage error={error} />
      </div>

      <div className="card">
        <ReviewForm comentarioInicial={relacion.resena?.comentario ?? ''} onGuardar={guardarComentario} />
      </div>
    </div>
  );
};

const CancionAcciones = ({ cancion }) => {
  const { data, loading, error, recargar } = useFetch(
    () => Promise.all([obtenerRelacionConCancion(cancion.artista, cancion.titulo), listarPlaylists()]),
    [cancion.id],
  );

  if (loading) return <LoadingSpinner mensaje="Cargando lo que guardaste..." />;
  if (error) return <ErrorMessage error={error} onRetry={recargar} />;

  const [relacion, playlists] = data;
  return <PanelCancion cancion={cancion} relacion={relacion} playlists={playlists} />;
};

export default CancionAcciones;
