// Respuesta vacía: no es un error, pero la pantalla tiene que explicar qué pasó.
const EmptyState = ({ titulo, children }) => (
  <div className="empty-state">
    <h3>{titulo}</h3>
    {children && <div>{children}</div>}
  </div>
);

export default EmptyState;
