import React, { useState } from 'react';

const Cotizacion = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [servicio, setServicio] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un servidor
        console.log('Cotización solicitada:', { nombre, email, servicio, mensaje });
        // Resetea los campos del formulario
        setNombre('');
        setEmail('');
        setServicio('');
        setMensaje('');
    };

    return (
        <div className="cotizacion-container">
            <h2>Solicitar Cotización</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="servicio">Servicio:</label>
                    <select
                        id="servicio"
                        value={servicio}
                        onChange={(e) => setServicio(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un servicio</option>
                        <option value="Limpieza de Pisos">Limpieza de Pisos</option>
                        <option value="Limpieza de Alfombras">Limpieza de Alfombras</option>
                        <option value="Limpieza de Ventanas">Limpieza de Ventanas</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="mensaje">Mensaje:</label>
                    <textarea
                        id="mensaje"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        rows="4"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Solicitar Cotización</button>
            </form>
        </div>
    );
};

export default Cotizacion;
