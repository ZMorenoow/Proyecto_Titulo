import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { initialOptions, createOrder, onApprove } from "../server/controllers/pagos/paypal.js";
import { useLocation } from "react-router-dom";
import './CSS/reserva.css';

const Reserva = () => {
    const location = useLocation();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [commune, setCommune] = useState("");
    const [showPayPal, setShowPayPal] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const timeSlots = ["9:00", "12:00", "3:00", "6:00"];

    const totalCarrito = location.state?.totalCarrito || 1000; 
    const cart = location.state?.carrito || []; 

    const handleReserveSubmit = (e) => {
        e.preventDefault();
        if (!name || !selectedDate || !selectedTime || !commune || !address) {
            alert("Por favor, completa todos los campos antes de continuar.");
            return;
        }

        const horaReserva = selectedTime ? `${selectedTime}:00` : null;
        

        const requestData = {
            nombre_destinatario: name,
            fecha_reserva: selectedDate.toISOString().split("T")[0],
            hora_reserva: horaReserva,
            comuna: commune,
            direccion: address
        };

        console.log("Datos enviados al backend:", requestData); 

        setShowPayPal(true);
        setRequestData(requestData);
    };

    const handlePayPalApprove = async (data, actions) => {
        await onApprove(data, actions, requestData);
        alert("Reserva completada exitosamente.");
        window.location.reload(); 
    };

    return (
        <div className="reservation-container">
            <div className="reservation-form">
                <h2 className="form-title">Reserva tu Servicio</h2>
                <form className="form-reserva" onSubmit={handleReserveSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Ingresa tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_reserva">Fecha</label>
                        <DatePicker
                            id="fecha_reserva"
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            required
                            locale={es}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hora_reserva">Hora</label>
                        <select
                            id="hora_reserva"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecciona una hora
                            </option>
                            {timeSlots.map((slot, index) => (
                                <option key={index} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comuna">Comuna</label>
                        <input
                            type="text"
                            id="comuna"
                            placeholder="Ingresa tu comuna"
                            value={commune}
                            onChange={(e) => setCommune(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            placeholder="Ingresa tu dirección"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    {!showPayPal && (
                        <button className="submit-button" type="submit">
                            Continuar a Pagar
                        </button>
                    )}
                </form>

                {showPayPal && (
                    <div className="paypal-container">
                        <PayPalScriptProvider options={initialOptions}>
                            <PayPalButtons
                                style={{ layout: "horizontal", color: "blue", shape: "rect", label: "paypal" }}
                                createOrder={(data, actions) =>
                                    createOrder(data, actions, totalCarrito, cart) 
                                }
                                onApprove={handlePayPalApprove}
                            />
                        </PayPalScriptProvider>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reserva;