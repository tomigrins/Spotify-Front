// error: un ApiError de los servicios o un texto.
const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  const mensaje = typeof error === 'string' ? error : error.message;
  const detalles = error.detalles ?? [];

  return (
    <div className="error-message" role="alert">
      <p>{mensaje}</p>
      {detalles.length > 0 && (
        <ul>
          {detalles.map((d) => (
            <li key={`${d.campo}-${d.mensaje}`}>{d.mensaje}</li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
