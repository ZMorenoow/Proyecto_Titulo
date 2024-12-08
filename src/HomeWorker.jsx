import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/HomeWorker.css';

const HomeWorker = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');
    
    // El mapa de estados usa los id_estado como claves
    const estadoMap = {
        1: 'Pendiente',
        2: 'Aceptado',
        3: 'Cancelado',
        4: 'Terminado'
    };

    // Función para obtener reservas asignadas al trabajador
    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
            if (!token) {
                setError('No se encontró un token en el almacenamiento local. Inicia sesión nuevamente.');
                return;
            }

            const response = await axios.get('http://localhost:3000/worker/reservas-trabajador/todas', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado
                },
            });

            setReservations(response.data); // Almacena las reservas en el estado
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    // Función para manejar la actualización del estado
    const handleUpdateState = async (id_reserva, newStateId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No se encontró un token en el almacenamiento local. Inicia sesión nuevamente.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/worker/reserva/${id_reserva}`, {
                estado: newStateId // Enviar el ID del estado
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Actualizar el estado localmente para reflejar el cambio
                setReservations((prevReservations) =>
                    prevReservations.map((reservation) =>
                        reservation.id_reserva === id_reserva ? { ...reservation, estado: newStateId } : reservation
                    )
                );
            }
            ;
            alert('Estado de la reserva actualizado correctamente');
          } catch (error) {
            console.error('Error al actualizar el estado de la reserva', error);
            alert('Error al actualizar el estado de la reserva');
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
                            <th>Dirección</th>
                            <th>Comuna</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
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
                                <td>{reservation.direccion}</td>
                                <td>{reservation.comuna}</td>
                                <td>{new Date(reservation.fecha_reserva).toLocaleDateString('es-CL')}</td>
                                <td>{reservation.hora_reserva}</td>
                                <td>
                                    <select
                                        value={reservation.estado}
                                        onChange={(e) => {
                                            // No permitir cambios si el estado ya es 'Terminado'
                                            if (reservation.estado === 4) {
                                                alert('No puedes modificar una reserva terminada.');
                                                return;
                                            }
                                            handleUpdateState(reservation.id_reserva, parseInt(e.target.value));
                                        }}
                                    >
                                        {Object.entries(estadoMap).map(([id, estado]) => (
                                            <option key={id} value={id} disabled={reservation.estado === 4 && id !== '4'}>
                                                {estado}
                                            </option>
                                        ))}
                                    </select>
                                </td>
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
