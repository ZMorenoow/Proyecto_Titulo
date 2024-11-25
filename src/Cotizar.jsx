import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/Cotizar.css';

const CotizacionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [valorCotizacion, setValorCotizacion] = useState(null); // Inicializar como null
  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(false);
  const [idCotizacion, setIdCotizacion] = useState(null); // Para almacenar el ID de la última cotización

  const [cotizacion, setCotizacion] = useState({
    id_servicio: location.state?.servicio?.id_servicio || '',
    cantidad: '',
    medidas: '',
    material: '',
    estado_producto: 'Bueno',
    antiguedad: 'Menos de 1 año',
    especificaciones_adicionales: ''
  });

  const servicioSeleccionado = location.state?.servicio || { nombre_servicio: 'No especificado', id_servicio: null };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCotizacion({ ...cotizacion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { cantidad, medidas, material } = cotizacion;

    if (!cantidad.trim() || !medidas.trim() || !material.trim()) {
      setError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    setError('');
    try {
      const response = await fetch('http://localhost:3000/cotizaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cotizacion),
      });

      if (!response.ok) throw new Error('Error en el servidor');

      const data = await response.json();
      console.log('Cotización enviada correctamente:', data);
      setValorCotizacion(data.precioFinal);
      setIdCotizacion(data.idCotizacion);
    } catch (error) {
      console.error('Error al enviar la cotización:', error);
      setError('Hubo un problema al enviar la cotización. Intenta de nuevo.');
    }
  };

  const handleAddToCart = async () => {
    if (!idCotizacion) {
      setError('No hay una cotización válida para agregar al carrito.');
      return;
    }
    setError('');
    try {
      const response = await fetch('http://localhost:3000/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id_cotizacion: idCotizacion }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar al carrito');
      }

      const data = await response.json();
      alert('Cotización agregada al carrito correctamente');
      navigate('/cart');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      setError('Hubo un problema al agregar la cotización al carrito.');
    }
  };

  return (
    <div className="cotizacion-form__container">
      <h2 className='form-coti'>Formulario de Cotización</h2>
      <form className="cotizacion-form__form" onSubmit={handleSubmit}>
        <label>Servicio: {servicioSeleccionado.nombre_servicio}</label>
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
      </form>

      {error && <p className="cotizacion-form__error">{error}</p>}

      {valorCotizacion !== null && (
        <p className="cotizacion-form__resultado">
          Valor calculado: <strong>${valorCotizacion}</strong>
        </p>
      )}
      {idCotizacion && (
        <button onClick={handleAddToCart}>Agregar al Carrito</button>
      )}
    </div>
  );
};

export default CotizacionForm;
