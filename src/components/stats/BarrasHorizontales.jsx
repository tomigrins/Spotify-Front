// Barras horizontales de una sola serie (mismo estilo que el gráfico de géneros del Wrapped).
// items: [{ id, label, valor, texto? }]. texto es lo que se muestra en la punta (por defecto, el valor).
const BarrasHorizontales = ({ items, etiqueta }) => {
  const maximo = Math.max(1, ...items.map((i) => i.valor));

  return (
    <ul className="genre-chart" aria-label={etiqueta}>
      {items.map((i) => (
        <li key={i.id} className="genre-row">
          <span className="genre-name">{i.label}</span>
          <span className="genre-track">
            <span className="genre-bar" style={{ '--proporcion': i.valor / maximo }} />
            <span className="genre-value">{i.texto ?? i.valor}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default BarrasHorizontales;
