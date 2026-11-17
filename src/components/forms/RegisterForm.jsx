import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ErrorMessage from '../common/ErrorMessage';

const VACIO = { nombre_usuario: '', nombre: '', apellido: '', email: '', password: '', confirmacion: '' };

// Mismas reglas que valida el backend. Se chequean acá para avisar antes de enviar;
// el servidor las vuelve a validar igual.
function validar(datos) {
  const errores = {};
  if (!/^[a-zA-Z0-9_.]{3,30}$/.test(datos.nombre_usuario.trim())) {
    errores.nombre_usuario = 'Entre 3 y 30 caracteres: letras, números, punto o guion bajo.';
  }
  if (!datos.nombre.trim()) errores.nombre = 'Ingresá tu nombre.';
  if (!datos.apellido.trim()) errores.apellido = 'Ingresá tu apellido.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(datos.email.trim())) errores.email = 'Ingresá un email válido.';
  if (datos.password.length < 8) errores.password = 'La contraseña tiene que tener al menos 8 caracteres.';
  if (datos.confirmacion !== datos.password) errores.confirmacion = 'Las contraseñas no coinciden.';
  return errores;
}

const Campo = ({ nombre, label, error, ayuda, ...props }) => (
  <label>
    {label}
    <input
      name={nombre}
      aria-invalid={Boolean(error)}
      aria-describedby={error || ayuda ? `${nombre}-ayuda` : undefined}
      {...props}
    />
    {error ? (
      <span id={`${nombre}-ayuda`} className="campo-error">{error}</span>
    ) : (
      ayuda && <span id={`${nombre}-ayuda`} className="campo-ayuda">{ayuda}</span>
    )}
  </label>
);

const RegisterForm = () => {
  const { register } = useAuth();
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    // El error de un campo se borra cuando lo corrigen
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const encontrados = validar(datos);
    setErrores(encontrados);
    if (Object.values(encontrados).some(Boolean)) return;

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
    <form onSubmit={handleSubmit} className="form form-auth" noValidate>
      <Campo
        nombre="nombre_usuario"
        label="Nombre de usuario"
        autoComplete="username"
        placeholder="ej: juli_rock"
        maxLength={30}
        value={datos.nombre_usuario}
        onChange={cambiar}
        error={errores.nombre_usuario}
        ayuda="Así te van a ver en la app."
      />
      <Campo
        nombre="nombre"
        label="Nombre"
        autoComplete="given-name"
        placeholder="¿Cómo te llamás?"
        maxLength={100}
        value={datos.nombre}
        onChange={cambiar}
        error={errores.nombre}
      />
      <Campo
        nombre="apellido"
        label="Apellido"
        autoComplete="family-name"
        placeholder="Tu apellido"
        maxLength={100}
        value={datos.apellido}
        onChange={cambiar}
        error={errores.apellido}
      />
      <Campo
        nombre="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        value={datos.email}
        onChange={cambiar}
        error={errores.email}
      />
      <Campo
        nombre="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Creá una contraseña"
        value={datos.password}
        onChange={cambiar}
        error={errores.password}
        ayuda="Usá al menos 8 caracteres."
      />
      <Campo
        nombre="confirmacion"
        label="Repetí la contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="La misma contraseña"
        value={datos.confirmacion}
        onChange={cambiar}
        error={errores.confirmacion}
      />
      <ErrorMessage error={error} />
      <button type="submit" className="btn-bloque" disabled={enviando}>
        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
};

export default RegisterForm;
