import { Link } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { aviso } = useAuth();

  return (
    <div className="auth-page">
      <h1>Iniciar sesión</h1>
      {/* Sesión vencida o backend inalcanzable al abrir la app */}
      <ErrorMessage error={aviso} />
      <LoginForm />
      <p>
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </div>
  );
};

export default Login;
