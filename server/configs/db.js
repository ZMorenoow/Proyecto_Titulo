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

export default db;
