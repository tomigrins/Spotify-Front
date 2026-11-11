import { Link } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../layout/AppShell';

const Login = () => {
  const { aviso } = useAuth();

  return (
    <AppShell publico>
      <div className="auth-page">
        <h1>Iniciá sesión</h1>
        <p className="auth-subtitulo">Volvete a tu biblioteca, tus playlists y la música que te gusta.</p>
        {/* Sesión vencida o backend inalcanzable al abrir la app */}
        <ErrorMessage error={aviso} />
        <LoginForm />
        <p className="auth-pie">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </AppShell>
  );
};

export default Login;
