import React from "react";
import { useNavigate } from 'react-router-dom'; 
import './CSS/HomeAdm.css'

const AdminHome = () => {
  const navigate = useNavigate(); 
  const redirectToPage = (page) => {
    navigate(page);
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Panel de Administración</h1>
      </header>

      <main>
        <div className="card-container">
          {/* Tarjeta Editar Servicios */}
          <div className="card" onClick={() => redirectToPage('/serviciosAdm')}>
            <h2>Editar Servicios</h2>
            <p>Administra los servicios que ofrecemos.</p>
          </div>

          {/* Tarjeta Gestionar Reservas */}
          <div className="card" onClick={() => redirectToPage('/reservasAdm')}>
            <h2>Gestionar Reservas</h2>
            <p>Consulta y administra las reservas realizadas.</p>
          </div>

          {/* Tarjeta Historial de Clientes */}
          <div className="card" onClick={() => redirectToPage('/clientesAdm')}>
            <h2>Historial de Clientes</h2>
            <p>Consulta y administra los registros de clientes.</p>
          </div>

          {/* Tarjeta Gestionar Trabajadores */}
          <div className="card" onClick={() => redirectToPage('/trabajadoresAdm')}>
            <h2>Gestionar Trabajadores</h2>
            <p>Administra el personal de limpieza.</p>
          </div>
        </div>
      </main>
    </div>
  
  );
}

export default AdminHome;
