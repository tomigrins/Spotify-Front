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
          type="button"
          className={activeType === type.id ? 'active' : ''}
          aria-pressed={activeType === type.id}
          onClick={() => onSelectType(type.id)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;
