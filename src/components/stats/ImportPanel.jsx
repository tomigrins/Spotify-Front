import { useState } from 'react';
import { importarLastfm, importarSpotify } from '../../services/wrappedService';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const numero = new Intl.NumberFormat('es-AR');

// Carga el historial de escucha, que es de donde sale el Wrapped.
const ImportPanel = ({ usuarioLastfm, onImportado }) => {
  const [archivos, setArchivos] = useState([]);
  const [lastfm, setLastfm] = useState(usuarioLastfm ?? '');
  const [importando, setImportando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const importar = async (accion) => {
    setImportando(true);
    setError(null);
    setResultado(null);
    try {
      const respuesta = await accion();
      // Spotify devuelve una importación por archivo; Last.fm, una sola
      const insertadas = [respuesta].flat().reduce((total, i) => total + i.filas_insertadas, 0);
      setResultado(`Se importaron ${numero.format(insertadas)} reproducciones nuevas.`);
      onImportado();
    } catch (err) {
      setError(err);
    } finally {
      setImportando(false);
    }
  };

  const subirSpotify = (e) => {
    e.preventDefault();
    const formulario = e.target;
    importar(() => importarSpotify(archivos)).then(() => {
      formulario.reset();
      setArchivos([]);
    });
  };

  const sincronizarLastfm = (e) => {
    e.preventDefault();
    importar(() => importarLastfm(lastfm.trim()));
  };

  return (
    <section className="stats-card">
      <h2>Importar historial</h2>

      <form className="import-form" onSubmit={subirSpotify}>
        <label>
          Export de Spotify (archivos .json de Privacidad → Descargar tus datos)
          <input
            type="file"
            accept=".json,application/json"
            multiple
            required
            onChange={(e) => setArchivos([...e.target.files])}
          />
        </label>
        <button type="submit" disabled={importando}>Subir archivos</button>
      </form>

      <form className="import-form" onSubmit={sincronizarLastfm}>
        <label>
          Usuario de Last.fm
          <input required maxLength={64} value={lastfm} onChange={(e) => setLastfm(e.target.value)} />
        </label>
        <button type="submit" disabled={importando}>Sincronizar</button>
      </form>

      {importando && <LoadingSpinner mensaje="Importando, puede tardar un rato..." />}
      <ErrorMessage error={error} />
      {resultado && <p className="success-message" role="status">{resultado}</p>}
    </section>
  );
};

export default ImportPanel;
