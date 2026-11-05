import MusicCard from './MusicCard';

const MusicGrid = ({ items }) => (
  <div className="music-grid">
    {items.map((item) => (
      <MusicCard key={`${item.tipo}-${item.id}`} item={item} />
    ))}
  </div>
);

export default MusicGrid;
