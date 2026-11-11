// Sin onRate es solo de lectura.
const RatingStars = ({ rating = 0, onRate, disabled = false }) => (
  <div className="rating-stars" role={onRate ? 'group' : 'img'} aria-label={`Puntuación: ${rating} de 5`}>
    {[1, 2, 3, 4, 5].map((valor) => {
      const clase = valor <= rating ? 'star star-on' : 'star';
      return onRate ? (
        <button
          key={valor}
          type="button"
          className={clase}
          disabled={disabled}
          aria-label={`${valor} de 5`}
          aria-pressed={valor === rating}
          onClick={() => onRate(valor)}
        >
          ★
        </button>
      ) : (
        <span key={valor} className={clase} aria-hidden="true">★</span>
      );
    })}
  </div>
);

export default RatingStars;
