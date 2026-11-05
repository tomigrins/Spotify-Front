const LoadingSpinner = ({ mensaje = 'Cargando...' }) => (
  <div className="loading" role="status">
    <span className="loading-icon" aria-hidden="true" />
    <span>{mensaje}</span>
  </div>
);

export default LoadingSpinner;
