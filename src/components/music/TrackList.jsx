import { Link } from 'react-router-dom';
import { formatearDuracion } from '../../utils/formato';

// Canciones de un álbum (resultados normalizados de musicApi). Cada fila lleva a su detalle.
const TrackList = ({ items }) => (
  <table className="track-list">
    <thead>
      <tr>
        <th scope="col" className="track-num">#</th>
        <th scope="col">Título</th>
        <th scope="col" className="track-duracion">Duración</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item, i) => (
        <tr key={`${item.tipo}-${item.id}`}>
          <td className="track-num">{i + 1}</td>
          <td>
            <Link to={`/detail/${item.id}`}>{item.titulo}</Link>
            <span className="track-artista">{item.artista}</span>
          </td>
          <td className="track-duracion">{formatearDuracion(item.duracionSegundos) ?? '—'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TrackList;
