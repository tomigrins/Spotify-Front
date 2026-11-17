import { useState } from 'react';
import { Link } from 'react-router-dom';
import ActividadLista from '../components/activity/ActividadLista';
import Avatar from '../components/common/Avatar';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CancionFila from '../components/music/CancionFila';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { listarActividad } from '../services/actividadService';
import { actualizarPerfil } from '../services/authService';
import { listarFavoritos } from '../services/bibliotecaService';

// Las preferencias se editan como texto separado por comas y se guardan como lista.
const aTexto = (lista) => (lista ?? []).join(', ');
const aLista = (texto) => [...new Set(texto.split(',').map((t) => t.trim()).filter(Boolean))].slice(0, 20);

const mesYAnio = (fecha) => new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date(fecha));

const Chips = ({ titulo, items }) => (
  items?.length > 0 && (
    <div className="perfil-chips">
      <p className="stat-label">{titulo}</p>
      <ul className="detail-chips">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  )
);

const formularioDesde = (user) => ({
  nombre_usuario: user.nombre_usuario ?? '',
  nombre: user.nombre,
  apellido: user.apellido,
  avatar_url: user.avatar_url ?? '',
  bio: user.bio ?? '',
  generos: aTexto(user.generos_preferidos),
  artistas: aTexto(user.artistas_preferidos),
  lastfm: user.lastfm_usuario ?? '',
});

const EditarPerfil = ({ user, onGuardado, onCancelar }) => {
  const [form, setForm] = useState(() => formularioDesde(user));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const perfil = await actualizarPerfil({
        nombre_usuario: form.nombre_usuario.trim(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        // Vacío = sin avatar / sin bio (null en el backend)
        avatar_url: form.avatar_url.trim() || null,
        bio: form.bio.trim() || null,
        generos_preferidos: aLista(form.generos),
        artistas_preferidos: aLista(form.artistas),
        lastfm_usuario: form.lastfm.trim() || null,
      });
      onGuardado(perfil);
    } catch (err) {
      setError(err);
      setEnviando(false);
    }
  };

  return (
    <form className="form card perfil-form" onSubmit={handleSubmit}>
      <h2 className="card-titulo">Editar perfil</h2>
      <label>
        Nombre de usuario
        <input name="nombre_usuario" required minLength={3} maxLength={30} pattern="[a-zA-Z0-9_.]+" value={form.nombre_usuario} onChange={cambiar} />
        <span className="campo-ayuda">Letras, números, punto o guion bajo.</span>
      </label>
      <div className="form-fila">
        <label>
          Nombre
          <input name="nombre" required maxLength={100} value={form.nombre} onChange={cambiar} />
        </label>
        <label>
          Apellido
          <input name="apellido" required maxLength={100} value={form.apellido} onChange={cambiar} />
        </label>
      </div>
      <label>
        URL de tu foto
        <input name="avatar_url" type="url" placeholder="https://..." maxLength={500} value={form.avatar_url} onChange={cambiar} />
        <span className="campo-ayuda">Dejalo vacío para usar tus iniciales.</span>
      </label>
      <label>
        Bio
        <textarea name="bio" rows={3} maxLength={500} placeholder="Contá qué música te gusta" value={form.bio} onChange={cambiar} />
      </label>
      <label>
        Géneros preferidos
        <input name="generos" placeholder="Rock nacional, Indie, Jazz" value={form.generos} onChange={cambiar} />
        <span className="campo-ayuda">Separados por coma.</span>
      </label>
      <label>
        Artistas preferidos
        <input name="artistas" placeholder="Cerati, Spinetta" value={form.artistas} onChange={cambiar} />
      </label>
      <label>
        Usuario de Last.fm (opcional)
        <input name="lastfm" maxLength={64} value={form.lastfm} onChange={cambiar} />
      </label>
      <ErrorMessage error={error} />
      <div className="form-acciones">
        <button type="submit" disabled={enviando}>{enviando ? 'Guardando...' : 'Guardar cambios'}</button>
        <button type="button" className="btn-secondary" onClick={onCancelar} disabled={enviando}>Cancelar</button>
      </div>
    </form>
  );
};

const Profile = () => {
  const { user, actualizarUsuario } = useAuth();
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const favoritos = useFetch(() => listarFavoritos({ limit: 5 }));
  const actividad = useFetch(() => listarActividad({ limit: 8 }));

  const alGuardar = (perfil) => {
    actualizarUsuario(perfil);
    setEditando(false);
    setGuardado(true);
  };

  const empezarEdicion = () => {
    setEditando(true);
    setGuardado(false);
  };

  return (
    <div className="profile-page">
      <header className="perfil-header card">
        <Avatar user={user} className="avatar avatar-grande" />
        <div className="perfil-datos">
          <h1>{user.nombre} {user.apellido}</h1>
          <p className="texto-secundario">
            @{user.nombre_usuario} · {user.email}
            {user.fecha_registro && ` · En My collection desde ${mesYAnio(user.fecha_registro)}`}
          </p>
          {user.bio ? <p className="perfil-bio">{user.bio}</p> : <p className="texto-secundario">Todavía no escribiste tu bio.</p>}
          <Chips titulo="Géneros preferidos" items={user.generos_preferidos} />
          <Chips titulo="Artistas preferidos" items={user.artistas_preferidos} />
        </div>
        {!editando && (
          <button type="button" className="btn-secondary perfil-editar" onClick={empezarEdicion}>
            Editar perfil
          </button>
        )}
      </header>

      {guardado && <p className="success-message" role="status">Perfil actualizado.</p>}
      {editando && <EditarPerfil user={user} onGuardado={alGuardar} onCancelar={() => setEditando(false)} />}

      <div className="dos-columnas">
        <section className="card">
          <div className="card-header">
            <h2>Tus favoritos</h2>
            {favoritos.data?.total > 0 && (
              <Link to="/library" className="link-acento">Ver los {favoritos.data.total}</Link>
            )}
          </div>
          {favoritos.loading && <LoadingSpinner />}
          <ErrorMessage error={favoritos.error} onRetry={favoritos.recargar} />
          {favoritos.data?.total === 0 && (
            <EmptyState titulo="Sin favoritos todavía">
              Marcá canciones como favoritas desde <Link to="/explore">Explorar</Link>.
            </EmptyState>
          )}
          {favoritos.data?.data.length > 0 && (
            <ul className="cancion-lista">
              {favoritos.data.data.map((c) => <CancionFila key={c.id} cancion={c} />)}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Actividad reciente</h2>
          </div>
          {actividad.loading && <LoadingSpinner />}
          <ErrorMessage error={actividad.error} onRetry={actividad.recargar} />
          {actividad.data && <ActividadLista items={actividad.data.data} />}
        </section>
      </div>
    </div>
  );
};

export default Profile;
