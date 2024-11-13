import jwt from 'jsonwebtoken';

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