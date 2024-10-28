import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import './CSS/App.css';
import './CSS/Tarjeta.css';
import './CSS/Carrusel.css';
import './CSS/Navbar.css';
import './CSS/Home.css';
import Navbar from './navbar';
import Footer from './footer';



const Home = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY < 50);
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <Navbar /> 
            <br />
            <br />
            <br />
            <main>
                <h1>Bienvenido a nuestro servicio de limpieza</h1>
                <p>Ofrecemos los mejores servicios de limpieza para todos tus espacios.</p>
                
                <section className="seccion-titulo text-center py-5">
                    <div className="container-1">
                        <h1 className="display-4 fw-bold">Limpieza de Pisos, Espacios Amplios, Supermercados y Estacionamientos</h1>
                    </div>
                </section>
                <br/>
                <h2>Conoce nuestros servicios</h2>
                {/* Carrusel */}
                <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="5" aria-label="Slide 6"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="../img/cobertores.jpg" className="d-block w-100" alt="Slide 1" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Limpieza de cobertores</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="../img/alfombras.jpg" className="d-block w-100" alt="Slide 2" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Limpieza de alfombras</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="../img/cortinas.jpg" className="d-block w-100" alt="Slide 3" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Limpieza de cortinas</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="../img/piso.jpg"className="d-block w-100" alt="Slide 4" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Limpieza de pisos</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="../img/pulido.jpg" className="d-block w-100" alt="Slide 5" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Pulido de pisos</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="../img/sillones.jpg"className="d-block w-100" alt="Slide 6" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Limpieza de sillones</h5>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                <br/>
                <div className="franja-servicio">
                    <div className="container-servicio text-center">
                        <br/>
                        <h2 className="titulo-servicio">¿Cómo funciona nuestro servicio?</h2>
                        <div className="pasos-servicio">
                            <div className="paso">
                                <Link className="img-servicio" to="/Cotiza">
                                    <img src="../img/cotizar.png"alt="Cotizar" className="imagen-paso" />
                                </Link>           
                                <h3>Cotizar</h3>
                                <br/>
                                <p>Ingresa los detalles de tu espacio y obtén un presupuesto rápido y fácil.</p>
                               
                            </div>
                            <div className="paso">                            
                                
                                <Link className="img-servicio" to="/Reservas">
                                    <img src="../img/reserva.png"alt="Reservar" className="imagen-paso" />  
                                </Link>  
                                
                                <h3>Reservar el servicio</h3>
                                <br/>
                                <p>Selecciona la fecha y hora que mejor te acomode para agendar el servicio y confirma tu cita en pocos pasos.</p>
                            </div>
                            <div className="paso">
                                <img src="../img/relajo.png" alt="relajarse" className="imagen-paso" />
                                <h3>Relajarse</h3>
                                <br/>
                                <p>Disfruta de tu tiempo mientras nosotros nos encargamos de dejar tu espacio limpio y ordenado.</p>
                            </div>
                        </div>
                    </div>
                </div>


                <section className="text-center py-5">
                    <div className="container-3">
                        <h2 className="fw-bold">Recomendaciones</h2>
                        <br/>
                        <div className="row">
                        <div className="col-md-4"> 
                            <div className="card-container">
                            <div className="card-flip">
                                <div className="card-front">
                                <img src="../img/vacuolavadora.png" alt="Servicio de lavado de espacios amplios" className="card-image" />
                                <br/> 
                                <h4>¿Por qué debería contratar un servicio de lavado de espacios amplios?</h4>
                                </div>
                                <div className="card-back">
                                <p>
                                    Eficiencia y calidad garantizada <br />
                                    Mejora de la imagen y la seguridad <br />
                                    Ahorro del tiempo y recursos
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-container">
                            <div className="card-flip">
                                <div className="card-front">
                                <img src="../img/alfombra_reco.jpeg" alt="Limpieza de alfombras" className="card-image"  />
                                <br/>
                                <h4>¿Por qué lavar las alfombras?</h4>
                                
                                </div>
                                <div className="card-back">
                                <p>
                                    Mejora la higiene <br />
                                    Elimina los malos olores <br />
                                    Protege la salud <br />
                                    Mejora la apariencia <br />
                                    Prolonga la vida de la alfombra
                                </p>
                                </div>
                            </div>
                            </div>   
                        </div>

                        <div className="col-md-4">
                            <div className="card-container">
                            <div className="card-flip">
                                <div className="card-front">
                                <img src="../img/cobertor.jpeg" alt="Lavado de cubrecamas" className="card-image"  />
                                <br/>
                                <h4>¿Cómo debe lavarse un cubrecama?</h4>
                                
                                </div>
                                <div className="card-back">
                                <p>
                                    Pre-remojo si tiene manchas <br />
                                    Utilizar solo agua fría o tibia <br />
                                    Uso de detergente normal <br />
                                    Secar en la posición de calor más baja
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer/> 
        </div>
    );
};

export default Home;
