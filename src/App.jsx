import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Producto from './producto';
import Error from './Error';
import Success from './Success';
import Paypal from './Paypal';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />  {/* Navbar que se mostrará o no basado en la ruta */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/producto" element={<Producto />} />
        <Route path="/paypal" element={<Paypal />} />
      </Routes>
    </Router>
  );
}

export default App;
