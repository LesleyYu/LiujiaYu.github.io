import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './router/AppRouter'

const App = () => {
  return (
    <div className='App'>
      <div className='d-flex flex-column min-vh-100 pb-5'>
        <Navbar />
        <AppRouter />
        <Footer />
      </div>
    </div>
  )
}

export default App
