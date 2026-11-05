const numero = new Intl.NumberFormat('es-AR');

const TopArtistsCard = ({ artistas }) => (
  <section className="stats-card">
    <h2>Tus artistas</h2>
    <ol className="ranking">
      {artistas.map((a) => (
        <li key={a.artista_id}>
          <span className="ranking-puesto">{a.puesto}</span>
          <span className="ranking-nombre">{a.artista}</span>
          <span className="ranking-valor">{numero.format(a.minutos)} min</span>
        </li>
      ))}
    </ol>
  </section>
);

export default TopArtistsCard;
