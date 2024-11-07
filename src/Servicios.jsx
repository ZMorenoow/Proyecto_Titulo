import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./CSS/Servicios.css"; // Asegúrate de enlazar tu archivo CSS
import imgPisos from "../img/Pisos.png";
import imgAlfombras from "../img/alfombra.jpg";
import imgTapices from "../img/tapiz.jpg";
import imgSofas from "../img/sillones.png";
import imgSillas from "../img/sillas.png";
import imgRopa_cama from "../img/ropa_cama.png";
import imgCortinas from "../img/cortinas_variedad.jpg";

// Datos de servicios
const serviciosData = [
  {
    id: 1,
    nombre: "Limpieza de pisos",
    descripcion: "Limpieza profunda de pisos para residencias y oficinas.",
    imagen: imgPisos
  },
  {
    id: 2,
    nombre: "Limpieza de alfombras",
    descripcion: "Servicio especializado en limpieza de alfombras de todos los tamaños.",
    imagen: imgAlfombras
  },
  {
    id: 3,
    nombre: "Limpieza de tapices",
    descripcion: "Lavado y desinfección de tapices de muebles y autos.",
    imagen: imgTapices
  },
  {
    id: 4,
    nombre: "Limpieza de sofás",
    descripcion: "Limpieza de sillones, de una o varias piezas.",
    imagen: imgSofas
  },
  {
    id: 5,
    nombre: "Limpieza de sillas",
    descripcion: "Limpieza de sillas plásticas, de madera, entre otras.",
    imagen: imgSillas
  },
  {
    id: 6,
    nombre: "Limpieza de cortinas",
    descripcion: "Limpieza de diferentes tipos de cortinas.",
    imagen: imgCortinas
  },
  {
    id: 7,
    nombre: "Limpieza de ropa de cama",
    descripcion: "Limpieza de cobertores, sábanas, cubre colchón.",
    imagen: imgRopa_cama
  }
];

// Componente para cada servicio
const Servicio = ({ servicio, onCotizar }) => {
  const { id, nombre, descripcion, imagen } = servicio;

  return (
    <div className="servicio">
      <img src={imagen} alt={nombre} className="servicio-imagen" />
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <button onClick={() => onCotizar(servicio)} className="btn-agregar">
        Cotizar
      </button>
    </div>
  );
};

// Componente principal de la página
const PaginaServicios = () => {
  const [servicios] = useState(serviciosData);
  const navigate = useNavigate(); // Hook para redirigir
  const [carrito, setCarrito] = useState([]);

  const cotizar = (servicio) => {
    setCarrito([...carrito, servicio]);
    
    navigate('/cotiza', { state: { servicio } }); // Redirigir a la página de cotización con el servicio
  };

  return (
    <div className="pagina-servicios">
      <br /><br />
      <h2>Servicios de Limpieza</h2>
      <div className="lista-servicios">
        {servicios.map((servicio) => (
          <Servicio key={servicio.id} servicio={servicio} onCotizar={cotizar} />
        ))}
      </div>
      
    </div>
  );
};

export default PaginaServicios;
