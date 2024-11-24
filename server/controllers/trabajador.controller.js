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
                e.tipo_estado AS estado
            FROM reserva_trabajador rt
            JOIN reservas r ON rt.id_reserva = r.id_reserva
            JOIN estados e ON r.estado = e.id_estado
            WHERE rt.id_usuario_rol = (
                SELECT ur.id_usuario_rol
                FROM usuario_rol ur
                WHERE ur.id_usuario = ?
            )
            `,
            [req.user.id_usuario]
        );

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error al obtener las reservas de trabajadores:', error);
        res.status(500).json({ message: 'Error al obtener las reservas de trabajadores.' });
    }
};
