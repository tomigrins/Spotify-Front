import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../components/common/Icon';
import { ThemeContext } from '../context/contexts';
import { useAuth } from '../hooks/useAuth';
import { iniciales } from '../utils/presentacion';

// Nombre de la sección para la miga de pan, según la ruta actual.
const SECCIONES = [
  ['/explore', 'Explorar'],
  ['/detail', 'Explorar / Detalle'],
  ['/library', 'Biblioteca'],
  ['/playlists', 'Colecciones'],
  ['/stats', 'Estadísticas'],
  ['/profile', 'Perfil'],
  ['/login', 'Iniciar sesión'],
  ['/register', 'Registro'],
];

const seccionDe = (pathname) => SECCIONES.find(([ruta]) => pathname.startsWith(ruta))?.[1] ?? 'Inicio';

const Topbar = ({ publico = false }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const siguienteTema = theme === 'dark' ? 'Tema claro' : 'Tema oscuro';

  return (
    <header className={publico ? 'topbar topbar-publica' : 'topbar'}>
      <p className="topbar-miga">
        <span className="topbar-miga-raiz">My collection</span>
        <span aria-hidden="true">/</span>
        <span className="topbar-miga-actual">{seccionDe(pathname)}</span>
      </p>

      <div className="topbar-acciones">
        {publico ? (
          <>
            <Link to="/login" className="topbar-link">Iniciar sesión</Link>
            <Link to="/register" className="topbar-link">Registrarse</Link>
          </>
        ) : (
          <span className="topbar-lema">Tu música, tu historia.</span>
        )}
        <button
          type="button"
          className="btn-icono"
          onClick={toggleTheme}
          aria-label={siguienteTema}
          title={siguienteTema}
        >
          <Icon nombre={theme === 'dark' ? 'sol' : 'luna'} size={16} />
        </button>
        {!publico && user && (
          <Link to="/profile" className="avatar avatar-chico" aria-label="Tu perfil">
            {iniciales(user)}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Topbar;
