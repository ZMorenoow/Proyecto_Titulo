import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importa los estilos
import './CSS/Formulario.css';

const FormularioReserva = () => {
    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        fecha: new Date(), // Inicializa con la fecha actual
        servicio: '',
    });

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosFormulario({ ...datosFormulario, [name]: value });
    };

    const manejarFechaCambio = (date) => {
        setDatosFormulario({ ...datosFormulario, fecha: date });
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', datosFormulario);
        alert('Reserva realizada con éxito!');
        setDatosFormulario({ nombre: '', correo: '', telefono: '', fecha: new Date(), servicio: '' });
    };

    return (
        <div className="container my-5">
            <h2 className="text-center">Reserva tu Servicio de Limpieza</h2>
            <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={datosFormulario.nombre}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="correo"
                        name="correo"
                        value={datosFormulario.correo}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={datosFormulario.telefono}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <DatePicker
                        selected={datosFormulario.fecha}
                        onChange={manejarFechaCambio}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="hora" className="form-label">Hora</label>
                    <input
                        type="time"
                        className="form-control"
                        id="hora"
                        name="hora"
                        value={datosFormulario.hora} // Aquí necesitamos manejar la hora en el estado
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="servicio" className="form-label">Servicio</label>
                    <select
                        className="form-select"
                        id="servicio"
                        name="servicio"
                        value={datosFormulario.servicio}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="">Selecciona un servicio</option>
                        <option value="Limpieza de Pisos">Limpieza de Pisos</option>
                        <option value="Limpieza de Alfombras">Limpieza de Alfombras</option>
                        <option value="Limpieza de Cortinas">Limpieza de Cortinas</option>
                        <option value="Limpieza de Sillones">Limpieza de Sillones</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Reservar</button>
            </form>
        </div>
    );
};

export default FormularioReserva;
