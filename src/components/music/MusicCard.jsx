import { Link } from 'react-router-dom';
import Portada from './Portada';

const ETIQUETAS = { cancion: 'Canción', album: 'Álbum', artista: 'Artista' };

// item: resultado normalizado de musicApi (canción, álbum o artista)
const MusicCard = ({ item }) => (
  <Link to={`/detail/${item.id}`} className="music-card">
    <Portada src={item.imagen} className="music-card-img" />
    <div className="music-card-info">
      <h3>{item.titulo}</h3>
      <p>{item.subtitulo}</p>
      <p className="music-card-tipo">{[ETIQUETAS[item.tipo], item.anio].filter(Boolean).join(' · ')}</p>
    </div>
  </Link>
);

export default MusicCard;
