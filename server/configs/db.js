import mysql from 'mysql2/promise';

// Crear la conexión a la base de datos
const db = async () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'proyecto_titulo',
    });
};

// Obtener los servicios desde la base de datos
const getServicios = async () => {
    const connection = await db();
    const [rows] = await connection.execute('SELECT id_servicio, descripcion_servicio, nombre_servicio, imagen_servicio FROM servicios');
    connection.end();
    return rows;
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
        especificaciones_adicionales,
        valor
    } = cotizacion;

    const query = `
        INSERT INTO cotizaciones 
        (id_servicio, cantidad, medidas, material, estado_producto, antiguedad, especificaciones_adicionales, valor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        // Insertar la cotización
        const [result] = await connection.execute(query, [
            id_servicio, 
            cantidad, 
            medidas, 
            material, 
            estado_producto, 
            antiguedad, 
            especificaciones_adicionales,
            valor
        ]);

        // Obtener la última ID insertada
        const [rows] = await connection.execute('SELECT LAST_INSERT_ID() AS id');
        const lastInsertId = rows[0].id;

        return { insertId: lastInsertId, affectedRows: result.affectedRows };
    } catch (error) {
        console.error('Error al insertar cotización:', error);
        throw new Error('Error al insertar cotización en la base de datos: ' + error.message);
    } finally {
        connection.end(); // Asegura que siempre se cierre la conexión
    }
};

export { getServicios, insertCotizacion };
export default db;