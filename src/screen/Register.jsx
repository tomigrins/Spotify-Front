import { Link } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';

const Register = () => (
  <div className="auth-page">
    <h1>Crear cuenta</h1>
    <RegisterForm />
    <p>
      ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
    </p>
  </div>
);

export default Register;
