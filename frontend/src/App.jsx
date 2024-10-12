import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Provider } from 'react-redux';

function App() {

  return (
    <>
      <Navbar />
      <Outlet />
      <Provider/>
      <Footer/>
    </>
  );
}

export default App