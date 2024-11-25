import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext.jsx"; 
import "./CSS/Servicios.css";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();
  const { rol } = useAuth(); // Accede al rol del usuario desde el contexto

  useEffect(() => {
    // Obtener servicios de la API
    fetch("http://localhost:3000/servicios")
      .then((response) => response.json())
      .then((data) => {
        setServicios(data);
      })
      .catch((error) => console.error("Error al obtener los servicios:", error));
  }, []);

  const cotizar = (servicio) => {
    navigate("/cotiza", { state: { servicio } });
  };

  return (
    <div className="pagina-servicios">
      <br />
      <br />
      <br />
      <h2 className="titulo-serv">Servicios de Limpieza</h2>
      <br />
      <div className="lista-servicios">
        {servicios.map((servicio) => (
          <div key={servicio.id_servicio} className="servicio">
            <div className="services">
              <img
                src={`/${servicio.imagen_servicio}`}
                alt={servicio.nombre_servicio}
                className="servicio-imagen"
              />
              <h3>{servicio.nombre_servicio}</h3>
              <p>{servicio.descripcion_servicio}</p>
            </div>
            <div className="btn-container">
              {/* Condición para mostrar el botón solo si no es trabajador */}
              {rol !== "Trabajador" && rol !== "Administrador" && (
                <button onClick={() => cotizar(servicio)} className="btn-agregar">
                  Cotizar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
