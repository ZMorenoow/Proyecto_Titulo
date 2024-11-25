import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/utils/AuthContext.jsx'
import logo from '../img/logo.png';
import carro from '../img/carro.png';
import './CSS/Navbar.css';

const Navbar = ({ visible }) => {
    const { isAuthenticated, rol, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar navbar-expand-lg fixed-top ${visible ? '' : 'd-none'}`}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" className="d-inline-block align-text-top" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        {rol === 'Administrador' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/HomeAdmin">Admin</Link>
                                </li>
                        )}

                            {rol === 'Trabajador' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/HomeWorker">Trabajador</Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <Link className="nav-link" to="/Servicios">Servicios</Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link className="nav-link" to="/contacto">Contacto</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/map">Mapa</Link>
                            </li>
                            <li className="nav-item d-flex align-items-center">
                                {isAuthenticated ? (
                                    <div className="d-flex align-items-center">
                                        <Link className="nav-link" to="/Cuenta">Mi cuenta</Link>
                                        <button className="nav-link btn btn-link ms-2" onClick={handleLogout}>Cerrar sesión</button>
                                    </div>
                                ) : (
                                    <>
                                        <Link className="nav-link" to="/login">Iniciar sesión</Link>
                                        <Link className="nav-link ms-2" to="/registro">Registrarse</Link>
                                    </>
                                )}
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className="nav-link" 
                                    to={isAuthenticated ? "/cart" : "/login"}
                                    onClick={() => {
                                        if (!isAuthenticated) alert("Debes iniciar sesión para acceder al carrito.");
                                    }}
                                >
                                    <img src={carro} alt="CarroCompras" className="carrito" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;