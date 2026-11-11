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
    <form onSubmit={handleSubmit} className="form form-auth">
      <label>
        Nombre
        <input name="nombre" autoComplete="given-name" placeholder="¿Cómo te llamás?" required maxLength={100} value={datos.nombre} onChange={cambiar} />
      </label>
      <label>
        Apellido
        <input name="apellido" autoComplete="family-name" placeholder="Tu apellido" required maxLength={100} value={datos.apellido} onChange={cambiar} />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" placeholder="tu@email.com" required value={datos.email} onChange={cambiar} />
      </label>
      <label>
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Creá una contraseña"
          aria-describedby="password-ayuda"
          required
          minLength={8}
          value={datos.password}
          onChange={cambiar}
        />
        <span id="password-ayuda" className="campo-ayuda">Usá al menos 8 caracteres.</span>
      </label>
      <ErrorMessage error={error} />
      <button type="submit" className="btn-bloque" disabled={enviando}>
        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
};

export default RegisterForm;
