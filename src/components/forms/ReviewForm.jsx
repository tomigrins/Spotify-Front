import { useState } from 'react';
import api from '../../services/api';

const ReviewForm = ({ spotifyId }) => {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.post('/reviews', { spotifyId, comment });
      setSubmitted(true);
      setComment('');
    } catch (err) {
      console.error('Error al guardar reseña', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Escribir una reseña</h3>
      <textarea
        rows="4"
        placeholder="¿Qué te pareció este tema o álbum?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Publicar Reseña</button>
      {submitted && <p className="success-message">¡Reseña guardada con éxito!</p>}
    </form>
  );
};

export default ReviewForm;