import { useState } from 'react';
import SearchBar from '../components/music/SearchBar';
import FilterPanel from '../components/music/FilterPanel';
import MusicGrid from '../components/music/MusicGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { searchCatalog } from '../services/spotifyApi';

const Explore = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('track,album,artist');

  const handleSearch = async (query, type = filterType) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const data = await searchCatalog(query, type);
      // Normalizamos la respuesta de Spotify (tracks, albums, artists)
      const tracks = data.tracks?.items || [];
      const albums = data.albums?.items || [];
      const artists = data.artists?.items || [];

      setResults([...tracks, ...albums, ...artists]);
    } catch (err) {
      setError('Ocurrió un error al realizar la búsqueda en Spotify.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newType) => {
    setFilterType(newType);
    if (searchQuery) {
      handleSearch(searchQuery, newType);
    }
  };

  return (
    <div className="explore-page">
      <h1>Explorar Música</h1>
      <SearchBar onSearch={(q) => handleSearch(q, filterType)} />
      <FilterPanel activeType={filterType} onSelectType={handleFilterChange} />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <MusicGrid items={results} />}
    </div>
  );
};

export default Explore;