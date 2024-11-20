import React from "react";
import './CSS/ServiciosAdm.css';

const GestionarServicios = () => {
  return (
    <div className="gestion-servicios-container">
      <header>
        <h1>Gestionar Servicios</h1>
      </header>

      <main>
        {/* Formulario para agregar servicios */}
        <div className="form-container">
          <input
            type="text"
            placeholder="Nombre del servicio"
          />
          <input
            type="number"
            placeholder="Precio base del servicio"
          />
          <button>Agregar Servicio</button>
        </div>

        {/* Lista de servicios */}
        <div className="servicios-list">
          <div className="servicio-item">
            <span>Nombre del Servicio</span>
            <span>Precio</span>
            <button>Editar</button>
            <button>Eliminar</button>
          </div>
          <div className="servicio-item">
            <span>Otro Servicio</span>
            <span>Precio</span>
            <button>Editar</button>
            <button>Eliminar</button>
          </div>
          {/* Agrega más elementos aquí */}
        </div>
      </main>
    </div>
  );
};

export default GestionarServicios;
