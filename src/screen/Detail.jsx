import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTrackDetail } from '../services/spotifyApi';
import api from '../services/api';
import RatingStars from '../components/common/RatingStars';
import ReviewForm from '../components/forms/ReviewForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Detail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Quiero escuchar');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getTrackDetail(id);
        setItem(data);
      } catch (err) {
        console.error('Error al obtener detalle de Spotify', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Guardar en la biblioteca (Backend Propio)
  const handleSaveToLibrary = async (newStatus) => {
    setStatus(newStatus);
    await api.post('/library', {
      spotifyId: item.id,
      title: item.name,
      artistName: item.artists.map((a) => a.name).join(', '),
      coverImageUrl: item.album.images[0]?.url,
      status: newStatus,
    });
  };

  // Guardar Puntuación (Backend Propio)
  const handleRate = async (newRating) => {
    setRating(newRating);
    await api.post('/ratings', {
      spotifyId: item.id,
      rating: newRating,
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!item) return <p>No se encontró el contenido.</p>;

  return (
    <div className="detail-page">
      <div className="detail-header">
        <img src={item.album.images[0]?.url} alt={item.name} />
        <div>
          <h1>{item.name}</h1>
          <h2>{item.artists.map((a) => a.name).join(', ')}</h2>
          <p>Álbum: {item.album.name}</p>

          {/* Estados obligatorios */}
          <div className="status-buttons">
            {['Quiero escuchar', 'Escuchando', 'Escuchado', 'Favorito'].map((s) => (
              <button
                key={s}
                className={status === s ? 'active' : ''}
                onClick={() => handleSaveToLibrary(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Puntuación */}
          <div className="rating-container">
            <p>Tu puntuación:</p>
            <RatingStars rating={rating} onRate={handleRate} />
          </div>
        </div>
      </div>

      {/* Formulario de Reseña */}
      <ReviewForm spotifyId={item.id} />
    </div>
  );
};

export default Detail;