import mysql from 'mysql2/promise';

// Crear la conexión a la base de datos
const db = async () => {
    return mysql.createConnection({
        host: 'localhost',   // Cambia estos valores según tu configuración
        user: 'root',        // Nombre de usuario
        password: '',        // Contraseña
        database: 'proyecto_titulo', // Nombre de la base de datos
    });
};
//Obtener los servicios desde la base de datos
const getServicios = async () => {
    const connection = await db();
    const [rows] = await connection.execute('SELECT id_servicio, descripcion_servicio, nombre_servicio, imagen_servicio FROM servicios'); // Consulta SQL para obtener los servicios
    connection.end(); // Cerrar la conexión después de la consulta
    return rows; // Devuelve los servicios obtenidos
};

const insertCotizacion = async (cotizacion) => {
    const connection = await db();

    const { 
        id_servicio, 
        cantidad, 
        medidas, 
        material, 
        estado_producto, 
        antiguedad, 
        especificaciones_adicionales 
    } = cotizacion;

    const query = `
        INSERT INTO cotizaciones 
        (id_servicio, cantidad, medidas, material, estado_producto, antiguedad, especificaciones_adicionales)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await connection.execute(query, [
            id_servicio, 
            cantidad, 
            medidas, 
            material, 
            estado_producto, 
            antiguedad, 
            especificaciones_adicionales
        ]);

        connection.end();
        
        return result;  // Devuelve el resultado de la inserción
    } catch (error) {
        throw new Error('Error al insertar cotización en la base de datos: ' + error.message);
    }
};

export { getServicios, insertCotizacion };
export default db; 