import { useNavigate } from 'react-router-dom';

const MusicCard = ({ item }) => {
  const navigate = useNavigate();

  // Adaptamos las propiedades de Spotify según si es canción, álbum o artista
  const id = item.id;
  const title = item.name;
  const image = item.images?.[0]?.url || item.album?.images?.[0]?.url || '/assets/logo.svg';
  const subtitle = item.artists?.map((a) => a.name).join(', ') || item.type;

  return (
    <div className="music-card" onClick={() => navigate(`/detail/${id}`)}>
      <img src={image} alt={title} className="music-card-img" />
      <div className="music-card-info">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default MusicCard;