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

export default db;
