import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from './service/auth.service.js'; // Solo importa getMe, ya que haremos la solicitud directamente aquí
import axios from 'axios'; // Necesario para hacer las solicitudes a la API
import './CSS/cuenta.css';

const Cuenta = () => {
    const [userData, setUserData] = useState(null);
    const [reservas, setReservas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener los datos del usuario
        const fetchUserData = async () => {
            try {
                const data = await getMe();
                if (data.error) {
                    throw new Error(data.message);
                }
                setUserData(data);
            } catch (error) {
                console.error('Error al obtener los datos del perfil:', error);
                navigate('/login');
            }
        };

        // Obtener las reservas del usuario
        const fetchReservas = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:3000/reserva/obtener', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReservas(response.data.reservas || []);
            } catch (error) {
                console.error('Error al obtener las reservas:', error);
            }
        };

        fetchUserData();
        fetchReservas();
    }, [navigate]);

    if (!userData) return <div>Cargando...</div>;

    return (
        <div className="container">
            <h2>Perfil de Usuario</h2>
            <div className="cards-container">
                {/* Tarjeta de perfil */}
                <div className="card profile-card">
                    <h3>Datos de Perfil</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" defaultValue={userData.nombre} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input type="text" id="apellido" defaultValue={userData.apellido} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Email</label>
                            <input type="email" id="correo" defaultValue={userData.correo} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="direccion">Dirección</label>
                            <input type="text" id="direccion" defaultValue={userData.direccion} />
                        </div>
                    </form>
                </div>

                {/* Tarjeta de reservas */}
                <div className="card reservas-card">
                    <h3>Pagos Realizados</h3>
                    {reservas.length > 0 ? (
                        <ul>
                            {reservas.map((reserva, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <strong>Servicio:</strong> {reserva.nombre_servicio} <br />
                                    <strong>Fecha de Reserva:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString()} <br />
                                    <strong>Cantidad:</strong> {reserva.cantidad} <br />
                                    <strong>Monto Total:</strong> ${reserva.monto_total} <br />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No has realizado ninguna reserva.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cuenta;