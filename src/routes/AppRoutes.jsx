import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import Home from '../screen/Home';
import Explore from '../screen/Explore';
import Detail from '../screen/Detail';
import Library from '../screen/Library';
import Playlists from '../screen/Playlists';
import Profile from '../screen/Profile';
import WrappedStats from '../screen/WrappedStats';
import Login from '../screen/Login';
import Register from '../screen/Register';
import NotFound from '../screen/NotFound';
import MainLayout from '../layout/MainLayout';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stats" element={<WrappedStats />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};