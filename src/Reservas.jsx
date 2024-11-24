import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import './CSS/reserva.css';

const Reserva = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"]; // Opciones de horas disponibles

    return (
        <div className="reservation-container">
            <div className="reservation-form">
                <h2 className="form-title">Reserva tu Servicio</h2>
                <form className='form-reserva'>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" placeholder="Ingresa tu nombre" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha</label>
                        <DatePicker
                            id="fecha"
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            required
                            locale={es}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hora">Hora</label>
                        <select id="hora" required>
                            <option value="" disabled selected>Selecciona una hora</option>
                            {timeSlots.map((slot, index) => (
                                <option key={index} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comuna">Comuna</label>
                        <input type="text" id="comuna" placeholder="Ingresa tu comuna" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input type="text" id="direccion" placeholder="Ingresa tu dirección" required />
                    </div>
                    <button className="submit-button" type="submit">Reservar</button>
                </form>
            </div>
        </div>
    );
};

export default Reserva;