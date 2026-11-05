import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ErrorMessage from '../common/ErrorMessage';

const RegisterForm = () => {
  const { register } = useAuth();
  const [datos, setDatos] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      // Si sale bien, PublicRoute redirige al inicio
      await register(datos);
    } catch (err) {
      setError(err);
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Nombre
        <input name="nombre" autoComplete="given-name" required maxLength={100} value={datos.nombre} onChange={cambiar} />
      </label>
      <label>
        Apellido
        <input name="apellido" autoComplete="family-name" required maxLength={100} value={datos.apellido} onChange={cambiar} />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required value={datos.email} onChange={cambiar} />
      </label>
      <label>
        Contraseña (mínimo 8 caracteres)
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={datos.password}
          onChange={cambiar}
        />
      </label>
      <ErrorMessage error={error} />
      <button type="submit" disabled={enviando}>
        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
};

export default RegisterForm;
