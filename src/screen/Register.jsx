import { Link } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import AppShell from '../layout/AppShell';

const Register = () => (
  <AppShell publico>
    <div className="auth-page">
      <h1>Creá tu cuenta</h1>
      <p className="auth-subtitulo">Tu música, tus playlists y una biblioteca que crece con vos.</p>
      <RegisterForm />
      <p className="auth-pie">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  </AppShell>
);

export default Register;
