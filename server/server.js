import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import './configs/passport.js';
import routes from './routes/auth.router.js';

// Configura Mercado Pago
const client = new MercadoPagoConfig({ accessToken: "APP_USR-3603337471654012-101417-73046df5da2f0ca7e92fab28b8fbc592-2035500959", });

// Inicializa la aplicación Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configura la sesión
app.use(session({
    secret: "9bf1c2a7a3e5b708b1e8790b5c9d8f17a6c20e6bd3d1c5d17d3e3a4cb9f59a47",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Configura Passport para autenticación
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
app.use('/auth', routes);

// Ruta principal de prueba
app.get("/", (req, res) => {
    res.send("Soy el server :) ");
});

// Crear conexión a la base de datos
const createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'proyecto_titulo'
    });
};


app.get("/", (req, res) => {
    res.send("Soy el server :) ");
});

app.post("/create_preference", async (req, res) => {
    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "CLP", 
                },
            ],
            back_urls: {
                success: "http://localhost:5173/Success", 
                failure: "http://localhost:5173/producto", 
                pending: "", 
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        res.json({
            id: result.id,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia",
        });
    }
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
                id_rol: usuario.id_rol
            }));
            res.status(200).json(usuariosList);
        });
    });
});


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
