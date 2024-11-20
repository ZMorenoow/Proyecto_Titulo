import db from '../configs/db.js';


// Función para obtener la lista de trabajadores, excluyendo al administrador
export const getWorkersList = async (req, res) => {
    try {
        const connection = await db();
        // Seleccionar trabajadores excluyendo al administrador
        const [workers] = await connection.execute(
            `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, r.rol
             FROM usuario u
             JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
             JOIN roles r ON ur.id_rol = r.id_rol
             WHERE r.rol = 'Trabajador' AND u.id_usuario != ?`,
            [req.user.id_usuario] // Excluye al administrador actual
        );

        res.status(200).json(workers);
    } catch (error) {
        console.error('Error al obtener el listado de trabajadores:', error);
        res.status(500).json({ message: 'Error al obtener el listado de trabajadores' });
    }
};

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
    const { id_usuario } = req.params;

    try {
        const connection = await db();

        // Evitar que el admin elimine su propia cuenta
        if (id_usuario == req.user.id_usuario) {
            return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta' });
        }

        // Eliminar la cuenta de usuario
        await connection.execute('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario]);
        
        res.status(200).json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        res.status(500).json({ message: 'Error al eliminar la cuenta' });
    }
};

// Función para cambiar el rol de un usuario
export const changeUserRole = async (req, res) => {
    const { id_usuario } = req.params;
    const { newRoleId } = req.body; // El ID del nuevo rol

    try {
        const connection = await db();

        // Evitar que el admin cambie su propio rol
        if (id_usuario == req.user.id_usuario) {
            return res.status(403).json({ message: 'No puedes cambiar tu propio rol' });
        }

        // Actualizar el rol del usuario
        await connection.execute(
            'UPDATE usuario_rol SET id_rol = ? WHERE id_usuario = ?',
            [newRoleId, id_usuario]
        );

        res.status(200).json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ message: 'Error al cambiar el rol del usuario' });
    }
};