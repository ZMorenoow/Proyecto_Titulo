import db from '../configs/db.js';
import { sendEmail } from '../utils/email.js';

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
    const emailUsuario = req.user.correo;

    if (!id_usuario || !emailUsuario) {
        return res.status(400).json({ message: 'No se pudo obtener el ID o el email del usuario' });
    }

    try {
        const connection = await db();

        const [carritoItems] = await connection.execute(
            `SELECT c.id_carrito, co.id_cotizacion, co.cantidad, co.valor, s.nombre_servicio
             FROM carrito c
             JOIN cotizaciones co ON c.id_cotizacion = co.id_cotizacion
             JOIN servicios s ON co.id_servicio = s.id_servicio
             WHERE c.id_usuario = ? AND c.check_pago = 0`,
            [id_usuario]
        );

        if (carritoItems.length === 0) {
            return res.status(404).json({ message: 'El carrito está vacío o ya fue pagado anteriormente.' });
        }

        const { fecha_reserva, hora_reserva, comuna, direccion, nombre_destinatario } = req.body;
        if (!fecha_reserva || !hora_reserva) {
            return res.status(400).json({ message: 'Fecha y hora de reserva son obligatorias' });
        }

        let totalPago = 0;

        for (let item of carritoItems) {
            const [reservaResult] = await connection.execute(
                `INSERT INTO reservas (id_usuario, id_carrito, fecha_reserva, hora_reserva, comuna, direccion, nombre_destinatario, estado)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id_usuario, item.id_carrito, fecha_reserva, hora_reserva, comuna, direccion, nombre_destinatario, 1]
            );

            const monto = item.valor * item.cantidad;
            totalPago += monto;

            await connection.execute(
                `INSERT INTO pagos (id_reserva, id_usuario, monto, fecha_pago)
                 VALUES (?, ?, ?, ?)`,
                [reservaResult.insertId, id_usuario, monto, new Date()]
            );
        }

        const carritoIds = carritoItems.map((item) => item.id_carrito);

        if (carritoIds.length > 0) {
            const placeholders = carritoIds.map(() => '?').join(', ');

            await connection.execute(
                `UPDATE carrito SET check_pago = 1 WHERE id_carrito IN (${placeholders})`,
                carritoIds 
            );
        }

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://lh3.googleusercontent.com/d/19g5PHrc1uDN4Wn4cfhH8XUW3MiomTwdh" alt="Watch & Wash Logo" style="width: 150px; height: auto;">
                </div>
                <h2 style="color: #333; text-align: center;">¡Gracias por tu compra, ${req.user.nombre}!</h2>
                <p style="color: #555; text-align: center;">Estamos encantados de que hayas confiado en nosotros. Aquí tienes los detalles de tu compra:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr>
                            <th style="border-bottom: 2px solid #ddd; text-align: left; padding: 8px;">Servicio</th>
                            <th style="border-bottom: 2px solid #ddd; text-align: center; padding: 8px;">Cantidad</th>
                            <th style="border-bottom: 2px solid #ddd; text-align: right; padding: 8px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${carritoItems
                            .map(
                                (item) => `
                                <tr>
                                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${item.nombre_servicio}</td>
                                    <td style="border-bottom: 1px solid #ddd; text-align: center; padding: 8px;">${item.cantidad}</td>
                                    <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 8px;">$${item.valor * item.cantidad}</td>
                                </tr>
                            `
                            )
                            .join('')}
                    </tbody>
                </table>
                <div style="margin-top: 20px; text-align: left;">
                    <br>
                    <br>
                    <strong>Forma de Pago:</strong>
                    <img src="https://lh3.googleusercontent.com/d/1RE3c0GRMY103Cff70P7pHZYUgqqHoasq" alt="Icono" style="width: 20px; margin-left: 8px; vertical-align: middle;" />
                </div>
                <p style="text-align: right; margin-top: 20px; font-size: 16px;">
                    <strong>Total Pagado: $${totalPago}</strong>
                </p>
                <div style="margin-top: 30px; text-align: center;">
                    <p style="color: #555;">Para más información, no dudes en contactarnos.</p>
                    <p style="color: #555;">Equipo de <strong>Watch & Wash</strong></p>
                    <p style="font-size: 14px; text-align: center; color: #999;">
                </p>
                <div style="text-align: center; margin-top: 10px; font-size: 9px; color: #666;">
                <p>No responda a este mensaje. Este correo electrónico fue enviado por un sistema automático que no procesa respuestas. W&W.</p>
            </div>
                </div>
            </div>
        `;

        await sendEmail(emailUsuario, 'Gracias por tu compra en Watch & Wash', htmlContent);

        res.status(200).json({
            message: 'Pago realizado, correo enviado, y reservas creadas correctamente.',
        });

    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).json({ message: 'Error interno al realizar el pago' });
    }
};