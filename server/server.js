import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';

// Inicializa la aplicación Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Crear conexión a la base de datos
const createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'proyecto_titulo'
    });
};

// Ruta para registro de usuario
app.post('/register', (req, res) => {
    const data = req.body;

    // Validación
    const requiredFields = ['nombre_cliente', 'correo_cliente', 'contraseña_cliente', 'direccion_cliente', 'numero_cliente', 'id_rol'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido.` });
        }
    }

    const { nombre_cliente, correo_cliente, contraseña_cliente, direccion_cliente, numero_cliente, id_rol } = data;

    const connection = createConnection();

    connection.connect(err => {
        if (err) return res.status(500).json({ error: err.message });

        // Validar si el correo ya existe
        connection.query('SELECT * FROM usuario WHERE correo_cliente = ?', [correo_cliente], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(409).json({ error: 'El correo ya está registrado.' });
            }

            // Inserción de usuario
            connection.query(
                'INSERT INTO usuario (nombre_cliente, correo_cliente, contraseña_cliente, direccion_cliente, numero_cliente, id_rol) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre_cliente, correo_cliente, contraseña_cliente, direccion_cliente, numero_cliente, id_rol],
                (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({ message: 'Registro exitoso' });
                }
            );
        });
    });
});

// Ruta para inicio de sesión
app.post('/login', (req, res) => {
    const { correo_cliente, contraseña_cliente } = req.body;

    const connection = createConnection();

    connection.connect(err => {
        if (err) return res.status(500).json({ error: err.message });

        connection.query(
            'SELECT * FROM usuario WHERE correo_cliente = ? AND contraseña_cliente = ?',
            [correo_cliente, contraseña_cliente],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });

                if (results.length > 0) {
                    return res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: results[0] });
                } else {
                    return res.status(401).json({ error: 'Credenciales incorrectas' });
                }
            }
        );
    });
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    const connection = createConnection();

    connection.connect(err => {
        if (err) return res.status(500).json({ error: err.message });

        connection.query('SELECT * FROM usuario', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const usuariosList = results.map(usuario => ({
                id_cliente: usuario.id_cliente,
                nombre_cliente: usuario.nombre_cliente,
                correo_cliente: usuario.correo_cliente,
                direccion_cliente: usuario.direccion_cliente,
                numero_cliente: usuario.numero_cliente,
                id_rol: usuario.id_rol,
            }));

            res.status(200).json(usuariosList);
        });
    });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
