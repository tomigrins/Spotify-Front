import StatCard from './StatCard';

const numero = new Intl.NumberFormat('es-AR');

const WrappedSummaryCard = ({ resumen, habitos, minutosEstimados }) => (
  <div className="stats-grid">
    <StatCard
      destacado
      label="Minutos escuchados"
      value={numero.format(resumen.minutos_escuchados)}
      detalle={minutosEstimados ? 'Estimado: Last.fm no informa cuánto escuchaste de cada canción' : null}
    />
    <StatCard label="Streams" value={numero.format(resumen.streams)} detalle="Escuchas de 30 segundos o más" />
    <StatCard label="Canciones distintas" value={numero.format(resumen.canciones_distintas)} />
    <StatCard label="Artistas distintos" value={numero.format(resumen.artistas_distintos)} />
    {habitos.diaFavorito && <StatCard label="Día favorito" value={habitos.diaFavorito} />}
    {habitos.franjaFavorita && <StatCard label="Momento del día" value={habitos.franjaFavorita} />}
    {habitos.horaFavorita !== null && <StatCard label="Hora favorita" value={`${habitos.horaFavorita} h`} />}
  </div>
);

export default WrappedSummaryCard;
