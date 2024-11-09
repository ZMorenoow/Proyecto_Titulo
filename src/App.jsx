import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './CSS/App.css';
import Navbar from './Navbar.jsx';
import Home from './home.jsx';
import Servicios from './Servicios.jsx';
import Reservas from './Reservas.jsx';
import Contacto from './Contacto.jsx';
import Cotiza from './Cotizar.jsx';
import Carrito from './Carrito.jsx';
import Cart from './Cart.jsx';
import Cuenta from './Cuenta.jsx';
import Login from './Login.jsx';
import Registro from './Registro.jsx'

const App = () => {
    const [visible, setVisible] = useState(true);
    let lastScrollY = window.pageYOffset;

    useEffect(() => {
        const handleScroll = () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            let scrollPercentage = scrollTop / maxScroll;

            let white = [255, 255, 255];
            let lightBlue = [173, 216, 230];

            let interpolatedColor = white.map((start, i) => {
                return Math.round(start + (lightBlue[i] - start) * scrollPercentage);
            });

            document.body.style.backgroundColor = `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;

            const currentScrollY = window.pageYOffset;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Router>
            <Navbar visible={visible} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/Servicios" element={<Servicios />} />
                <Route path="/Cotiza" element={<Cotiza />} />
                <Route path="/Carrito" element={<Carrito />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Registro" element={<Registro />} />
                <Route path="/Cuenta"  element={ <Cuenta />} />
            </Routes>
        </Router>
    );
};

export default App;