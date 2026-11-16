import { ESTADOS } from '../../utils/estados';

// Barra apilada con cuántas canciones hay en cada estado.
// porEstado: { quiero_escuchar, escuchando, escuchado } (de GET /me/estadisticas)
const ProgresoBiblioteca = ({ porEstado, porcentajeEscuchado }) => {
  const total = ESTADOS.reduce((s, e) => s + porEstado[e.id], 0);

  return (
    <div className="progreso">
      <p className="progreso-titulo">
        <strong>{porcentajeEscuchado}%</strong> de tu biblioteca ya la escuchaste
      </p>
      <div
        className="progreso-barra"
        role="img"
        aria-label={ESTADOS.map((e) => `${e.label}: ${porEstado[e.id]}`).join(', ')}
      >
        {total > 0 && ESTADOS.map((e) => (
          porEstado[e.id] > 0 && (
            <span key={e.id} className={`progreso-tramo progreso-${e.id}`} style={{ flexGrow: porEstado[e.id] }} />
          )
        ))}
      </div>
      <ul className="progreso-leyenda">
        {ESTADOS.map((e) => (
          <li key={e.id}>
            <span className={`progreso-punto progreso-${e.id}`} aria-hidden="true" />
            {e.label} <strong>{porEstado[e.id]}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgresoBiblioteca;
