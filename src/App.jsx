import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './CSS/App.css';
import Navbar from './Navbar.jsx';
import Home from './home.jsx';
import Servicios from './Servicios.jsx';
import Reservas from './Reservas.jsx';
import Contacto from './Contacto.jsx';
import Cotiza from './Cotizar.jsx';
import Cart from './Cart.jsx';
import Cuenta from './Cuenta.jsx';
import Login from './Login.jsx';
import Registro from './Registro.jsx'
import HomeAdmin from './homeAdmin.jsx';
import ServiciosAdm from './serviciosAdm.jsx';
import TrabajadoresAdm from './trabajadoresAdm.jsx';
import ReservasAdm from './reservasAdm.jsx';
import ClientesAdm from './clientesAdm.jsx';


const App = () => {
    
    const [userType, setUserType] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [visible, setVisible] = useState(true);
    let lastScrollY = window.pageYOffset;

    

    useEffect(() => {
        
        const handleScroll = () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            let scrollPercentage = scrollTop / maxScroll;

            let white = [255, 255, 255]; // Color blanco
            let lightBlue = [173, 216, 230]; // Color celeste pastel

            let interpolatedColor = white.map((start, i) => {
                return Math.round(start + (lightBlue[i] - start) * scrollPercentage);
            });

            document.body.style.backgroundColor = `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;

            const currentScrollY = window.pageYOffset;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setVisible(false); // Oculta el navbar al desplazarse hacia abajo
            } else {
                setVisible(true); // Muestra el navbar al desplazarse hacia arriba
            }

            lastScrollY = currentScrollY;
        };
        

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    

    return (
        <Router>
        
            <Navbar visible={visible} /> {<Navbar/>}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/Servicios" element={<Servicios/>}/>
                <Route path="/Cotiza" element={<Cotiza />}/>  
                <Route path="/Cart" element={<Cart />} />
                <Route path="/Login" element={<Login />}/>
                <Route path="/Registro" element={<Registro />} />
                <Route path="/Cuenta"  element={ <Cuenta />} />
                <Route path="/HomeAdmin" element={<HomeAdmin />}/>
                <Route path="/serviciosAdm" element={<ServiciosAdm/>}/>
                <Route path="/trabajadoresAdm" element={<TrabajadoresAdm/>}/>
                <Route path="/reservasAdm" element={<ReservasAdm/>}/>
                <Route path="/clientesAdm" element={<ClientesAdm/>}/>
                
            </Routes>   
        </Router>
    );
};

export default App;

