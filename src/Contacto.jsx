import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Contacto.css';

const Contacto = () => {
  const [rating, setRating] = useState(0); // Calificación
  const [comment, setComment] = useState(''); // Comentario
  const [submitted, setSubmitted] = useState(false); // Estado de envío
  const [valoraciones, setValoraciones] = useState([]); // Estado de valoraciones
  const [asunto, setAsunto] = useState(''); // Asunto del formulario de contacto
  const [mensaje, setMensaje] = useState(''); // Mensaje del formulario de contacto
  const [categoria, setCategoria] = useState(''); // Categoría del formulario de contacto

  // Función para manejar la selección de calificación
  const handleRating = (rate) => {
    setRating(rate);
  };

  // Función para enviar una nueva valoración al backend
  const submitRating = async () => {
    const token = localStorage.getItem('token'); // Obtener el token desde el almacenamiento local

    try {
      const response = await axios.post(
        'http://localhost:3000/contacto/valoracion',
        {
          calificacion: rating,
          comentario: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token en los headers
          },
        }
      );

      // Manejar respuesta exitosa
      alert(`Gracias por tu calificación de ${rating} estrellas.`);
      setSubmitted(true);
      setComment('');
      setRating(0);
    } catch (error) {
      // Manejar errores
      console.error('Error al enviar la valoración:', error);
      alert('Error al conectar con el servidor o enviar la valoración.');
    }
  };

  // Obtener las valoraciones al cargar el componente
  useEffect(() => {
    const fetchValoraciones = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/contacto/obtener', {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de que el token esté presente
          },
        });
        setValoraciones(response.data.valoraciones);
      } catch (error) {
        console.error('Error al obtener las valoraciones:', error);
        alert('No se pudieron cargar las valoraciones.');
      }
    };
    fetchValoraciones();
  }, []);

  // Función para enviar un mensaje de contacto
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:3000/contacto/reclamo',
        {
          id_categoria: categoria,
          asunto: asunto,
          descripcion: mensaje,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Mensaje enviado exitosamente');
      setAsunto('');
      setMensaje('');
      setCategoria('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      alert('Error al enviar el mensaje. Inténtalo nuevamente.');
    }
  };

  return (
    <>
      <div className="contacto-container">
      <br />
        <h2>Contacto</h2>
        <br />

        <div className="social-media">
          <div className="contact-form">
            <h3>Envíanos un correo electrónico:</h3>
            <form onSubmit={handleContactSubmit}>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Selecciona el tipo de mensaje</option>
                <option value="1">Reclamo</option>
                <option value="2">Soporte</option>
                <option value="3">Consulta</option>
                <option value="4">Sugerencia</option>
                <option value="5">Otro</option>
              </select>
              <input
                className="asunto"
                type="text"
                placeholder="Asunto del mensaje"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
              />
              <textarea
                placeholder="Tu mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
          <h3>
            O <br />
            <br />
            Síguenos en nuestras redes sociales
          </h3>

          <div className="iconos">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="./img/Instagram.jpg" alt="Instagram" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="./img/Facebook.jpg" alt="Facebook" />
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <img src="./img/WhatsApp.jpg" alt="WhatsApp" />
            </a>
          </div>
        </div>
      </div>

      <div className="valoracion">
        <div className="rating-section">
          <h3>Califica nuestro servicio</h3>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                style={{
                  cursor: 'pointer',
                  fontSize: '2rem',
                  color: star <= rating ? '#FFD700' : '#CCCCCC',
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            className="comentario"
            placeholder="Escribe un comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: '100%', height: '80px', marginTop: '10px' }}
          />
          {!submitted && (
            <button className='calificacion'
              onClick={submitRating}
              disabled={!rating}
              style={{ marginTop: '10px', padding: '10px 20px' }}
            >
              Enviar Calificación
            </button>
          )}
          {submitted && <p>¡Gracias por tu retroalimentación!</p>}
        </div>

        <div className="valoracion">
          <h3>Valoraciones de clientes:</h3>
          {valoraciones.length > 0 ? (
            <ul className="valoraciones-lista">
              {valoraciones.map((valoracion) => (
                <li key={valoracion.id_valoracion} className="valoracion-item">
                  <div className="valoracion-header">
                    <strong>{valoracion.usuario}</strong>  <small>{new Date(valoracion.fecha).toLocaleString()}</small>
                  </div>
                  <div className="valoracion-comentario">
                    {valoracion.comentario ? <em>"{valoracion.comentario}"</em> : <em>Sin comentario</em>}
                  </div>
                  <div className="valoracion-estrellas">
                    {'★'.repeat(valoracion.calificacion)}
                    {'☆'.repeat(5 - valoracion.calificacion)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay valoraciones aún.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Contacto;