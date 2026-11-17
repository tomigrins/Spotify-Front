import { Link } from 'react-router-dom';
import { rutaDeCancion } from '../../utils/formato';
import EmptyState from '../common/EmptyState';
import RatingStars from '../common/RatingStars';
import BarrasHorizontales from './BarrasHorizontales';
import ProgresoBiblioteca from './ProgresoBiblioteca';
import StatCard from './StatCard';

const numero = new Intl.NumberFormat('es-AR');
const mesCorto = new Intl.DateTimeFormat('es-AR', { month: 'short', year: '2-digit' });

// "2026-11" -> "nov 26"
const etiquetaMes = (mes) => {
  const [anio, m] = mes.split('-').map(Number);
  return mesCorto.format(new Date(anio, m - 1, 1));
};

// e: respuesta de GET /me/estadisticas
const BibliotecaStats = ({ e }) => {
  if (e.biblioteca.total === 0 && e.favoritos === 0 && e.resenas.total === 0) {
    return (
      <EmptyState titulo="Tu biblioteca está vacía">
        <Link to="/explore">Explorá música</Link> y guardala para ver tus estadísticas.
      </EmptyState>
    );
  }

  const promedio = e.resenas.promedio;

  return (
    <>
      <div className="stats-grid">
        <StatCard label="En tu biblioteca" value={numero.format(e.biblioteca.total)} detalle={`${e.biblioteca.artistasDistintos} artistas distintos`} />
        <StatCard label="Escuchadas este año" value={numero.format(e.biblioteca.escuchadasEsteAnio)} />
        <StatCard label="Favoritas" value={numero.format(e.favoritos)} />
        <StatCard
          label="Puntuación promedio"
          value={promedio === null ? '—' : `${promedio.toFixed(1)} ★`}
          detalle={`${e.resenas.puntuadas} ${e.resenas.puntuadas === 1 ? 'canción puntuada' : 'canciones puntuadas'}`}
        />
        <StatCard label="Reseñas escritas" value={numero.format(e.resenas.conComentario)} />
        <StatCard label="Playlists" value={numero.format(e.playlists.total)} detalle={`${e.playlists.canciones} canciones en total`} />
        <StatCard label="Días activos" value={e.actividad.diasActivosUltimos30} detalle="En los últimos 30 días" />
      </div>

      <section className="stats-card">
        <h2>Tu avance</h2>
        <ProgresoBiblioteca porEstado={e.biblioteca.porEstado} porcentajeEscuchado={e.biblioteca.porcentajeEscuchado} />
      </section>

      <div className="stats-columnas">
        {e.topArtistas.length > 0 && (
          <section className="stats-card">
            <h2>Los que más guardás</h2>
            <ol className="ranking">
              {e.topArtistas.map((a, i) => (
                <li key={a.artista_id}>
                  <span className="ranking-puesto">{i + 1}</span>
                  <span className="ranking-nombre">
                    {a.artista}
                    {a.puntuacion_promedio && <span className="texto-secundario"> · {a.puntuacion_promedio} ★</span>}
                  </span>
                  <span className="ranking-valor">{a.canciones} {a.canciones === 1 ? 'canción' : 'canciones'}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="stats-card">
          <h2>Cómo puntuás</h2>
          <BarrasHorizontales
            etiqueta="Cantidad de canciones por puntuación"
            items={[...e.resenas.distribucion].reverse().map((d) => ({
              id: d.puntuacion,
              label: '★'.repeat(d.puntuacion),
              valor: d.cantidad,
            }))}
          />
        </section>

        {e.topGeneros.length > 0 && (
          <section className="stats-card">
            <h2>Géneros de tu biblioteca</h2>
            <BarrasHorizontales
              etiqueta="Porcentaje de canciones guardadas por género"
              items={e.topGeneros.map((g) => ({ id: g.genero_id, label: g.genero, valor: g.porcentaje, texto: `${g.porcentaje}%` }))}
            />
          </section>
        )}

        <section className="stats-card">
          <h2>Tu actividad</h2>
          <p className="texto-secundario">Cosas que hiciste en la app cada mes: guardar, puntuar, armar playlists.</p>
          <BarrasHorizontales
            etiqueta="Acciones por mes"
            items={e.actividad.porMes.map((m) => ({ id: m.mes, label: etiquetaMes(m.mes), valor: m.acciones }))}
          />
        </section>

        {e.mejorPuntuadas.length > 0 && (
          <section className="stats-card">
            <h2>Tus mejor puntuadas</h2>
            <ol className="ranking">
              {e.mejorPuntuadas.map((c, i) => (
                <li key={c.id}>
                  <span className="ranking-puesto">{i + 1}</span>
                  <span className="ranking-nombre">
                    <Link to={rutaDeCancion(c)}>{c.nombre}</Link> <span className="texto-secundario">· {c.artista}</span>
                  </span>
                  <RatingStars rating={c.puntuacion} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  );
};

export default BibliotecaStats;
