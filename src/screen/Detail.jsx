import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CancionAcciones from '../components/music/CancionAcciones';
import MusicGrid from '../components/music/MusicGrid';
import Portada from '../components/music/Portada';
import { useFetch } from '../hooks/useFetch';
import { obtenerDetalle } from '../services/musicApi';
import { formatearDuracion } from '../utils/formato';

const ETIQUETAS = { cancion: 'Canción', album: 'Álbum', artista: 'Artista' };
const TITULOS_CONTENIDO = { album: 'Canciones', artista: 'Álbumes' };

const Detail = () => {
  const { id } = useParams();
  const { data: item, loading, error, recargar } = useFetch(() => obtenerDetalle(id), [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={recargar} />;
  if (!item) {
    return (
      <EmptyState titulo="No encontramos este contenido">
        <Link to="/explore">Volver a Explorar</Link>
      </EmptyState>
    );
  }

  const datos = [item.genero, item.anio, formatearDuracion(item.duracionSegundos)].filter(Boolean);

  return (
    <div className="detail-page">
      <div className="detail-header">
        <Portada src={item.imagen} className="detail-img" />
        <div>
          <p className="detail-tipo">{ETIQUETAS[item.tipo]}</p>
          <h1>{item.titulo}</h1>
          {item.artista && <h2>{item.artista}</h2>}
          {item.album && (
            <p>
              Álbum: {item.albumId ? <Link to={`/detail/${item.albumId}`}>{item.album}</Link> : item.album}
            </p>
          )}
          {datos.length > 0 && <p className="texto-secundario">{datos.join(' · ')}</p>}
          {item.previewUrl && (
            <audio controls preload="none" src={item.previewUrl} aria-label={`Fragmento de ${item.titulo}`} />
          )}
        </div>
      </div>

      {item.tipo === 'cancion' ? (
        <CancionAcciones key={item.id} cancion={item} />
      ) : (
        <section>
          <h2>{TITULOS_CONTENIDO[item.tipo]}</h2>
          {item.contenido.length > 0 ? (
            <MusicGrid items={item.contenido} />
          ) : (
            <EmptyState titulo="El catálogo no trae más información" />
          )}
        </section>
      )}
    </div>
  );
};

export default Detail;
