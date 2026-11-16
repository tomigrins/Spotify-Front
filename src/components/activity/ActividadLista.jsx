import { Link } from 'react-router-dom';
import { describirActividad, haceCuanto } from '../../utils/actividad';
import { rutaDeCancion } from '../../utils/formato';
import EmptyState from '../common/EmptyState';
import Portada from '../music/Portada';

// items: data de GET /me/actividad
const ActividadLista = ({ items }) => {
  if (items.length === 0) {
    return (
      <EmptyState titulo="Todavía no hay actividad">
        Cuando guardes, puntúes o armes playlists, lo vas a ver acá.
      </EmptyState>
    );
  }

  return (
    <ul className="actividad-lista">
      {items.map((a) => (
        <li key={a.id} className="actividad-item">
          <Portada src={a.cancion?.portada_url} className="actividad-img" />
          <div className="actividad-texto">
            <p>
              {a.cancion ? <Link to={rutaDeCancion(a.cancion)}>{describirActividad(a)}</Link> : describirActividad(a)}
            </p>
            <time className="texto-secundario" dateTime={a.fecha} title={new Date(a.fecha).toLocaleString('es-AR')}>
              {haceCuanto(a.fecha)}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActividadLista;
