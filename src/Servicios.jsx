import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext.jsx"; 
import "./CSS/Servicios.css";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();
  const { rol, isAuthenticated } = useAuth(); // Accede al rol e información de autenticación del usuario

  useEffect(() => {
    // Obtener servicios de la API
    fetch("http://localhost:3000/servicios")
      .then((response) => response.json())
      .then((data) => {
        setServicios(data);
      })
      .catch((error) => console.error("Error al obtener los servicios:", error));
  }, []);

  const contratar = (servicio) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para contratar un servicio.");
      navigate("/login"); // Redirige a la página de inicio de sesión
      return;
    }
    navigate("/contratar", { state: { servicio } });
  };

  const cotizar = (servicio) => {
    navigate("/cotizar", { state: { servicio } }); // Redirigir a la página de cotización
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
              {/* Mostrar el botón de Cotizar solo para usuarios no autenticados */}
              {!isAuthenticated && (
                <button onClick={() => cotizar(servicio)} className="btn-agregar">
                  Cotizar
                </button>
              )}
              <br />
              {/* Mostrar el botón de Contratar solo si está autenticado y el rol no es Trabajador o Administrador */}
              {isAuthenticated && rol !== "Trabajador" && rol !== "Administrador" && (
                <>
                  <button onClick={() => contratar(servicio)} className="btn-agregar">
                    Contratar
                  </button>
                  <button onClick={() => cotizar(servicio)} className="btn-agregar">
                    Cotizar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;