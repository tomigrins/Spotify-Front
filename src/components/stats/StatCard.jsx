// destacado: la cifra principal de la pantalla. Tiene que haber una sola.
const StatCard = ({ label, value, detalle, destacado = false }) => (
  <div className={destacado ? 'stat-card stat-card-hero' : 'stat-card'}>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
    {detalle && <p className="stat-detalle">{detalle}</p>}
  </div>
);

export default StatCard;
