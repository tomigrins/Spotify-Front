import { useState } from 'react';
import { iniciales } from '../../utils/presentacion';

// Foto del usuario; si no tiene (o la URL no carga) muestra sus iniciales.
const Avatar = ({ user, className = 'avatar' }) => {
  const [fallo, setFallo] = useState(null);
  const url = user?.avatar_url;

  if (url && fallo !== url) {
    return (
      <span className={`${className} avatar-foto`} aria-hidden="true">
        <img src={url} alt="" onError={() => setFallo(url)} />
      </span>
    );
  }
  return <span className={className} aria-hidden="true">{iniciales(user)}</span>;
};

export default Avatar;
