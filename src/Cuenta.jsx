import React, { useState, useEffect } from 'react';
import  './CSS/cuenta.css';

function PerfilUsuario() {
  // Estado para almacenar los datos del usuario y los servicios contratados
  const [usuario, setUsuario] = useState(null);
  const [servicios, setServicios] = useState([]);

  // Función para obtener los datos del usuario y sus servicios
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch('/api/perfil');
        const data = await response.json();
        setUsuario(data.usuario);
        setServicios(data.servicios);
      } catch (error) {
        console.error('Error al cargar los datos del perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  // Si los datos aún no se cargan, mostrar un mensaje de carga
  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h1>Mi Perfil</h1>

      <div id="datos-personales">
        <h2>Datos Personales</h2>
        <p><strong>Nombre:</strong> {usuario.nombre}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
        <p><strong>Teléfono:</strong> {usuario.telefono}</p>
        <p><strong>Dirección:</strong> {usuario.direccion}</p>
      </div>

      <div id="servicios-contratados">
        <h2>Servicios Contratados</h2>
        <ul>
          {servicios.map((servicio) => (
            <li key={servicio.id_servicio}>
              <strong>{servicio.nombre_servicio}</strong><br />
              Descripción: {servicio.descripcion}<br />
              Fecha de Contratación: {new Date(servicio.fecha_contratacion).toLocaleDateString()}<br />
              Estado: {servicio.estado_servicio}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PerfilUsuario;
