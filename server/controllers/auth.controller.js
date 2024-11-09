import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import  db  from '../configs/db.js';
import { sendEmail } from '../utils/email.js';  // Asegúrate de tener la función sendEmail configurada

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    const { nombre, apellido, correo, telefono, direccion, contrasena } = req.body;

    // Validación de datos (puedes agregar más validaciones según sea necesario)
    if (!nombre || !apellido || !correo || !telefono || !direccion || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Conectar a la base de datos
        const connection = await db();

        // Verificar si el correo ya está registrado
        const [existingUser] = await connection.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        const hashedContrasena = await bcrypt.hash(contrasena, 10);

        // Generar un token de verificación de correo
        const verificationToken = uuidv4();
        const verificationUrl = `http://localhost:3000/auth/verify/${verificationToken}`;

        // Insertar el nuevo usuario en la base de datos (id_rol = 2 por defecto)
        const [result] = await connection.execute(
            'INSERT INTO usuario (nombre, apellido, correo, telefono, direccion, contrasena, email_verificado, verificacion_token, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, correo, telefono, direccion, hashedContrasena, false, verificationToken, 2]
        );

        // Enviar el correo de verificación
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

    // Validación de datos
    if (!correo || !contrasena) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    try {
        // Conectar a la base de datos
        const connection = await db();

        // Buscar el usuario por correo
        const [user] = await connection.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const existingUser = user[0];

        // Verificar si la contraseña es correcta
        const contrasenaMatch = await bcrypt.compare(contrasena, existingUser.contrasena);
        if (!contrasenaMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Verificar si el correo ha sido verificado
        if (!existingUser.email_verificado) {
            return res.status(403).json({ message: 'Cuenta no verificada. Por favor, verifique su correo.' });
        }

        // Generar el token JWT para la autenticación
        const token = jwt.sign(
            { id_usuario: existingUser.id_usuario, correo: existingUser.correo, id_rol: existingUser.id_rol },
            "1q2w3e4r5t6y7u8i9o0p!@$%^&*_+QWERTYUIOP|:<>?asdfghjklzxcvbnmASDFGHJKLZXCVBNM",
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: 'Login exitoso',
            token, // El token JWT se envía al cliente
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
        const [user] = await connection.execute('SELECT id_usuario, nombre, apellido, correo, telefono, direccion, id_rol FROM usuario WHERE id_usuario = ?', [decoded.id_usuario]);

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