import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="auth-page not-found">
    <h1>Página no encontrada</h1>
    <p>
      La dirección no existe. <Link to="/">Volver al inicio</Link>
    </p>
  </div>
);

export default NotFound;
