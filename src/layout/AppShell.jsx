import Footer from './Footer';
import Navbar from './Navbar';
import Topbar from './Topbar';

// Estructura del diseño: menú lateral fijo + barra superior + contenido.
// Con `publico` se usa en login y registro (sin usuario).
const AppShell = ({ publico = false, children }) => (
  <div className="app-shell">
    <Navbar publico={publico} />
    <div className="app-main">
      <Topbar publico={publico} />
      <main className="main-content">{children}</main>
      {!publico && <Footer />}
    </div>
  </div>
);

export default AppShell;
