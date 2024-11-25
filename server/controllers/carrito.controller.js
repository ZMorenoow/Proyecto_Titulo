import db from '../configs/db.js';

export const agregarAlCarrito = async (req, res) => {
    const {  id_cotizacion } = req.body;
    const id_usuario = req.user.id_usuario;

    if (!id_cotizacion) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos (id_servicio o id_cotizacion)' });
    }

    if (!id_usuario) {
        return res.status(400).json({ message: 'No se pudo obtener el ID de usuario' });
    }

    try {
        const connection = await db();

        const [result] = await connection.execute(
            `INSERT INTO carrito ( id_cotizacion, id_usuario) 
            VALUES ( ?, ?)`,
            [ id_cotizacion, id_usuario]
        );

        res.status(201).json({ message: 'Artículo agregado al carrito exitosamente', id_carrito: result.insertId });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ message: 'Error interno al agregar al carrito' });
    }
};

export const obtenerCarrito = async (req, res) => {
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(400).json({ message: 'No se pudo obtener el ID de usuario' });
    }

    try {
        const connection = await db();

        const [carrito] = await connection.execute(
            `SELECT c.id_carrito, c.id_cotizacion, c.check_pago, co.valor, co.cantidad, s.nombre_servicio
             FROM carrito c
             JOIN cotizaciones co ON c.id_cotizacion = co.id_cotizacion
             JOIN servicios s ON co.id_servicio = s.id_servicio
             WHERE c.id_usuario = ? AND c.check_pago = 0`,
            [id_usuario]
        );

        if (carrito.length === 0) {
            return res.status(200).json({ carrito: [] });
        }

        res.status(200).json({ carrito });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno al obtener el carrito' });
    }
}

export const eliminarDelCarrito = async (req, res) => {
    const { id_carrito } = req.body; // ID del artículo en el carrito a eliminar
    const id_usuario = req.user.id_usuario; // Usuario autenticado

    if (!id_carrito) {
        return res.status(400).json({ message: 'Falta el ID del carrito para eliminar.' });
    }

    try {
        const connection = await db();

        const [result] = await connection.execute(
            `DELETE FROM carrito WHERE id_carrito = ? AND id_usuario = ?`,
            [id_carrito, id_usuario]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró el artículo en el carrito o no pertenece al usuario.' });
        }

        res.status(200).json({ message: 'Artículo eliminado del carrito exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({ message: 'Error interno al eliminar el artículo del carrito.' });
    }
};

export const realizarPago = async (req, res) => {
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(400).json({ message: 'No se pudo obtener el ID de usuario' });
    }

    try {
        const connection = await db();

        // Actualiza el estado de los artículos en el carrito a "pagado"
        const [result] = await connection.execute(
            `UPDATE carrito SET check_pago = 1 WHERE id_usuario = ? AND check_pago = 0`,
            [id_usuario]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontraron artículos en el carrito para actualizar' });
        }

        // Obtener los artículos del carrito con el pago ya realizado
        const [carritoItems] = await connection.execute(
            `SELECT c.id_carrito, co.id_cotizacion, co.cantidad, co.valor, s.nombre_servicio
             FROM carrito c
             JOIN cotizaciones co ON c.id_cotizacion = co.id_cotizacion
             JOIN servicios s ON co.id_servicio = s.id_servicio
             WHERE c.id_usuario = ? AND c.check_pago = 1`,
            [id_usuario]
        );

        if (carritoItems.length === 0) {
            return res.status(404).json({ message: "El carrito está vacío o ya fue pagado anteriormente." });
        }

        const fechaReserva = req.body.fecha_reserva;
        const horaReserva = req.body.hora_reserva;
        const comuna = req.body.comuna;
        const direccion = req.body.direccion;
        const nombreDestinatario = req.body.nombre_destinatario;
        
        if (!fechaReserva || !horaReserva) {
            return res.status(400).json({ message: 'Fecha y hora de reserva son obligatorias' });
        }

        // Variable para calcular el monto total
        let montoTotal = 0;

        // Inserta la reserva para cada artículo en el carrito
        for (let item of carritoItems) {
            const [existingReserva] = await connection.execute(
                `SELECT * FROM reservas WHERE id_usuario = ? AND id_carrito = ?`,
                [id_usuario, item.id_carrito]
            );
        
            if (existingReserva.length > 0) {
                console.log(`La reserva para el carrito ${item.id_carrito} ya existe.`);
                continue;
            }
        
            // Inserta la reserva con el estado predeterminado (id_estado = 2)
            const [reservaResult] = await connection.execute(
                `INSERT INTO reservas (id_usuario, id_carrito, fecha_reserva, hora_reserva, comuna, direccion, nombre_destinatario, estado)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id_usuario, item.id_carrito, fechaReserva, horaReserva, comuna, direccion, nombreDestinatario, 1]
            );

            // Calcula el monto total (valor * cantidad)
            montoTotal += item.valor * item.cantidad;
            
            // Inserta el pago en la tabla pagos
            await connection.execute(
                `INSERT INTO pagos (id_reserva, id_usuario, monto, fecha_pago)
                 VALUES (?, ?, ?, ?)`,
                [reservaResult.insertId, id_usuario, montoTotal, new Date()]
            );
        }

        // Resetea el carrito para el próximo pago
        await connection.execute(
            `INSERT INTO carrito (id_usuario, check_pago) VALUES (?, 0)`,
            [id_usuario]
        );

        res.status(200).json({ message: 'Pago realizado y reservas creadas correctamente. Nuevo carrito creado para la próxima compra.' });

    } catch (error) {
        console.error('Error al actualizar el carrito y crear las reservas:', error);
        res.status(500).json({ message: 'Error interno al realizar el pago' });
    }
};
