import { Link } from 'react-router-dom';
import { formatearDuracion, rutaDeCancion } from '../../utils/formato';
import Portada from './Portada';

// cancion: fila que devuelve el backend. children: lo que va a la derecha (estado, acciones).
const CancionFila = ({ cancion, children }) => (
  <li className="cancion-fila">
    <Portada src={cancion.portada_url} className="cancion-fila-img" />
    <div className="cancion-fila-info">
      <Link to={rutaDeCancion(cancion)}>{cancion.nombre}</Link>
      <p>
        {cancion.artista}
        {cancion.duracion ? ` · ${formatearDuracion(cancion.duracion)}` : ''}
      </p>
    </div>
    {children && <div className="cancion-fila-extra">{children}</div>}
  </li>
);

export default CancionFila;
