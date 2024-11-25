import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/ReservasTrabajador.css';

const ReservasTrabajador = () => {
    const [reservationsWorker, setReservationsWorker] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [newReservation, setNewReservation] = useState({
        id_usuario_roles: [],
        id_reserva: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reservationsWorkerResponse, workersResponse, reservationsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/admin/reservas-trabajador', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }),
                    axios.get('http://localhost:3000/admin/getTrabajadores', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }),
                    axios.get('http://localhost:3000/admin/reservas', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }),
                ]);

                setReservationsWorker(reservationsWorkerResponse.data);
                setWorkers(workersResponse.data);
                setReservations(reservationsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar los datos:', err);
                setError('Error al cargar los datos.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newReservation.id_reserva || newReservation.id_usuario_roles.length === 0) {
            alert('Debe seleccionar al menos un trabajador y una reserva.');
            return;
        }

        try {
            await Promise.all(
                newReservation.id_usuario_roles.map((id_usuario_rol) =>
                    axios.post(
                        'http://localhost:3000/admin/reservas-trabajador',
                        { id_reserva: newReservation.id_reserva, id_usuario_rol },
                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                    )
                )
            );

            alert('Reserva asignada correctamente.');
            setNewReservation({ id_usuario_roles: [], id_reserva: '' });

            const updatedReservationsWorker = await axios.get('http://localhost:3000/admin/reservas-trabajador', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setReservationsWorker(updatedReservationsWorker.data);
        } catch (err) {
            console.error('Error al asignar la reserva:', err.response?.data || err.message);
            alert(`Error al asignar la reserva: ${err.response?.data?.message || 'Error desconocido'}`);
        }
    };

    const handleEdit = (reservation) => {
        setNewReservation({
            id_reserva: reservation.id_reserva,
            id_usuario_roles: reservation.trabajadores_ids || [],
        });
    };

    const handleDelete = async (id_reserva_trabajador) => {
        console.log('ID a eliminar:', id_reserva_trabajador);
    
        if (!id_reserva_trabajador) {
            alert('No se pudo obtener el ID de la reserva trabajador.');
            return;
        }
    
        if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
            try {
                await axios.delete(
                    `http://localhost:3000/admin/reservas-trabajador/${id_reserva_trabajador}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
    
                alert('Reserva eliminada correctamente.');
    
                // Recargar las reservas actualizadas
                const updatedReservationsWorker = await axios.get('http://localhost:3000/admin/reservas-trabajador', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setReservationsWorker(updatedReservationsWorker.data);
            } catch (err) {
                console.error('Error al eliminar la reserva:', err.response?.data || err.message);
                alert(`Error al eliminar la reserva: ${err.response?.data?.message || 'Error desconocido'}`);
            }
        }
    };
    
    

    if (loading) {
        return <div>Cargando datos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className='res-trabajador'>Reservas de Trabajadores</h1>
                                <table>
                        <thead>
                            <tr>
                                <th>Número de reserva</th>
                                <th>Trabajadores asignados</th>
                                <th>Fecha de Reserva</th>
                                <th>Hora de Reserva</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservationsWorker.length > 0 ? (
                                reservationsWorker.map((reservation) => (
                                    <tr key={reservation.id_reserva_trabajador}>
                                        <td>{reservation.id_reserva}</td>
                                        <td>{reservation.trabajadores}</td>
                                        <td>{new Date(reservation.fecha_reserva).toLocaleDateString()}</td>
                                        <td>{(reservation.hora_reserva).toLocaleString()}</td>
                                        <td>{reservation.estado}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(reservation.id_reserva_trabajador)}
                                                className="borrar-button"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No hay reservas disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

            <h2 className='asignar-trabajador'>Asignar nueva reserva a trabajadores</h2>
            <form className= "asignar-reserva" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="trabajadores">Trabajadores:</label>
                    <select
                        id="trabajadores"
                        multiple
                        value={newReservation.id_usuario_roles}
                        onChange={(e) =>
                            setNewReservation({
                                ...newReservation,
                                id_usuario_roles: [...e.target.selectedOptions].map((option) => option.value),
                            })
                        }
                        className="dropdown-select"
                        required
                    >
                        <option value="" disabled>
                            Seleccione uno o más trabajadores
                        </option>
                        {workers.map((worker) => (
                            <option key={worker.id_usuario_rol} value={worker.id_usuario_rol}>
                                {worker.nombre} {worker.apellido}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="reserva">Reserva:</label>
                    <select
                        id="reserva"
                        value={newReservation.id_reserva}
                        onChange={(e) => setNewReservation({ ...newReservation, id_reserva: e.target.value })}
                        className="dropdown-select"
                        required
                    >
                        <option value="">Seleccione una reserva</option>
                        {reservations
                            .filter((reservation) => reservation.estado === 'Aceptado') // Filtra reservas con estado "Aceptado"
                            .map((reservation) => (
                                <option key={reservation.id_reserva} value={reservation.id_reserva}>
                                    {reservation.nombre_servicio} - {new Date(reservation.fecha_reserva).toLocaleDateString('es-CL')} - {reservation.hora_reserva}
                                </option>
                            ))}
                    </select>

                </div>
                <button type="submit">Asignar Reserva</button>
            </form>
        </div>
    );
};

export default ReservasTrabajador;