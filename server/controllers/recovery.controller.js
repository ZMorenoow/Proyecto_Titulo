import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../configs/db.js';
import { sendEmail } from '../utils/email.js';

// Generar un token aleatorio
const generateToken = (length) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (req, res) => {
  const { correo } = req.body;

  try {
    const connection = await db();
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const resetToken = generateToken(8);
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    await connection.execute(
      'UPDATE usuario SET reset_password_token = ?, reset_password_expires = ? WHERE correo = ?',
      [resetToken, resetTokenExpires, correo]
    );

    const emailSubject = 'Restablecimiento de contraseña de WatchyWash';

    const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://lh3.googleusercontent.com/d/19g5PHrc1uDN4Wn4cfhH8XUW3MiomTwdh" alt="WatchyWash" style="width: 150px;"/>
            </div>
            <h1 style="color: #4CAF50; text-align: center;">Restablecimiento de Contraseña</h1>
            <p style="font-size: 16px; text-align: justify;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en WatchyWash. Si no realizaste esta solicitud, por favor ignora este correo. De lo contrario, usa el siguiente código para completar el proceso de restablecimiento.
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; font-weight: bold; background-color: #f9f9f9; padding: 10px 20px; border: 1px solid #ddd; display: inline-block; border-radius: 5px;">
                    ${resetToken}
                </p>
            </div>
            <p style="font-size: 14px; text-align: justify; color: #666;">
                Si necesitas más ayuda, no dudes en ponerte en contacto con nuestro equipo de soporte.
            </p>
            <hr style="border: 1px solid #ddd; margin: 20px 0;"/>
            <p style="font-size: 14px; text-align: center; color: #999;">
                Este mensaje fue enviado por WatchyWash. Si no esperabas este correo, por favor ignóralo.
            </p>
            <div style="text-align: center; margin-top: 10px; font-size: 12px; color: #666;">
                <p>© 2024 WatchyWash. Todos los derechos reservados.</p>
            </div>
        </div>
    `;


    await sendEmail(correo, emailSubject, emailContent);

    res.status(200).json({ message: 'Se ha enviado un token de restablecimiento de contraseña a su correo electrónico.' });
  } catch (error) {
    console.error('Error solicitando el restablecimiento de contraseña:', error);
    res.status(500).json({ message: 'Error al solicitar el restablecimiento de la contraseña' });
  }
};

// Verificar token de restablecimiento de contraseña
export const verifyResetToken = async (req, res) => {
  const { token } = req.body;

  try {
    const connection = await db();
    const [rows] = await connection.execute(
      'SELECT * FROM usuario WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ valid: false, message: 'Token inválido o expirado' });
    }

    res.status(200).json({ valid: true, message: 'Token válido' });
  } catch (error) {
    console.error('Error verificando el token:', error);
    res.status(500).json({ valid: false, message: 'Error al verificar el token' });
  }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
  const { token, nuevaContrasena } = req.body;

  try {
    const connection = await db();
    const [rows] = await connection.execute(
      'SELECT * FROM usuario WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Token de restablecimiento de contraseña inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    await connection.execute(
      'UPDATE usuario SET contrasena = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE reset_password_token = ?',
      [hashedPassword, token]
    );

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};
