import React, { useState } from "react";


const GestionarReservas = () => {
  const reservas = [
    { id: 1, cliente: "Juan Pérez", servicio: "Limpieza de alfombra", fecha: "2024-11-20", estado: "Confirmada" },
    { id: 2, cliente: "Ana González", servicio: "Limpieza de piso", fecha: "2024-11-22", estado: "Pendiente" },
    { id: 3, cliente: "Luis Martínez", servicio: "Limpieza de oficinas", fecha: "2024-11-25", estado: "Cancelada" },
  ];

  return (
    <div className="gestionar-reservas-container">
      <header>
        <h1>Gestionar Reservas</h1>
      </header>

      <main>
        <div className="reservas-list">
          {reservas.map((reserva) => (
            <div className="reserva-item" key={reserva.id}>
              <div className="reserva-info">
                <span className="cliente">{reserva.cliente}</span>
                <span className="servicio">{reserva.servicio}</span>
                <span className="fecha">{reserva.fecha}</span>
                <span className="estado">{reserva.estado}</span>
              </div>
              <div className="actions">
                <button className="edit">Editar</button>
                <button className="cancel">Cancelar</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GestionarReservas;
