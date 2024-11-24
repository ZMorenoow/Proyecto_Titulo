import db from "../configs/db.js";

export const obtenerReservas = async (req, res) => {
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(400).json({ message: 'No se pudo obtener el ID de usuario' });
    }

    try {
        const connection = await db();

        const [reservas] = await connection.execute(
            `
            SELECT 
                r.id_reserva,
                r.fecha_reserva,
                c.id_carrito,
                co.id_cotizacion,
                co.cantidad,
                co.valor,
                s.nombre_servicio,
                (co.cantidad * co.valor) AS monto_total
            FROM reservas r
            JOIN carrito c ON r.id_carrito = c.id_carrito
            JOIN cotizaciones co ON c.id_cotizacion = co.id_cotizacion
            JOIN servicios s ON c.id_servicio = s.id_servicio
            WHERE r.id_usuario = ?
            ORDER BY r.id_reserva DESC
            `,
            [id_usuario]
        );

        if (reservas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reservas para este usuario' });
        }

        res.status(200).json({ reservas });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ message: 'Error interno al obtener las reservas' });
    }
};