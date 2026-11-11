import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import Icon from '../components/common/Icon';
import { useAuth } from '../hooks/useAuth';
import { iniciales } from '../utils/presentacion';
import Logo from './Logo';

// Mismas rutas que antes; cambian solo los textos y la ubicación (menú lateral del diseño).
const ENLACES = [
  { to: '/', label: 'Inicio', icono: 'inicio', end: true },
  { to: '/explore', label: 'Buscar', icono: 'buscar' },
  { to: '/playlists', label: 'Colecciones', icono: 'colecciones' },
  { to: '/stats', label: 'Estadísticas', icono: 'estadisticas' },
];

const ENLACES_ESPACIO = [
  { to: '/library', label: 'Biblioteca', icono: 'biblioteca' },
];

// Menú lateral. Con `publico` (login y registro) no hay usuario: muestra los accesos a la cuenta.
const Navbar = ({ publico = false }) => {
  const { user, logout } = useAuth();
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState(null);

  const cerrarSesion = async () => {
    setCerrando(true);
    setError(null);
    try {
      // Si sale bien, ProtectedRoute lleva al login y este componente se desmonta
      await logout();
    } catch (err) {
      setError(err);
      setCerrando(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo />
      </div>

      <nav aria-label="Principal" className="sidebar-nav">
        <ul className="sidebar-menu">
          {ENLACES.map((enlace) => (
            <li key={enlace.to}>
              <NavLink to={enlace.to} end={enlace.end} className="sidebar-link">
                <Icon nombre={enlace.icono} size={18} />
                <span>{enlace.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="sidebar-seccion">Tu espacio · My collection</p>
        <ul className="sidebar-espacio">
          {ENLACES_ESPACIO.map((enlace) => (
            <li key={enlace.to}>
              <NavLink to={enlace.to} className="sidebar-sublink">
                <Icon nombre={enlace.icono} size={14} />
                <span>{enlace.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {!publico && user && (
          <div className="sidebar-usuario">
            <NavLink to="/profile" className="sidebar-perfil" aria-label={`Perfil de ${user.nombre}`}>
              <span className="avatar" aria-hidden="true">{iniciales(user)}</span>
              <span className="sidebar-perfil-texto">
                <span className="sidebar-perfil-nombre">{user.nombre} {user.apellido}</span>
                <span className="sidebar-perfil-detalle">Perfil personal</span>
              </span>
            </NavLink>
            <button
              type="button"
              className="btn-icono"
              onClick={cerrarSesion}
              disabled={cerrando}
              aria-label={cerrando ? 'Cerrando sesión...' : 'Cerrar sesión'}
              title="Cerrar sesión"
            >
              <Icon nombre="salir" size={16} />
            </button>
          </div>
        )}
      </nav>

      {publico && (
        <div className="sidebar-cuenta">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </div>
      )}

      <ErrorMessage error={error} />
    </aside>
  );
};

export default Navbar;
