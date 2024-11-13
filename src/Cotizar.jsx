import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  
import './CSS/Cotizar.css';


const CotizacionForm = () => {
  const location = useLocation();  
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const servicioSeleccionado = location.state?.servicio || { nombre: 'Servicio no especificado', id_servicio: null };
  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(false);

  const [cotizacion, setCotizacion] = useState({
    id_servicio: servicioSeleccionado.id_servicio||'',
    cantidad: '',
    medidas: '',
    material: '',
    estado_producto: 'Bueno',
    antiguedad: 'Menos de 1 año',
    especificaciones_adicionales: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCotizacion({
      ...cotizacion,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar campos requeridos
    if (
      !cotizacion.cantidad.trim() ||
      !cotizacion.medidas.trim() ||
      !cotizacion.material.trim() ||
      !cotizacion.estado_producto.trim() ||
      !cotizacion.antiguedad.trim()
    ) {
      setError('Por favor, complete todos los campos obligatorios.');
      return;
    }
    setError(''); 

   
    console.log("Datos de cotización:", cotizacion); // mostrar datos que se enviarán

    fetch('http://localhost:3000/cotizaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cotizacion),  
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Cotización enviada correctamente:', data);
    })
    .catch((error) => {
        console.error('Error al enviar la cotización:', error);
    });
};
  return (
    <div className="cotizacion-form">
      <h2>Formulario de Cotización</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Servicio: {servicioSeleccionado.nombre_servicio}
        </label>
        <br />

        
          <label htmlFor="cantidad">Cantidad</label>
          
          <input
            type="number"
            id="cantidad" 
            name="cantidad"
            value={cotizacion.cantidad}
            onChange={handleInputChange}
            placeholder="Agregar cantidad de productos"
            required
          />
          <br />

          <label htmlFor="medidas">Medidas</label>
          <input
            type="text"
            id="medidas" 
            name="medidas"
            value={cotizacion.medidas}
            onChange={handleInputChange}
            placeholder="Agregar medidas, sepárelos por ',' "
            required
          />
          <br />

          <label htmlFor="material">Material</label>
          <input
            type="text"
            id="material" 
            name="material"
            value={cotizacion.material}
            onChange={handleInputChange}
             placeholder="Agregar materiales, sepárelos por ',' "
             required
          />
          <br />

          <label htmlFor="estado_producto">Estado del Producto</label>
          <select
            id="estado_producto" 
            name="estado_producto"
            value={cotizacion.estado_producto}
            onChange={handleInputChange}
            required
          >
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
          <br />

          <label htmlFor="antiguedad">Antigüedad</label>
          <select
            id="antiguedad" 
            name="antiguedad"
            value={cotizacion.antiguedad}
            onChange={handleInputChange}
            required
          >
            <option value="Menos de 1 año">Menos de 1 año</option>
            <option value="1-3 años">1-3 años</option>
            <option value="Más de 3 años">Más de 3 años</option>
          </select>
          <br />
          <button
          type="button"
          onClick={() => setMostrarEspecificaciones(!mostrarEspecificaciones)}
        >
          {mostrarEspecificaciones ? 'Ocultar Especificaciones' : 'Agregar Especificaciones'}
        </button>
        <br />
        {mostrarEspecificaciones && (
          <>

          <label htmlFor="especificaciones_adicionales">Especificaciones Adicionales (Opcional)</label>
          <textarea
            id="especificaciones_adicionales" 
            name="especificaciones_adicionales"
            value={cotizacion.especificaciones_adicionales}
            onChange={handleInputChange}
            placeholder="Agregar detalles adicionales sobre el producto"
          />
          <br />
          </>
        )}

          <button type="submit">Enviar Cotización</button>
          <br />
          <button type="submit">Agregar a la bolsa de compras</button>
      </form>
      

        
    </div>
  );
};

export default CotizacionForm;
