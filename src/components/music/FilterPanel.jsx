const FilterPanel = ({ activeType, onSelectType }) => {
  const types = [
    { id: 'track,album,artist', label: 'Todo' },
    { id: 'track', label: 'Canciones' },
    { id: 'album', label: 'Álbumes' },
    { id: 'artist', label: 'Artistas' },
  ];

  return (
    <div className="filter-panel">
      {types.map((type) => (
        <button
          key={type.id}
          className={activeType === type.id ? 'active' : ''}
          onClick={() => onSelectType(type.id)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;