import { ESTADOS } from '../../utils/estados';

const StatusBadge = ({ estado }) => {
  const encontrado = ESTADOS.find((e) => e.id === estado);
  if (!encontrado) return null;
  return <span className="status-badge">{encontrado.label}</span>;
};

export default StatusBadge;
