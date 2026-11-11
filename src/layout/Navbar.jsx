import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import { ThemeContext } from '../context/contexts';
import { useAuth } from '../hooks/useAuth';

const ENLACES = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explore', label: 'Explorar' },
  { to: '/library', label: 'Biblioteca' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/stats', label: 'Wrapped' },
  { to: '/profile', label: 'Perfil' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
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
    <header className="navbar">
      <nav aria-label="Principal">
        {ENLACES.map((enlace) => (
          <NavLink key={enlace.to} to={enlace.to} end={enlace.end}>
            {enlace.label}
          </NavLink>
        ))}
      </nav>
      <div className="navbar-usuario">
        <span>{user.nombre}</span>
        <button type="button" className="btn-secondary" onClick={toggleTheme}>
          {theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
        </button>
        <button type="button" className="btn-secondary" onClick={cerrarSesion} disabled={cerrando}>
          {cerrando ? 'Cerrando...' : 'Cerrar sesión'}
        </button>
      </div>
      <ErrorMessage error={error} />
    </header>
  );
};

export default Navbar;
