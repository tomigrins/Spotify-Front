import { useState } from 'react';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { actualizarPerfil } from '../services/authService';

const Profile = () => {
  const { user, actualizarUsuario } = useAuth();
  const [nombre, setNombre] = useState(user.nombre);
  const [apellido, setApellido] = useState(user.apellido);
  const [lastfm, setLastfm] = useState(user.lastfm_usuario ?? '');
  const [enviando, setEnviando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setGuardado(false);
    setError(null);

    try {
      const perfil = await actualizarPerfil({ nombre, apellido, lastfm_usuario: lastfm.trim() || null });
      actualizarUsuario(perfil);
      setGuardado(true);
    } catch (err) {
      setError(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Tu perfil</h1>
      <p className="texto-secundario">{user.email}</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input required maxLength={100} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Apellido
          <input required maxLength={100} value={apellido} onChange={(e) => setApellido(e.target.value)} />
        </label>
        <label>
          Usuario de Last.fm (opcional)
          <input maxLength={64} value={lastfm} onChange={(e) => setLastfm(e.target.value)} />
        </label>
        <ErrorMessage error={error} />
        {guardado && <p className="success-message" role="status">Perfil actualizado.</p>}
        <button type="submit" disabled={enviando}>{enviando ? 'Guardando...' : 'Guardar cambios'}</button>
      </form>
    </div>
  );
};

export default Profile;
