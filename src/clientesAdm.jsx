import React, { useState } from "react";


const GestionarClientes = () => {
  const clientes = [
    { id: 1, nombre: "Juan Pérez", email: "juan.perez@mail.com", telefono: "123-456-789", estado: "Activo" },
    { id: 2, nombre: "Ana González", email: "ana.gonzalez@mail.com", telefono: "987-654-321", estado: "Inactivo" },
    { id: 3, nombre: "Luis Martínez", email: "luis.martinez@mail.com", telefono: "555-123-456", estado: "Activo" },
  ];

  return (
    <div className="gestionar-clientes-container">
      <header>
        <h1>Gestionar Clientes</h1>
      </header>

      <main>
        <div className="clientes-list">
          {clientes.map((cliente) => (
            <div className="cliente-item" key={cliente.id}>
              <div className="cliente-info">
                <span className="cliente-nombre">{cliente.nombre}</span>
                <span className="cliente-email">{cliente.email}</span>
                <span className="cliente-telefono">{cliente.telefono}</span>
                <span className="cliente-estado">{cliente.estado}</span>
              </div>
              <div className="actions">
                <button className="edit">Editar</button>
                <button className="deactivate">Desactivar</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GestionarClientes;
