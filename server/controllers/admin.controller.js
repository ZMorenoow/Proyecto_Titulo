import db from '../configs/db.js';

// Función para obtener la lista de usuarios, excluyendo al administrador
export const getUsersList = async (req, res) => {
    try {
        const connection = await db();
        // Seleccionar usuarios excluyendo al administrador
        const [users] = await connection.execute(
            `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, r.rol
             FROM usuario u
             JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
             JOIN roles r ON ur.id_rol = r.id_rol
             WHERE r.rol = 'Usuario' AND u.id_usuario != ?`,
            [req.user.id_usuario] // Excluye al administrador actual
        );

        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener el listado de usuarios:', error);
        res.status(500).json({ message: 'Error al obtener el listado de usuarios' });
    }
};

// Función para eliminar una cuenta de usuario o trabajador
export const deleteUserAccount = async (req, res) => {
    const { id } = req.params;  // Aquí usamos "id" para que coincida con la ruta

    try {
        const connection = await db();

        // Evitar que el admin elimine su propia cuenta
        if (id == req.user.id_usuario) {
            return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta' });
        }

        // Eliminar la cuenta de usuario
        const [result] = await connection.execute('DELETE FROM usuario WHERE id_usuario = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        res.status(500).json({ message: 'Error al eliminar la cuenta' });
    }
};

// Función para cambiar el rol de un usuario
export const changeUserRole = async (req, res) => {
    const { id } = req.params; // Ahora es "id" para coincidir con la ruta
    const { newRoleId } = req.body;

    try {
        const connection = await db();

        // Evitar que el admin cambie su propio rol
        if (id == req.user.id_usuario) {
            return res.status(403).json({ message: 'No puedes cambiar tu propio rol' });
        }

        // Actualizar el rol del usuario
        await connection.execute(
            'UPDATE usuario_rol SET id_rol = ? WHERE id_usuario = ?',
            [newRoleId, id]
        );

        res.status(200).json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ message: 'Error al cambiar el rol del usuario' });
    }
};

