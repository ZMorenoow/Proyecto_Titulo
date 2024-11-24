import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapea el tipo de estado a id_estado
  const estadoMap = {
    'Pendiente': 1,
    'Aceptado': 2,
    'Cancelado': 3
  };

  // Obtener las reservas desde el backend
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/reservas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setReservas(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar las reservas');
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  // Función para formatear las fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { // Puedes cambiar el código de idioma y opciones
      weekday: 'long',  // Día de la semana
      year: 'numeric',  // Año
      month: 'long',  // Mes
      day: 'numeric',  // Día
    });
  };

  // Actualizar estado de la reserva
  const handleUpdateEstado = async (id_reserva, nuevoEstado) => {
    const estadoId = estadoMap[nuevoEstado];

    try {
      const response = await axios.put(
        `http://localhost:3000/admin/reservas/${id_reserva}`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Actualizar el estado de la reserva en el frontend
      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id_reserva === id_reserva
            ? { ...reserva, estado: nuevoEstado }
            : reserva
        )
      );
      alert('Estado de la reserva actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el estado de la reserva', error);
      alert('Error al actualizar el estado de la reserva');
    }
  };

  // Eliminar una reserva
  const handleDelete = async (id_reserva) => {
    console.log("Eliminando reserva con ID:", id_reserva); // Para verificar
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
        try {
            await axios.delete(`http://localhost:3000/admin/reservas/${id_reserva}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setReservas(reservas.filter(reserva => reserva.id_reserva !== id_reserva));
            alert('Reserva eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
            alert('Error al eliminar la reserva');
        }
    }
};


  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Reservas</h1>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Valor</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id_reserva}>
              <td>{reserva.usuario}</td>
              <td>{reserva.valor}</td>
              <td>{formatDate(reserva.fecha_reserva)}</td>
              <td>{reserva.hora_reserva}</td>
              <td>
                <select
                  value={reserva.estado}
                  onChange={(e) => handleUpdateEstado(reserva.id_reserva, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aceptado">Aceptado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(reserva.id_reserva)} className="boton-eliminar">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservas;