import React, { useState , useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { initialOptions, createOrder, onApprove } from "../server/controllers/pagos/paypal.js";
import { useNavigate, useLocation } from "react-router-dom";
import './CSS/reserva.css';


const Reserva = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [commune, setCommune] = useState("");
    const [showPayPal, setShowPayPal] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [horariosOcupados, setHorariosOcupados] = useState({});
    const timeSlots = ["9:00", "12:00", "15:00", "18:00"];

    const totalCarrito = location.state?.totalCarrito || 1000; 
    const cart = location.state?.carrito || []; 

    useEffect(() => {
        const fetchHorariosOcupados = async () => {
            try {
                const token = localStorage.getItem("token"); // Obtener el token desde el almacenamiento local
            
                const response = await axios.get("http://localhost:3000/reserva/obtenerfechas", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir el encabezado de autorización
                    },
                });
            
                const data = response.data.horarios;
                // Agrupar horarios ocupados por fecha
                const horariosPorFecha = data.reduce((acc, curr) => {
                    const fecha = curr.fecha_reserva.split("T")[0]; // Formatear fecha
                    if (!acc[fecha]) acc[fecha] = [];
                    acc[fecha].push(curr.hora_reserva);
                    return acc;
                }, {});
                setHorariosOcupados(horariosPorFecha);
            } catch (error) {
                console.error("Error al obtener los horarios ocupados:", error);
            }
        };

        fetchHorariosOcupados();
    }, []);

    // Validar si un día es seleccionable
    const isDaySelectable = (date) => {
        const fechaSeleccionada = date.toISOString().split("T")[0];
        const horarios = horariosOcupados[fechaSeleccionada] || [];
        return horarios.length < timeSlots.length; // Deshabilitar si todos los horarios están ocupados
    };

    // Validar si un horario es seleccionable
    const isTimeSelectable = (time) => {
        if (!selectedDate) return true;
        const fechaSeleccionada = selectedDate.toISOString().split("T")[0];
        const horarios = horariosOcupados[fechaSeleccionada] || [];
        return !horarios.includes(`${time}:00`); // Deshabilitar si el horario está ocupado
    };

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
        navigate("/", { state: { paymentSuccess: true } }); // Pasar estado a la página de inicio
    };
    

    return (
        <div className="reservation__container">
            <div className="reservation__form">
                <h2 className="reservation__title">Reserva tu Servicio</h2>
                <form className="reservation__form-content" onSubmit={handleReserveSubmit}>
                    <div className="reservation__group">
                        <label htmlFor="nombre">Nombre Destinatario</label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Ingresa tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="reservation__group">
                        <label htmlFor="fecha_reserva">Fecha</label>
                        <DatePicker
                            id="fecha_reserva"
                            className="reservation__control"
                            dateFormat="dd/MM/yyyy"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            required
                            locale={es}
                            placeholderText="Selecciona una fecha"
                            filterDate={isDaySelectable}
                            minDate={new Date()} 
                        />

                    </div>
                    <div className="reservation__group">
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
                                <option key={index} value={slot} disabled={!isTimeSelectable(slot)}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="reservation__group">
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
                    <div className="reservation__group">
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
                        <button className="reservation__button" type="submit">
                            Continuar a Pagar
                        </button>
                    )}
                </form>

                {showPayPal && (
                    <div className="reservation__paypal">
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
