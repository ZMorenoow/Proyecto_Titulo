import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./CSS/Cotizar.css"; // Asegúrate de enlazar tu archivo CSS


const Cotiza = () => {
  const location = useLocation(); // Obtener el estado de la navegación
  const servicioSeleccionado = location.state?.servicio; // Obtener el servicio desde el estado pasado
  const [mensajeCarrito, setMensajeCarrito] = useState(''); // Agregado estado para el mensaje
  
  

  // Lista de servicios con sus campos asociados
  const servicios = [
    {
      nombre: 'Limpieza de pisos',
      campos: [
        { label: 'Cantidad', type: 'number', min: 1 },
        { label: 'Medidas del piso (Largo x Ancho)', type: 'text', placeholder: 'Ej. 100x50 cm' },
        { label: 'Material', type: 'select', opciones: ['Cerámica', 'Madera', 'Vinilo', 'Concreto', 'Flotante'] },
        { label: 'Estado', type: 'select', opciones: ['Bueno', 'Regular', 'Malo'] },
        { label: 'Antigüedad', type: 'select', opciones: ['Menos de 1 año', '1-3 años', 'Más de 3 años'] },
        { label: 'Especificaciones adicionales', type: 'textarea', placeholder: 'Comentarios adicionales' },
      ],
    },
    {
      nombre: 'Limpieza de alfombras',
      campos: [
        { label: 'Cantidad', type: 'number', min: 1 },
        { label: 'Medidas', type: 'text', placeholder: 'Ej. 200x300 cm' },
        { label: 'Material', type: 'select', opciones: ['Lana', 'Sintética', 'Algodón', 'Seda'] },
        { label: 'Estado', type: 'select', opciones: ['Bueno', 'Regular', 'Malo'] },
        { label: 'Antigüedad', type: 'select', opciones: ['Menos de 1 año', '1-3 años', 'Más de 3 años'] },
        { label: 'Especificaciones adicionales', type: 'textarea', placeholder: 'Comentarios adicionales' },
      ],
    },
    {
      nombre: 'Limpieza de tapices',
      campos: [
        { label: 'Cantidad', type: 'number', min: 1 },    
        { label: 'Medidas', type: 'text', placeholder: 'Ej. 150x200 cm' },
        { label: 'Material', type: 'text', opciones: ['Algodon', 'Seda', 'Lana', 'Lino', 'Sintético', 'Poliéster', 'Nylon'] },
        { label: 'Estado', type: 'select', opciones: ['Bueno', 'Regular', 'Malo'] },
        { label: 'Antigüedad', type: 'select', opciones: ['Menos de 1 año', '1-3 años', 'Más de 3 años'] },
        { label: 'Especificaciones adicionales', type: 'textarea', placeholder: 'Comentarios adicionales' },
      ],
    },
    {
      nombre: 'Limpieza de sofás',
      campos: [
        { label: 'Cantidad', type: 'number', min: 1 },
        { label: 'Material', type: 'text', placeholder: 'Ej. Tela, Cuero' },
        { label: 'Medidas', type: 'text', placeholder: 'Ej. 150x200 cm' },
        { label: 'Estado', type: 'select', opciones: ['Bueno', 'Regular', 'Malo'] },
        { label: 'Antigüedad', type: 'select', opciones: ['Menos de 1 año', '1-3 años', 'Más de 3 años'] },
        { label: 'Limpieza extra', type: 'checkbox', opciones: ['Cojines', 'Cobertores'] },
        { label: 'Especificaciones adicionales', type: 'textarea', placeholder: 'Comentarios adicionales' },
      ],
    },
    {
      nombre: 'Limpieza de sillas',
      campos: [
        { label: 'Cantidad', type: 'number', min: 1 },
        { label: 'Material', type: 'text', placeholder: 'Ej. Tela, Cuero' },
        { label: 'Medidas', type: 'text', placeholder: 'Ej. 40x40 cm' },
        { label: 'Estado', type: 'select', opciones: ['Bueno', 'Regular', 'Malo'] },
        { label: 'Antigüedad', type: 'select', opciones: ['Menos de 1 año', '1-3 años', 'Más de 3 años'] },
        { label: 'Especificaciones adicionales', type: 'textarea', placeholder: 'Comentarios adicionales' },
      ],
    },
    {
      nombre: 'Limpieza de cortinas',
      campos: [
        { label: 'Cantidad', type: 'number', min: 1 },
        { label: 'Material', type: 'text', placeholder: 'Ej. Tela, Lino' },
        { label: 'Medidas', type: 'text', placeholder: 'Ej. 150x250' },
        { label: 'Estado', type: 'select', opciones: ['Bueno', 'Regular', 'Malo'] },
        { label: 'Antigüedad', type: 'select', opciones: ['Menos de 1 año', '1-3 años', 'Más de 3 años'] },
        { label: 'Especificaciones adicionales', type: 'textarea' },
      ],
    },
    {
      nombre: 'Limpieza de ropa de cama',
      campos: [
        { label: 'Cantidad', type: 'number', min: 1 },
        { label: 'Material', type: 'text', placeholder: 'Ej. Algodón, Lino' },
        { label: 'Medidas', type: 'text', placeholder: 'Ej. Cama King, Cama Queen' },
        { label: 'Estado', type: 'select', opciones: ['Bueno', 'Regular', 'Malo'] },
        { label: 'Antigüedad', type: 'select', opciones: ['Menos de 1 año', '1-3 años', 'Más de 3 años'] },
        { label: 'Especificaciones adicionales', type: 'textarea' },
      ],
    },
  ];

  // Buscar el servicio seleccionado en la lista
  const servicio = servicios.find((s) => s.nombre === servicioSeleccionado?.nombre);

  if (!servicio) {
    return <div>Servicio no disponible.</div>;
  }

  // Estado para manejar los valores del formulario
  const [formValues, setFormValues] = useState(
    servicio.campos.reduce((acc, campo) => {
      acc[campo.label] = '';
      return acc;
    }, {})
  );

  // Manejar cambios en los campos del formulario
  const handleChange = (e, label) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  // Enviar cotización y obtener valor de la IA (simulado aquí)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulamos la obtención de un valor por parte de la IA
    const valorIA = 1000; // Esto debería ser reemplazado por el valor real que entrega la IA

    alert(`Cotización para ${servicio.nombre}: $${valorIA}`);
  };

  // Función para agregar al carrito
  const agregarAlCarrito = () => {
    const servicioCarrito = { nombre: servicio.nombre, detalles: formValues };
    setCarrito((prevCarrito) => [...prevCarrito, servicioCarrito]);
    setMensajeCarrito(`El servicio de ${servicio.nombre} ha sido agregado al carrito.`);
  };

  return (
    <div className="pagina-cotizacion">
      <h2>Cotización para: {servicio.nombre}</h2>

      {/* Renderizar los campos del servicio seleccionado */}
      <form onSubmit={handleSubmit}>
        {servicio.campos.map((campo, index) => (
          <div key={index} className="campo">
            <label>{campo.label}</label>
            {campo.type === "select" ? (
              <select
                value={formValues[campo.label]}
                onChange={(e) => handleChange(e, campo.label)}
              >
                {campo.opciones?.map((opcion, i) => (
                  <option key={i} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : campo.type === "checkbox" ? (
              campo.opciones?.map((opcion, i) => (
                <div key={i}>
                  <input
                    type="checkbox"
                    id={opcion}
                    value={opcion}
                    onChange={(e) => handleChange(e, campo.label)}
                  />
                  <label htmlFor={opcion}>{opcion}</label>
                </div>
              ))
            ) : campo.type === "textarea" ? (
              <textarea
                placeholder={campo.placeholder}
                value={formValues[campo.label]}
                onChange={(e) => handleChange(e, campo.label)}
              />
            ) : (
              <input
                type={campo.type}
                placeholder={campo.placeholder}
                min={campo.min}
                value={formValues[campo.label]}
                onChange={(e) => handleChange(e, campo.label)}
              />
            )}
          </div>
        ))}
        
        {/* Mostrar el valor de la cotización de la IA si se ha enviado */}
        <button type="submit">Enviar Cotización</button>
      </form>

      {/* Mostrar la cotización después de enviar */}
      <div className="resultado-cotizacion">
        <h3>Resultado de la cotización:</h3>
        <p>Valor estimado por la IA: $1000</p> {/* Aquí debes insertar el valor que se obtiene de la IA */}
        {/* Botón para agregar al carrito */}
      <button onClick={agregarAlCarrito}>Agregar al carrito</button>

      {/* Mostrar mensaje si el servicio ha sido agregado al carrito */}
      {mensajeCarrito && <p>{mensajeCarrito}</p>}
      </div>
    </div>
  );
};

export default Cotiza;