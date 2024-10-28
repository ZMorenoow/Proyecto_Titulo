import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png'; // Asegúrate de que la ruta sea correcta

const Navbar = ({ visible }) => {
    return (
        <nav className={`navbar navbar-expand-lg fixed-top ${visible ? '' : 'd-none'}`}>
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
                            <img src={logo} alt="Logo" width="80" height="80" className="d-inline-block align-text-top" />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                            <div className="offcanvas-body">
                                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                    <li className="nav-item">
                                        <Link className="nav-link " aria-current="page" to="/">Inicio</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/reservas">Reservas</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/contacto">Contacto</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
    );
};

export default Navbar;
