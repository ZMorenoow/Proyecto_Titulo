import jwt from 'jsonwebtoken';
import db from '../configs/db.js';

export const authRequired = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token,"1q2w3e4r5t6y7u8i9o0p!@$%^&*_+QWERTYUIOP|:<>?asdfghjklzxcvbnmASDFGHJKLZXCVBNM");

        // Almacenar la información decodificada en el objeto request para utilizarla en la ruta
        req.user = decoded;

        next(); // Llamamos a la siguiente función de middleware o ruta
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

//Admin
export const adminRequired = async (req, res, next) => {
    try {
        const connection = await db();

        // Consultar el rol del usuario en la tabla usuario_rol
        const [result] = await connection.execute(
            `SELECT r.id_rol
             FROM usuario_rol ur
             JOIN roles r ON ur.id_rol = r.id_rol
             WHERE ur.id_usuario = ?`,
            [req.user.id_usuario]
        );

        // Verificar si el usuario tiene el rol de administrador (id_rol = 1)
        const userRole = result[0]?.id_rol;
        if (userRole !== 1) {
            return res.status(403).json({ message: 'Acceso denegado: Solo el administrador puede acceder a esta ruta' });
        }

        next(); // Permitir acceso a la siguiente función si es administrador
    } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
        res.status(500).json({ message: 'Error interno al verificar el rol' });
    }
};

//Trabajador
export const trabajadorRequired = async (req, res, next) => {
    try {
        const connection = await db();

        // Consultar el rol del usuario en la tabla usuario_rol
        const [result] = await connection.execute(
            `SELECT r.id_rol
             FROM usuario_rol ur
             JOIN roles r ON ur.id_rol = r.id_rol
             WHERE ur.id_usuario = ?`,
            [req.user.id_usuario]
        );

        // Verificar si el usuario tiene el rol de administrador (id_rol = 1)
        const userRole = result[0]?.id_rol;
        if (userRole !== 3) {
            return res.status(403).json({ message: 'Acceso denegado: Solo el trabajador puede acceder a esta ruta' });
        }

        next(); // Permitir acceso a la siguiente función si es administrador
    } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
        res.status(500).json({ message: 'Error interno al verificar el rol' });
    }
};