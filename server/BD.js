const mysql = require('mysql2');

// Función para crear una conexión a la base de datos
const createConnection = () => {
    const connection = mysql.createConnection({
        host: 'localhost', 
        user: 'root', 
        database: 'proyecto_titulo' 
    });

    connection.connect(err => {
        if (err) {
            console.error(`Error al conectar a MySQL: ${err.message}`);
            return null;
        }
        console.log("Conexión exitosa a la base de datos 'proyecto_titulo'");
    });

    return connection;
};

// Función para cerrar la conexión
const closeConnection = (connection) => {
    if (connection) {
        connection.end(err => {
            if (err) {
                console.error(`Error al cerrar la conexión: ${err.message}`);
            } else {
                console.log("Conexión cerrada correctamente");
            }
        });
    }
};

// Uso del código para probar la conexión
if (require.main === module) {
    const conn = createConnection();
    if (conn) {
        
        closeConnection(conn);
    }
}
