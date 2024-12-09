import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/Cotizar.css';
import "./CSS/modal.css";

const ContratacionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [valorContratacion, setValorContratacion] = useState(null);
  const [valorConIva, setValorConIva] = useState(null);
  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(false);
  const [idContratacion, setIdContratacion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [contratacion, setContratacion] = useState({
    id_servicio: location.state?.servicio?.id_servicio || '',
    cantidad: '',
    medidas: '',
    material: '',
    estado_producto: 'Bueno',
    antiguedad: 'Menos de 1 año',
    especificaciones_adicionales: ''
  });

  const servicioSeleccionado = location.state?.servicio || {
    nombre_servicio: 'No especificado',
    id_servicio: null
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContratacion({ ...contratacion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { cantidad, medidas, material } = contratacion;

    if (!cantidad.trim() || !medidas.trim() || !material.trim()) {
      setError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    setError('');
    try {
      const response = await fetch('http://localhost:3000/contrataciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contratacion)
      });

      if (!response.ok) throw new Error('Error en el servidor');

      const data = await response.json();
      console.log('Contratación enviada correctamente:', data);

      const precioFinal = data.precioFinal;
      const iva = precioFinal * 0.19;
      const totalConIva = precioFinal + iva;

      setValorContratacion(precioFinal);
      setValorConIva(totalConIva);
      setIdContratacion(data.idContratacion);
    } catch (error) {
      console.error('Error al enviar la contratación:', error);
      setError('Hubo un problema al enviar la contratación. Intenta de nuevo.');
    }
  };

  const handleAddToCart = async () => {
    if (!idContratacion) {
      setError('No hay una contratación válida para agregar al carrito.');
      return;
    }
    setError('');
    try {
      const response = await fetch('http://localhost:3000/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id_contratacion: idContratacion })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar al carrito');
      }

      const data = await response.json();
      console.log('Contratación agregada al carrito:', data);

      setModalOpen(true);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      setError('Hubo un problema al agregar la contratación al carrito.');
    }
  };

  const handleRedirectToCart = () => {
    setModalOpen(false);
    navigate('/servicios');
  };

  return (
    <div className="cotizacion-form__container">
      <h2 className="form-coti">Formulario de Contratación</h2>
      <form className="cotizacion-form__form" onSubmit={handleSubmit}>
        <label>Servicio: {servicioSeleccionado.nombre_servicio}</label>
        <br />

        <label htmlFor="cantidad">Cantidad</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          value={contratacion.cantidad}
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
          value={contratacion.medidas}
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
          value={contratacion.material}
          onChange={handleInputChange}
          placeholder="Agregar materiales, sepárelos por ',' "
          required
        />
        <br />

        <label htmlFor="estado_producto">Estado del Producto</label>
        <select
          id="estado_producto"
          name="estado_producto"
          value={contratacion.estado_producto}
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
          value={contratacion.antiguedad}
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
            <label htmlFor="especificaciones_adicionales">
              Especificaciones Adicionales (Opcional)
            </label>
            <textarea
              id="especificaciones_adicionales"
              name="especificaciones_adicionales"
              value={contratacion.especificaciones_adicionales}
              onChange={handleInputChange}
              placeholder="Agregar detalles adicionales sobre el producto"
            />
            <br />
          </>
        )}

        <button type="submit">Enviar Contratación</button>
      </form>

      {error && <p className="cotizacion-form__error">{error}</p>}

      {valorContratacion !== null && valorConIva !== null && (
        <div className="cotizacion-form__resultado">
          <p>
            Valor Neto: <strong>${valorContratacion}</strong>
          </p>
          <p>
            IVA (19%): <strong>${Math.round(valorContratacion * 0.19)}</strong>
          </p>
          <p>
            Valor Total (con IVA): <strong>${Math.round(valorConIva)}</strong>
          </p>
        </div>
      )}
      {idContratacion && (
        <div>
          <button onClick={handleAddToCart}>Agregar al Carrito</button>
        </div>
      )}

      {modalOpen && (
        <div className="modal__overlay">
          <div className="modal__content">
            <img
              src="/img/bolsacompra.png"
              alt="Éxito"
              className="modal__icon"
            />
            <p>Se ha añadido al carrito correctamente</p>
            <button onClick={handleRedirectToCart}>Continuar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContratacionForm;
