import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    correo_cliente: '',
    contraseña_cliente: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Verifica si la respuesta es exitosa
      if (response.ok) {
        alert('¡Inicio de sesión exitoso!'); // Alerta de éxito
        // Aquí podrías redirigir al usuario a otra página si lo deseas
      } else {
        alert(`Error: ${data.error}`); // Alerta de error con el mensaje recibido
      }
    } catch (error) {
      alert('Error al realizar la solicitud.'); // Alerta en caso de fallo en la conexión
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="correo_cliente" placeholder="Correo" onChange={handleChange} required />
      <input type="password" name="contraseña_cliente" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;