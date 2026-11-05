import { useState } from 'react';
import ErrorMessage from '../common/ErrorMessage';

// onGuardar(comentario): la llamada HTTP la hace quien lo usa, a través de los servicios.
const ReviewForm = ({ comentarioInicial = '', onGuardar }) => {
  const [comment, setComment] = useState(comentarioInicial);
  const [enviando, setEnviando] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setEnviando(true);
    setSubmitted(false);
    setError(null);

    try {
      await onGuardar(comment);
      setSubmitted(true);
    } catch (err) {
      setError(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form review-form">
      <h3>Tu reseña</h3>
      <textarea
        rows="4"
        maxLength={2000}
        aria-label="Tu reseña"
        placeholder="¿Qué te pareció este tema?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <ErrorMessage error={error} />
      {submitted && <p className="success-message" role="status">¡Reseña guardada con éxito!</p>}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Guardar reseña'}
      </button>
    </form>
  );
};

export default ReviewForm;
