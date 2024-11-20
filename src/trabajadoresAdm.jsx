import React, { useState } from "react";
import './CSS/TrabajadoresAdm.css';

const GestionarTrabajadores = () => {
  const trabajadores = [
    { id: 1, nombre: "Juan Pérez", estado: "Activo", tarea: "Limpieza de oficinas", horario: "9:00 AM - 5:00 PM" },
    { id: 2, nombre: "Ana González", estado: "Activo", tarea: "Supervisión de limpieza", horario: "8:00 AM - 4:00 PM" },
    { id: 3, nombre: "Luis Martínez", estado: "Inactivo", tarea: "Limpieza de baños", horario: "10:00 AM - 6:00 PM" },
  ];

  return (
    <div className="gestionar-trabajadores-container">
      <header>
        <h1>Gestionar Trabajadores</h1>
      </header>

      <main>
        <div className="trabajadores-list">
          {trabajadores.map((trabajador) => (
            <div className="trabajador-item" key={trabajador.id}>
              <div className="worker-info">
                <span className="worker-name">{trabajador.nombre}</span>
                <span className="worker-status">{trabajador.estado}</span>
              </div>
              <div className="task-assignments">
                <div>
                  <span>Tarea:</span>
                  <p>{trabajador.tarea}</p>
                </div>
                <div>
                  <span>Horario:</span>
                  <p>{trabajador.horario}</p>
                </div>
              </div>
              <div className="actions">
                <button className="edit">Editar</button>
                <button className="delete">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GestionarTrabajadores;