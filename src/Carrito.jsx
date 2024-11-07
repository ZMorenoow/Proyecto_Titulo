import React, { useState } from 'react';
import "./CSS/Carrito.css"; // Agrega tu archivo CSS aquí

const Carrito = () => {
  // Estado para almacenar los elementos del carrito
  const [carrito, setCarrito] = useState([]);

  // Función para agregar un servicio al carrito
  const agregarAlCarrito = (servicio) => {
    setCarrito((prevCarrito) => [...prevCarrito, servicio]);
  };

  // Función para eliminar un servicio del carrito
  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  // Función para calcular el total del carrito (simulado)
  const calcularTotal = () => {
    // Aquí puedes sumar los precios de los servicios en el carrito
    return carrito.length * 1000; // Reemplaza este valor con la lógica real
  };

  return (
    <div className="pagina-carrito">
      <h2>Carrito de Compras</h2>

      {/* Mostrar los servicios en el carrito */}
      {carrito.length > 0 ? (
        <div className="carrito-contenido">
          {carrito.map((servicio, index) => (
            <div key={index} className="servicio-item">
              <h4>{servicio.nombre}</h4>
              {/* Aquí puedes agregar más detalles del servicio si es necesario */}
              <button onClick={() => eliminarDelCarrito(index)}>Eliminar</button>
            </div>
          ))}
        </div>
      ) : (
        <p>El carrito está vacío.</p>
      )}

      {/* Mostrar total del carrito */}
      {carrito.length > 0 && (
        <div className="carrito-total">
          <p>Total: ${calcularTotal()}</p>
          <button>Proceder al Pago</button>
        </div>
      )}

      {/* Botón para agregar un servicio al carrito (Ejemplo) */}
      <div>
        <button onClick={() => agregarAlCarrito({ nombre: 'Limpieza de alfombras' })}>
          Agregar Limpieza de Alfombras al Carrito
        </button>
      </div>
    </div>
  );
};

export default Carrito;
