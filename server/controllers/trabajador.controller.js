import db from '../configs/db.js';

// Obtener el listado de usuarios que han solicitado un servicio específico
export const getUsersByService = async (req, res) => {
    const { id_servicio } = req.params;

    try {
        const connection = await db();

        // Consulta para obtener la información de los usuarios que solicitaron un servicio específico
        const [users] = await connection.execute(
            `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, u.direccion
             FROM servicio_usuario su
             JOIN usuario u ON su.id_usuario = u.id_usuario
             WHERE su.id_servicio = ?`,
            [id_servicio]
        );

        // Verificar si se encontraron usuarios para el servicio solicitado
        if (users.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios para este servicio.' });
        }

        // Enviar el listado de usuarios como respuesta
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener el listado de usuarios por servicio:', error);
        res.status(500).json({ message: 'Error interno al obtener el listado de usuarios' });
    }
};