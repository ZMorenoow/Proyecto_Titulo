import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import  db  from '../configs/db.js';
import { sendEmail } from '../utils/email.js';


// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    const { nombre, apellido, correo, telefono, direccion, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !telefono || !direccion || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const connection = await db();

        const [existingUser] = await connection.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashedContrasena = await bcrypt.hash(contrasena, 10);
        const verificationToken = uuidv4();
        const verificationUrl = `http://localhost:3000/auth/verify/${verificationToken}`;

        const [result] = await connection.execute(
            'INSERT INTO usuario (nombre, apellido, correo, telefono, direccion, contrasena, email_verificado, verificacion_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, correo, telefono, direccion, hashedContrasena, false, verificationToken]
        );

        // Asignar rol '2' (usuario) en usuario_rol
        const userId = result.insertId;
        await connection.execute(
            'INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)',
            [userId, 2]
        );

        const emailSubject = 'Verificación de cuenta en WatchyWash';
        const emailContent = `<p>Haga clic en el siguiente enlace para verificar su cuenta: <a href="${verificationUrl}">${verificationUrl}</a></p>`;
        await sendEmail(correo, emailSubject, emailContent);

        res.status(201).json({
            message: 'Usuario registrado con éxito. Por favor, verifique su correo electrónico.',
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    try {
        const connection = await db();

        const [user] = await connection.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const existingUser = user[0];
        const contrasenaMatch = await bcrypt.compare(contrasena, existingUser.contrasena);
        if (!contrasenaMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        if (!existingUser.email_verificado) {
            return res.status(403).json({ message: 'Cuenta no verificada. Por favor, verifique su correo.' });
        }

        // Obtener el rol del usuario
        const [userRole] = await connection.execute(
            'SELECT r.rol FROM roles r JOIN usuario_rol ur ON r.id_rol = ur.id_rol WHERE ur.id_usuario = ?',
            [existingUser.id_usuario]
        );

        const rol = userRole[0]?.rol || 'usuario';

        // Generar el token JWT con el rol
        const token = jwt.sign(
            { id_usuario: existingUser.id_usuario, correo: existingUser.correo, rol },
            "1q2w3e4r5t6y7u8i9o0p!@$%^&*_+QWERTYUIOP|:<>?asdfghjklzxcvbnmASDFGHJKLZXCVBNM",
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: 'Login exitoso',
            token,
        });

    } catch (error) {
        console.error('Error al hacer login:', error);
        res.status(500).json({ message: 'Error al hacer login' });
    }
};


// Verificar el correo del usuario
export const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;

    try {
        // Conectar a la base de datos
        const connection = await db();

        // Buscar al usuario con el token de verificación
        const [user] = await connection.execute('SELECT * FROM usuario WHERE verificacion_token = ?', [verificationToken]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Token de verificación inválido o expirado' });
        }

        const existingUser = user[0];

        // Actualizar el estado de verificación del usuario
        await connection.execute(
            'UPDATE usuario SET email_verificado = ?, verificacion_token = ? WHERE id_usuario = ?',
            [true, null, existingUser.id_usuario]
        );

        // Redirigir a la página de login con un mensaje de éxito
        res.redirect('http://localhost:5173/login?message=Confirmación%20Exitosa');
    } catch (error) {
        console.error('Error al verificar el correo:', error);
        res.status(500).json({ message: 'Error al verificar el correo' });
    }
};

//Obtener datos del usuario
export const getMe = async (req, res) => {
    try {
        // 1. Obtener el token desde el encabezado Authorization
        const token = req.headers['authorization']?.split(' ')[1];  // 'Bearer token'

        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        // 2. Verificar el token JWT
        const decoded = jwt.verify(token,"1q2w3e4r5t6y7u8i9o0p!@$%^&*_+QWERTYUIOP|:<>?asdfghjklzxcvbnmASDFGHJKLZXCVBNM");

        // 3. Conectar a la base de datos
        const connection = await db();

        // 4. Obtener los datos del usuario desde la base de datos usando el ID del usuario del token
        const [user] = await connection.execute('SELECT id_usuario, nombre, apellido, correo, telefono, direccion FROM usuario WHERE id_usuario = ?', [decoded.id_usuario]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 5. Devolver los datos del usuario
        res.status(200).json(user[0]);

    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ message: 'Error interno al obtener los datos del usuario' });
    }
};