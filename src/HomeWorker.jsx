import React, { useEffect, useState } from 'react';
import './CSS/HomeWorker.css'; 

const HomeWorker = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    // Función para obtener reservas asignadas al trabajador
    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
            if (!token) {
                setError('No se encontró un token en el almacenamiento local. Inicia sesión nuevamente.');
                return;
            }

            const response = await fetch('http://localhost:3000/worker/reservas-trabajador/todas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener las reservas');
            }

            const data = await response.json();
            setReservations(data); // Almacena las reservas en el estado
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    // Llamamos a la API al cargar el componente
    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <div className='reservas-asignadas'>
            <h2>Reservas Asignadas</h2>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            {reservations.length > 0 ? (
                <table className="reservations-table">
                    <thead>
                        <tr>
                            <th>ID Reserva</th>
                            <th>Cliente</th>
                            <th>Servicio</th>
                            <th>Medidas</th>
                            <th>Material</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.id_reserva}>
                                <td>{reservation.id_reserva}</td>
                                <td>{reservation.nombre_cliente}</td>
                                <td>{reservation.nombre_servicio}</td>
                                <td>{reservation.medidas}</td>
                                <td>{reservation.material}</td>
                                <td>{new Date(reservation.fecha_reserva).toLocaleDateString('es-CL')}</td>
                                <td>{reservation.hora_reserva}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tienes reservas asignadas.</p>
            )}
        </div>
    );
};

export default HomeWorker;
