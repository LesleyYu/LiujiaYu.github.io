import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Favorites from '../pages/Favorites';
import ArtistDetailsPage from '../pages/ArtistDetailsPage'; // todo: ArtistDetail Page

const AppRouter = () => {
  return (
    <>
      <div className='container py-4' >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist/:id" element={<ArtistDetailsPage />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/register" element={<Register />} />
          <Route path="/user/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRouter;