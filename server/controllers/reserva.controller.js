import db from "../configs/db.js";

export const obtenerReservas = async (req, res) => {
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(400).json({ message: 'No se pudo obtener el ID de usuario' });
    }

    try {
        const connection = await db();

        const [reservas] = await connection.execute(
            `SELECT 
            r.id_reserva, 
            r.id_usuario, 
            r.id_carrito,
            r.estado,
            r.fecha_reserva,
            r.hora_reserva,
            r.nombre_destinatario,
            u.nombre AS nombre_usuario, 
            u.apellido AS apellido_usuario, 
            c.id_cotizacion, 
            co.cantidad, 
            co.valor,
            e.tipo_estado, 
            s.nombre_servicio,
            p.monto
            FROM 
                reservas r
            JOIN 
                usuario u ON r.id_usuario = u.id_usuario
            JOIN 
                carrito c ON r.id_carrito = c.id_carrito
            JOIN 
                cotizaciones co ON c.id_cotizacion = co.id_cotizacion
            JOIN 
                servicios s ON co.id_servicio = s.id_servicio
            JOIN 
                estados e ON r.estado = e.id_estado
            JOIN 
                pagos p ON r.id_reserva = p.id_reserva 
            WHERE 
                r.id_usuario = ?;`,
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

export const obtenerHorariosOcupados = async (req, res) => {
    try {
        const connection = await db();

        const [horarios] = await connection.execute(
            `SELECT fecha_reserva, hora_reserva
            FROM reservas
            WHERE estado IN ('1','2');`
        );

        res.status(200).json({ horarios });
    } catch (error) {
        console.error('Error al obtener horarios ocupados:', error);
        res.status(500).json({ message: 'Error interno al obtener horarios ocupados' });
    }
};