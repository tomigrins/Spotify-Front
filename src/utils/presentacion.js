// Ayudas solo de presentación: no tocan datos ni llamadas al backend.

// { nombre: 'Juli', apellido: 'López' } -> "JL"
export const iniciales = (user) => (
  `${user?.nombre?.[0] ?? ''}${user?.apellido?.[0] ?? ''}`.toUpperCase() || '?'
);

// Saludo según la hora local del navegador.
export function saludo(fecha = new Date()) {
  const hora = fecha.getHours();
  if (hora < 6 || hora >= 20) return 'Buenas noches';
  if (hora < 13) return 'Buenos días';
  return 'Buenas tardes';
}

// "martes, 11 de noviembre"
export const fechaLarga = (fecha = new Date()) => (
  new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(fecha)
);

// Portada de una colección sin imagen: un degradé estable a partir de su id.
const TONOS = [
  ['#2b4a3a', '#0f1a14'], ['#4a3a2b', '#1a140f'], ['#3a2b4a', '#140f1a'],
  ['#2b3d4a', '#0f161a'], ['#4a2b35', '#1a0f13'], ['#3f4a2b', '#161a0f'],
];
export const fondoDeColeccion = (id) => {
  const [a, b] = TONOS[Math.abs(Number(id) || 0) % TONOS.length];
  return { background: `linear-gradient(135deg, ${a}, ${b})` };
};
