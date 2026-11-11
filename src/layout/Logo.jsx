import { Link } from 'react-router-dom';

// Marca del encabezado del menú lateral: círculo verde con franjas diagonales + nombre.
const Logo = () => (
  <Link to="/" className="logo" aria-label="Spotify, ir al inicio">
    <svg className="logo-marca" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="logo-circulo">
          <circle cx="16" cy="16" r="15" />
        </clipPath>
      </defs>
      <circle cx="16" cy="16" r="15" fill="var(--accent)" />
      <g clipPath="url(#logo-circulo)" stroke="var(--sidebar-bg)" strokeWidth="2.2">
        <path d="M-2 22 22 -2M2 28 28 2M8 32 32 8" />
      </g>
    </svg>
    <span className="logo-texto">Spotify</span>
  </Link>
);

export default Logo;
