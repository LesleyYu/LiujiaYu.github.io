import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
// import Navbar from '../components/Navbar';

const AppRouter = () => {
  return (
    <>
      <div className='container py-4' >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist/:id" element={<About />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRouter;