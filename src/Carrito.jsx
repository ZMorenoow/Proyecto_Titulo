import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './utils/AuthContext.jsx'; // Importa el contexto de autenticación
import "./CSS/Carrito.css";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const { isAuthenticated } = useAuth(); // Obtén el estado de autenticación del contexto
  const navigate = useNavigate();

  // Redirigir si el usuario no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirigir al inicio de sesión si no está autenticado
    }
  }, [isAuthenticated, navigate]);

  const agregarAlCarrito = (servicio) => {
    setCarrito((prevCarrito) => [...prevCarrito, servicio]);
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const calcularTotal = () => {
    return carrito.length * 1000; // Lógica de ejemplo, puedes reemplazar con la lógica real
  };

  if (!isAuthenticated) return null; // No renderizar el carrito si no está autenticado

  return (
    <div className="pagina-carrito">
      <h2>Carrito de Compras</h2>

      {carrito.length > 0 ? (
        <div className="carrito-contenido">
          {carrito.map((servicio, index) => (
            <div key={index} className="servicio-item">
              <h4>{servicio.nombre}</h4>
              <button onClick={() => eliminarDelCarrito(index)}>Eliminar</button>
            </div>
          ))}
        </div>
      ) : (
        <p>El carrito está vacío.</p>
      )}

      {carrito.length > 0 && (
        <div className="carrito-total">
          <p>Total: ${calcularTotal()}</p>
          <button>Proceder al Pago</button>
        </div>
      )}

      <div>
        <button onClick={() => agregarAlCarrito({ nombre: 'Limpieza de alfombras' })}>
          Agregar Limpieza de Alfombras al Carrito
        </button>
      </div>
    </div>
  );
};

export default Carrito;