import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import './CSS/reserva.css';

const Reserva = () => {
    
    return (
        <div className="container my-5">
        <h2 className="text-center">Reserva tu Servicio</h2>
        <form>
            <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="nombre" placeholder="Ingresa tu nombre" required />
            </div>
            <div className="mb-3">
                <label htmlFor="fecha" className="form-label" >Fecha </label>
                <DatePicker
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    required
                    locale={es}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="hora" className="form-label">Hora</label>
                <div className="d-flex">
                    <input type="number" className="form-control" id="hora" min="1" max="12" placeholder="Hora" required />
                    <input type="number" className="form-control" id="minutos" min="0" max="59" placeholder="Minutos" required />
                    <select className="form-control" id="amPm" required>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="comuna" className="form-label">Comuna</label>
                <input type="text" className="form-control" id="comuna" placeholder="Ingresa tu comuna" required />
            </div>
            <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input type="text" className="form-control" id="direccion" placeholder="Ingresa tu dirección" required />
            </div>
        
            <button type="submit" className="btn btn-primary">Reservar</button>
        </form>
    </div>
    )}     
export default Reserva;
