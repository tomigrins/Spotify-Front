import { formatearStreams } from '../../utils/formato';

const numero = new Intl.NumberFormat('es-AR');

// Barras horizontales de una sola serie: un solo color, el valor en la punta de cada barra
// y una tabla equivalente para leer los streams sin depender del tooltip.
const TopGenresChart = ({ generos }) => {
  const maximo = Math.max(...generos.map((g) => g.porcentaje));

  return (
    <section className="stats-card">
      <h2>Tus géneros</h2>
      <p className="texto-secundario">
        Porcentaje de tus streams del año. Un artista puede tener varios géneros: la suma puede pasar de 100%.
      </p>

      <ul className="genre-chart">
        {generos.map((g) => (
          <li key={g.genero_id} className="genre-row" tabIndex={0}>
            <span className="genre-name">{g.genero}</span>
            <span className="genre-track">
              <span className="genre-bar" style={{ '--proporcion': g.porcentaje / maximo }} />
              <span className="genre-value">{g.porcentaje}%</span>
            </span>
            <span className="genre-tooltip" role="tooltip">
              {g.genero}: {formatearStreams(g.streams)}
            </span>
          </li>
        ))}
      </ul>

      <details className="genre-tabla">
        <summary>Ver como tabla</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Género</th>
              <th scope="col">Streams</th>
              <th scope="col">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {generos.map((g) => (
              <tr key={g.genero_id}>
                <td>{g.genero}</td>
                <td>{numero.format(g.streams)}</td>
                <td>{g.porcentaje}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
};

export default TopGenresChart;
