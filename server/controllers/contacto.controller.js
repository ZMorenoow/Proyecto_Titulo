import db from '../configs/db.js';
import { sendEmailContact } from '../utils/email.js';
import { generateContactEmail } from '../templates/emailTemplate.js';


export const enviarReclamo = async (req, res) => {
  const id_usuario = req.user.id_usuario;
  const email_usuario = req.user.correo;
  const { id_categoria, asunto, descripcion } = req.body;

  if (!id_categoria || !asunto || !descripcion) {
    return res.status(400).json({ message: 'Faltan parámetros requeridos (id_categoria, asunto, descripcion)' });
  }

  const emailSubject = asunto;
  const emailContent = generateContactEmail (email_usuario, asunto, descripcion);

  const connection = await db();

  try {
    await sendEmailContact(email_usuario, emailSubject, emailContent);

    const [result] = await connection.execute(
      `INSERT INTO contacto (id_usuario, id_categoria, asunto, descripcion) 
      VALUES (?, ?, ?, ?)`,
      [id_usuario, id_categoria, asunto, descripcion]
    );

    console.log(email_usuario);
    res.status(201).json({ message: 'Reclamo enviado exitosamente', id_reclamo: result.insertId });
  } catch (error) {
    console.log(email_usuario);
    console.error('Error al enviar el reclamo:', error);
    res.status(500).json({ message: 'Error interno al enviar el reclamo' });
  }
};


export const guardarValoracion = async (req, res) => {
  const { calificacion, comentario } = req.body;
  const id_usuario = req.user?.id_usuario; 

  // Validaciones básicas
  if (!calificacion || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ message: 'Calificación inválida. Debe estar entre 1 y 5.' });
  }

  if (!id_usuario) {
    return res.status(400).json({ message: 'No se pudo obtener el ID del usuario' });
  }

  try {
    const connection = await db();

    // Insertar la valoración en la base de datos
    const [result] = await connection.execute(
      `INSERT INTO valoracion (id_usuario, calificacion, comentario, fecha)
       VALUES (?, ?, ?, NOW())`,
      [id_usuario, calificacion, comentario || null]
    );

    res.status(201).json({
      message: 'Valoración agregada exitosamente',
      id_valoracion: result.insertId,
    });
  } catch (error) {
    console.error('Error al agregar la valoración:', error);
    res.status(500).json({ message: 'Error interno al agregar la valoración' });
  }
};

// Obtener todas las valoraciones
export const obtenerValoraciones = async (req, res) => {
  try {
    const connection = await db();

    // Consultar todas las valoraciones
    const [valoraciones] = await connection.execute(
      `SELECT v.id_valoracion, v.calificacion, v.comentario, v.fecha, u.nombre AS usuario
       FROM valoracion v
       JOIN usuario u ON v.id_usuario = u.id_usuario
       ORDER BY v.fecha DESC`
    );
    console.log('Valoraciones obtenidas:', valoraciones);

    res.status(200).json({ valoraciones });
  } catch (error) {
    console.error('Error al obtener las valoraciones:', error);
    res.status(500).json({ message: 'Error interno al obtener las valoraciones' });
  }
};