// Función para actualizar los datos de un usuario
export const updateUser = async (req, res) => {
    const { id } = req.params; // El ID del usuario a actualizar
    const { nombre, apellido, correo, rol } = req.body; // Los datos actualizados del usuario y el rol

    try {
        const connection = await db();

        // Evitar que el admin cambie su propio rol
        if (id == req.user.id_usuario) {
            return res.status(403).json({ message: 'No puedes actualizar tu propia cuenta' });
        }

        // Actualizar los datos del usuario
        const [result] = await connection.execute(
            `UPDATE usuario SET nombre = ?, apellido = ?, correo = ? WHERE id_usuario = ?`,
            [nombre, apellido, correo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si se especificó un rol, actualizar el rol del usuario
        if (rol) {
            // Evitar que un usuario con rol 'Administrador' sea asignado desde otro rol
            if (rol === '1') {
                return res.status(400).json({ message: 'No puedes asignar el rol de Administrador a este usuario' });
            }

            // Actualizar el rol del usuario en la tabla usuario_rol
            await connection.execute(
                `UPDATE usuario_rol SET id_rol = ? WHERE id_usuario = ?`,
                [rol, id]
            );
        }

        // Recuperar los datos actualizados del usuario
        const [updatedUser] = await connection.execute(
            `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, r.rol
             FROM usuario u
             JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
             JOIN roles r ON ur.id_rol = r.id_rol
             WHERE u.id_usuario = ?`,
            [id]
        );

        res.status(200).json(updatedUser[0]);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};


export const getServicesList = async (req, res) => {
    try {
        const connection = await db();
        const [services] = await connection.execute(
            `SELECT id_servicio, nombre_servicio, descripcion_servicio, imagen_servicio FROM servicios`
        );
        res.status(200).json(services);
    } catch (error) {
        console.error('Error al obtener la lista de servicios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de servicios', error: error.message });
    }
};

// Función para agregar un nuevo servicio
export const addService = async (req, res) => {
    const { nombre_servicio, descripcion_servicio, imagen_servicio } = req.body;

    // Validar campos requeridos
    if (!nombre_servicio || !descripcion_servicio) {
        return res.status(400).json({ message: 'Nombre y descripción del servicio son obligatorios.' });
    }

    try {
        const connection = await db();
        const [result] = await connection.execute(
            `INSERT INTO servicios (nombre_servicio, descripcion_servicio, imagen_servicio) VALUES (?, ?, ?)`,
            [nombre_servicio, descripcion_servicio, imagen_servicio || null]  // Imagen es opcional
        );

        res.status(201).json({
            message: 'Servicio creado correctamente',
            serviceId: result.insertId,
        });
    } catch (error) {
        console.error('Error al agregar servicio:', error);
        res.status(500).json({ message: 'Error al agregar servicio', error: error.message });
    }
};

// Función para actualizar un servicio
export const updateService = async (req, res) => {
    const { id } = req.params;
    const { nombre_servicio, descripcion_servicio, imagen_servicio } = req.body;

    // Validar campos requeridos
    if (!nombre_servicio || !descripcion_servicio) {
        return res.status(400).json({ message: 'Nombre y descripción del servicio son obligatorios.' });
    }

    try {
        const connection = await db();
        const [result] = await connection.execute(
            `UPDATE servicios SET nombre_servicio = ?, descripcion_servicio = ?, imagen_servicio = ? WHERE id_servicio = ?`,
            [nombre_servicio, descripcion_servicio, imagen_servicio || null, id]  // Imagen es opcional
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        res.status(200).json({ message: 'Servicio actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ message: 'Error al actualizar servicio', error: error.message });
    }
};

// Función para eliminar un servicio
export const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await db();
        const [result] = await connection.execute(
            `DELETE FROM servicios WHERE id_servicio = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        res.status(200).json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({ message: 'Error al eliminar servicio', error: error.message });
    }
};



export const getReservationsList = async (req, res) => {
    try {
        const connection = await db(); // Establecer la conexión con la base de datos

        // Consulta para obtener las reservas con los detalles requeridos
        const [reservations] = await connection.execute(`
            SELECT 
                r.id_reserva, 
                u.nombre AS usuario, 
                p.monto, 
                r.fecha_reserva, 
                r.hora_reserva, 
                r.fecha_creacion, 
                e.tipo_estado AS estado, 
                s.nombre_servicio
            FROM reservas r
            JOIN usuario u ON r.id_usuario = u.id_usuario
            JOIN carrito c ON r.id_carrito = c.id_carrito
            JOIN pagos p ON r.id_reserva = p.id_reserva
            JOIN cotizaciones co ON c.id_cotizacion = co.id_cotizacion
            JOIN servicios s ON co.id_servicio = s.id_servicio
            JOIN estados e ON r.estado = e.id_estado;

        `);

        // Responder con las reservas en formato JSON
        console.log(reservations);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ message: 'Error al obtener las reservas' });
    }
};

const estadoMap = {
    'Pendiente': 1,  // ID del estado 'Pendiente'
    'Aceptado': 2,   // ID del estado 'Aceptado'
    'Cancelado': 3   // ID del estado 'Cancelado'
  };
  export const updateReservationStatus = async (req, res) => {
    const { id_reserva } = req.params;
    const { estado } = req.body;
  
    // Verifica si el estado es válido
    if (!estadoMap[estado]) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
  
    // Obtiene el id_estado correspondiente al tipo de estado
    const estadoId = estadoMap[estado];
  
    try {
      // Realiza la actualización en la base de datos
      const connection = await db(); // Establece la conexión con la base de datos
      const [result] = await connection.execute(`
        UPDATE reservas 
        SET estado = ? 
        WHERE id_reserva = ?
      `, [estadoId, id_reserva]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }
  
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el estado de la reserva:', error);
      res.status(500).json({ message: 'Error al actualizar el estado de la reserva' });
    }
  };
  
  export const deleteReservation = async (req, res) => {
    try {
        const { id_reserva } = req.params;
        const connection = await db();
        const [result] = await connection.execute(
            'DELETE FROM reservas WHERE id_reserva = ?',
            [id_reserva]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        res.status(500).json({ message: 'Error al eliminar la reserva' });
    }
};

export const getReservationsForWorkers = async (req, res) => {
    try {
        const connection = await db();

        const [reservations] = await connection.execute(`
            SELECT 
                rt.id_reserva_trabajador,
                r.id_reserva,
                GROUP_CONCAT(CONCAT(u.nombre, ' ', u.apellido) SEPARATOR ', ') AS trabajadores,
                r.fecha_reserva,
                r.hora_reserva,
                e.tipo_estado AS estado,
                s.nombre_servicio AS servicio
            FROM reserva_trabajador rt
            JOIN reservas r ON rt.id_reserva = r.id_reserva
            JOIN usuario_rol ur ON rt.id_usuario_rol = ur.id_usuario_rol
            JOIN usuario u ON ur.id_usuario = u.id_usuario
            JOIN estados e ON r.estado = e.id_estado
            JOIN carrito c ON r.id_carrito = c.id_carrito
            JOIN cotizaciones cot ON c.id_cotizacion = cot.id_cotizacion
            JOIN servicios s ON cot.id_servicio = s.id_servicio
            WHERE e.id_estado = 2
            GROUP BY r.id_reserva, rt.id_reserva_trabajador, s.nombre_servicio;

        `);

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error al obtener las reservas de trabajadores:', error);
        res.status(500).json({ message: 'Error al obtener las reservas de trabajadores.' });
    }
};

;
export const addWorkerReservation = async (req, res) => {
    const { id_reserva, id_usuario_rol } = req.body;

    // Validar los datos recibidos
    if (!id_reserva || !id_usuario_rol) {
        return res.status(400).json({
            message: 'Faltan datos requeridos: id_reserva y id_usuario_rol.',
        });
    }

    try {
        const connection = await db();

        // Verificar que la reserva existe y está en estado pendiente
        const [reservation] = await connection.execute(
            `SELECT * FROM reservas WHERE id_reserva = ? AND estado = 2`,
            [id_reserva]
        );

        if (reservation.length === 0) {
            return res.status(400).json({
                message: 'La reserva no está disponible para ser asignada (puede no existir o no estar aceptada).',
            });
        }

        // Verificar que el trabajador tiene el rol adecuado
        const [worker] = await connection.execute(
            `SELECT * FROM usuario_rol WHERE id_usuario_rol = ? AND id_rol = 3`,
            [id_usuario_rol]
        );

        if (worker.length === 0) {
            return res.status(400).json({
                message: 'El trabajador no existe o no tiene el rol adecuado.',
            });
        }

        // Verificar que la asignación no exista previamente
        const [existingAssignment] = await connection.execute(
            `SELECT * FROM reserva_trabajador WHERE id_reserva = ? AND id_usuario_rol = ?`,
            [id_reserva, id_usuario_rol]
        );

        if (existingAssignment.length > 0) {
            return res.status(400).json({
                message: 'El trabajador ya está asignado a esta reserva.',
            });
        }

        // Insertar la asignación en la base de datos
        const [result] = await connection.execute(
            `INSERT INTO reserva_trabajador (id_reserva, id_usuario_rol, fecha_asignacion)
             VALUES (?, ?, NOW())`,
            [id_reserva, id_usuario_rol]
        );

        res.status(201).json({
            message: 'Reserva asignada correctamente.',
            id_reserva_trabajador: result.insertId,
        });
    } catch (error) {
        console.error('Error al asignar la reserva:', error);
        res.status(500).json({
            message: 'Error interno al asignar la reserva.',
        });
    }
};

export const updateWorkerReservation = async (req, res) => {
    const { id_reserva_trabajador } = req.params;
    const { id_usuario_rol, id_reserva } = req.body;

    if (!id_usuario_rol || !id_reserva) {
        return res.status(400).json({ message: 'Faltan datos requeridos: id_usuario_rol y id_reserva.' });
    }

    try {
        const connection = await db();

        // Actualizar la reserva trabajador
        const [result] = await connection.execute(
            `UPDATE reserva_trabajador 
             SET id_usuario_rol = ?, id_reserva = ? 
             WHERE id_reserva_trabajador = ?`,
            [id_usuario_rol, id_reserva, id_reserva_trabajador]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva trabajador no encontrada.' });
        }

        res.status(200).json({ message: 'Reserva trabajador actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar la reserva trabajador:', error);
        res.status(500).json({ message: 'Error interno al actualizar la reserva trabajador.' });
    }
};
export const deleteWorkerReservation = async (req, res) => {
    const { id_reserva_trabajador } = req.params;

    console.log('ID recibido para eliminar:', id_reserva_trabajador);

    try {
        const connection = await db();

        const [result] = await connection.execute(
            `DELETE FROM reserva_trabajador WHERE id_reserva_trabajador = ?`,
            [id_reserva_trabajador]
        );

        if (result.affectedRows === 0) {
            console.log('No se encontró la reserva trabajador con ID:', id_reserva_trabajador);
            return res.status(404).json({ message: 'Reserva trabajador no encontrada.' });
        }

        res.status(200).json({ message: 'Reserva trabajador eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar la reserva trabajador:', error);
        res.status(500).json({ message: 'Error interno al eliminar la reserva trabajador.' });
    }
};




export const getWorkersList = async (req, res) => {
    try {
        const connection = await db();
        const [workers] = await connection.execute(`
            SELECT 
                ur.id_usuario_rol, 
                u.id_usuario, 
                u.nombre, 
                u.apellido, 
                r.rol 
            FROM usuario u
            JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
            JOIN roles r ON ur.id_rol = r.id_rol
            WHERE r.id_rol = 3
        `);

        res.status(200).json(workers);
    } catch (error) {
        console.error('Error al obtener el listado de trabajadores:', error);
        res.status(500).json({ message: 'Error al obtener el listado de trabajadores' });
    }
};

