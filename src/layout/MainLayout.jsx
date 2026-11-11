import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const MainLayout = () => (
  <div className="main-layout">
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
