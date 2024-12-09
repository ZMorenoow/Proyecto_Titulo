import db from '../configs/db.js';

export const getAllWorkerReservations = async (req, res) => {
    try {
        const connection = await db();

        const [reservations] = await connection.execute(
            `
            SELECT 
                rt.id_reserva_trabajador,
                r.id_reserva,
                r.fecha_reserva,
                r.hora_reserva,
                r.estado AS estado,  
                s.nombre_servicio,
                co.medidas,
                r.nombre_destinatario,
                r.direccion,
                r.comuna,
                co.material,
                u.nombre AS nombre_cliente
            FROM reserva_trabajador rt
            JOIN reservas r ON rt.id_reserva = r.id_reserva
            JOIN estados e ON r.estado = e.id_estado
            JOIN carrito c ON r.id_carrito = c.id_carrito
            JOIN contratacion co ON c.id_contratacion = co.id_contratacion
            JOIN servicios s ON co.id_servicio = s.id_servicio
            JOIN usuario u ON r.id_usuario = u.id_usuario
            WHERE rt.id_usuario_rol = (
                SELECT ur.id_usuario_rol
                FROM usuario_rol ur
                WHERE ur.id_usuario = ?
            );
            `,
            [req.user.id_usuario]
        );

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error al obtener las reservas de trabajadores:', error);
        res.status(500).json({ message: 'Error al obtener las reservas de trabajadores.' });
    }
};

export const updateReservation = async (req, res) => {
    const { id_reserva } = req.params;
    const { estado } = req.body;

    if (!estado || !Number.isInteger(estado)) {
        return res.status(400).json({ message: 'Estado inválido' });
    }

    try {
        const connection = await db();

        // Primero obtenemos el estado actual de la reserva
        const [currentState] = await connection.execute(`
            SELECT estado FROM reservas WHERE id_reserva = ?
        `, [id_reserva]);

        if (currentState.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Si el estado actual es "Terminado" (ID 4), no se puede cambiar
        if (currentState[0].estado === 4) {
            return res.status(400).json({ message: 'No se puede modificar una reserva terminada.' });
        }

        // Actualizar el estado si es permitido
        const [result] = await connection.execute(`
            UPDATE reservas 
            SET estado = ? 
            WHERE id_reserva = ?
        `, [estado, id_reserva]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el estado de la reserva:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la reserva' });
    }
};
