import React from 'react';
import './CSS/Contacto.css'; // Asegúrate de crear este archivo CSS

const Contacto = () => {
  return (
    
    <div className="contacto-container">
      
      <h2>Contacto</h2>
      
      <div className="social-media">

      <div className="contact-form">
        <h3>  Envíanos un correo electrónico:</h3>
        

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Aquí puedes manejar el envío del formulario
            alert('Correo enviado');
          }}
        >
          <input
            type="email"
            placeholder="Tu correo electrónico"
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
