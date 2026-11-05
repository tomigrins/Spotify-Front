import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ErrorMessage from '../common/ErrorMessage';

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      // Si sale bien, PublicRoute redirige al inicio
      await login({ email, password });
    } catch (err) {
      setError(err);
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Email
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <ErrorMessage error={error} />
      <button type="submit" disabled={enviando}>
        {enviando ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
};

export default LoginForm;
