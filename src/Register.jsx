import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    correo_cliente: '',
    contraseña_cliente: '',
    direccion_cliente: '',
    numero_cliente: '',
    id_rol: 2 // Cambia según sea necesario
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
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Verifica si la respuesta es exitosa
      if (response.ok) {
        alert('¡Registro exitoso!'); // Alerta de éxito
      } else {
        alert(`Error: ${data.error}`); // Alerta de error con el mensaje recibido
      }
    } catch (error) {
      alert('Error al realizar la solicitud.'); // Alerta en caso de fallo en la conexión
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nombre_cliente" placeholder="Nombre" onChange={handleChange} required />
      <input type="email" name="correo_cliente" placeholder="Correo" onChange={handleChange} required />
      <input type="password" name="contraseña_cliente" placeholder="Contraseña" onChange={handleChange} required />
      <input type="text" name="direccion_cliente" placeholder="Dirección" onChange={handleChange} required />
      <input type="tel" name="numero_cliente" placeholder="Número" onChange={handleChange} required />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
