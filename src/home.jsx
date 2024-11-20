import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import './CSS/App.css';
import './CSS/Tarjeta.css';
import './CSS/Carrusel.css';
import './CSS/Navbar.css';
import './CSS/Home.css';
import Navbar from './Navbar';
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
            <Navbar visible={visible} /> {<Navbar/>}
            <br />
            <br />
            
            <main>
            <section className="bienvenida">
            <div className="contenido-bienvenida" >
                <div className="texto-bienvenida">
                
                <h1>Bienvenido a W&W</h1>
                <h2>Descubre la excelencia en limpieza</h2>
                <p>Brindamos soluciones de limpieza personalizadas para cada uno de tus espacios.</p>
                <img className= " imagen-bienvenida"src="../img/fondohome.png" alt="Imagen de limpieza"></img>
                </div>
            </div>
            </section>
            <br />
            
                <section className="seccion-titulo text-center py-5">
                    <div className="container-1">
                        <h1 className="display-4 fw-bold">Limpieza de Pisos, Espacios Amplios, Supermercados y Estacionamientos</h1>
                    </div>
                </section>
                <br/>
                <h2 className="titulo-servicios">Conoce nuestros servicios</h2>
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
                                <Link className="img-servicio" to="/Servicios">
                                    <img src="../img/cotizar.png"alt="Cotizar" className="imagen-paso" />
                                </Link>           
                                <h3>Cotizar</h3>
                                <br/>
                                <p>Ingresa los detalles de tu espacio y obtén un presupuesto rápido y fácil.</p>
                               
                            </div>
                            <div className="paso">                            
                                    <img src="../img/reserva.png"alt="Reservar" className="imagen-paso" />     
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

                {/* Tarjetas de recomendación*/ }
                <section className="text-center py-5">
                    <div className="container-3">
                    <h2 className="titulo-recomendaciones">Recomendaciones</h2>
                        <br/>
                        <div className="row">
                        <div className="col-md-4"> 
                            <div className="card-reco">
                            <div className="card-flip">
                                <div className="card-front">
                                <img src="../img/vacuolavadora.png" alt="Servicio de lavado de espacios amplios" className="card-image" />
                                <br/> 
                                <h4>¿Por qué debería contratar un servicio de lavado de espacios amplios?</h4>
                                </div>
                                <div className="card-back">
                                    <div>
                                        <h5>Eficiencia y calidad garantizada</h5>
                                        <p>Usamos equipos de última generación para una limpieza rápida y profunda, sin interrumpir tu productividad.</p>
                                        <h5>Mejora de la imagen y la seguridad</h5> 
                                        <p>Una limpieza impecable mejora la apariencia y previene accidentes, creando un ambiente seguro y acogedor.</p>
                                        <h5>Ahorro del tiempo y recursos</h5> 
                                        <p>Deja la limpieza en manos de profesionales y ahorra tiempo y recursos, permitiendo a tus empleados enfocarse en tareas clave.</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-reco">
                            <div className="card-flip">
                                <div className="card-front">
                                <img src="../img/alfombra_reco.jpeg" alt="Limpieza de alfombras" className="card-image"  />
                                <br/>
                                <h4>¿Por qué lavar las alfombras?</h4>
                                
                                </div>
                                <div className="card-back">
                                    <div>
                                        <h5>Mejora la Higiene</h5>
                                        <p>Elimina suciedad, polvo y ácaros.</p>
                                        <h5>Elimina Olores</h5>
                                        <p>Elimina olores desagradables y no deseados.</p>
                                        <h5>Protege la Salud</h5>
                                        <p>Reduce riesgos para personas con alergias.</p>
                                        <h5>Mejora la Apariencia</h5>
                                        <p>Alfombras limpias hacen que la habitación luzca ordenada.</p>
                                        <h5>Prolonga la Vida</h5>
                                        <p>Limpieza regular mantiene la alfombra como nueva.</p>
                                    </div>
                                </div>
                            </div>
                            </div>   
                        </div>

                        <div className="col-md-4">
                            <div className="card-reco">
                            <div className="card-flip">
                                <div className="card-front">
                                <img src="../img/cobertor.jpeg" alt="Lavado de cubrecamas" className="card-image"  />
                                <br/>
                                <h4>¿Cómo debe lavarse un cubrecama?</h4>
                                
                                </div>
                                <div className="card-back">
                                    <div>
                                        <h5>Pre-remojo si es necesario</h5>
                                        <p>Si la colcha tiene manchas, ponla en remojo en agua fría o tibia con un detergente suave durante una hora. Luego, lávela normal.</p>
                                        <h5>Lavado Normal</h5>
                                        <p>Lave con agua fría o tibia usando un detergente normal sin lejía ni suavizante.</p>
                                        <h5>Secado</h5>
                                        <p>Sécala a baja temperatura y asegure que esté completamente seca antes de guardarla.</p>
                                        <h5>Limpieza Regular</h5>
                                        <p>Lave su ropa de cama regularmente para mantenerla limpia y saludable, eliminando ácaros y alérgenos.</p>
                                    </div>
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
