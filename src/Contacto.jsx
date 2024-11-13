import React from 'react';
import './CSS/Contacto.css'; 

const Contacto = () => {
  return (
    
    <div className="contacto-container">
      
      <h2>Contacto</h2>
      <br />
      
      <div className="social-media">

      <div className="contact-form">
        <h3>  Envíanos un correo electrónico:</h3>
        <br />
        

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Correo enviado');
          }}
        >
          <select required>
              <option value="">Selecciona el tipo de mensaje</option>
              <option value="reclamo">Reclamo</option>
              <option value="soporte">Soporte</option>
              <option value="consulta">Consulta</option>
              <option value="sugerencia">Sugerencia</option>
              <option value="otro">Otro</option>
            </select>
          <input
            type="Asunto"
            placeholder="Asunto del mensaje"
            required
          />
          <textarea
            placeholder="Tu mensaje"
            required
          />
          <button type="submit">Enviar</button>
        </form>
        
        
      </div>
      <h3>O <br/><br/>
      Síguenos en nuestras redes sociales:</h3>
      
      <div className="iconos">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="./img/Instagram.jpg" alt="Instagram" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="./img/Facebook.jpg" alt="Facebook" />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <img src="./img/WhatsApp.jpg"  alt="WhatsApp" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
