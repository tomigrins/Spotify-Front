import { useState } from 'react';
import Icon from '../common/Icon';

const SearchBar = ({ valorInicial = '', onSearch }) => {
  const [query, setQuery] = useState(valorInicial);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar" role="search">
      <Icon nombre="buscar" size={18} className="search-bar-icono" />
      <input
        type="search"
        aria-label="Buscar música"
        placeholder="Buscar canciones, álbumes o artistas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchBar;
