// Los artistas y lo importado de Spotify o Last.fm no tienen imagen.
const Portada = ({ src, className }) => (
  src
    ? <img src={src} alt="" className={className} loading="lazy" />
    : <div className={`${className} portada-vacia`} aria-hidden="true">♪</div>
);

export default Portada;
