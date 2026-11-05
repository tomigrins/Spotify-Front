// Todos los errores HTTP (backend y API externa) llegan a la interfaz con esta forma, así
// las pantallas no dependen de Axios y cada situación se muestra de una sola manera.
//   tipo: 'conexion' | 'sesion' | 'limite' | 'servidor' | 'solicitud'
export class ApiError extends Error {
  constructor({ tipo, mensaje, status, codigo, detalles }) {
    super(mensaje);
    this.name = 'ApiError';
    this.tipo = tipo;
    this.status = status;
    this.codigo = codigo;
    this.detalles = detalles;
  }
}

// Los manda el backend solo cuando falla la sesión. Otros 401, como una contraseña
// incorrecta, no los traen: esos no deben cerrar la sesión.
const CODIGOS_SESION = ['TOKEN_AUSENTE', 'TOKEN_INVALIDO', 'TOKEN_VENCIDO'];

export function errorDelBackend(error) {
  if (!error.response) {
    return new ApiError({
      tipo: 'conexion',
      mensaje: 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.',
    });
  }

  const { status, data } = error.response;
  const base = { status, codigo: data?.codigo, detalles: data?.detalles };

  if (status === 401 && CODIGOS_SESION.includes(data?.codigo)) {
    return new ApiError({ ...base, tipo: 'sesion', mensaje: 'Tu sesión venció. Iniciá sesión de nuevo.' });
  }
  if (status === 429) {
    return new ApiError({ ...base, tipo: 'limite', mensaje: data?.error ?? 'Demasiados intentos. Probá en unos minutos.' });
  }
  if (status >= 500) {
    return new ApiError({ ...base, tipo: 'servidor', mensaje: 'El servidor tuvo un problema. Intentá de nuevo en unos minutos.' });
  }
  return new ApiError({ ...base, tipo: 'solicitud', mensaje: data?.error ?? 'No se pudo completar la operación.' });
}

export function errorDeApiExterna(error) {
  if (!error.response) {
    return new ApiError({
      tipo: 'conexion',
      mensaje: 'No se pudo conectar con el catálogo de música. Revisá tu conexión e intentá de nuevo.',
    });
  }

  const { status } = error.response;
  // iTunes limita las consultas por minuto y responde 403 cuando se pasan
  if (status === 403 || status === 429) {
    return new ApiError({ status, tipo: 'limite', mensaje: 'El catálogo recibió demasiadas consultas. Esperá un minuto y reintentá.' });
  }
  return new ApiError({ status, tipo: 'servidor', mensaje: 'El catálogo de música no está disponible en este momento.' });
}
