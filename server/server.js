import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import authRoutes from '../server/routes/auth.router.js';
import { getServicios,insertCotizacion } from './configs/db.js'; // Importamos la función para obtener servicios
import { fileURLToPath } from 'url';
import path from 'path';




const app = express();
// Configura Mercado Pago
const client = new MercadoPagoConfig({ accessToken: "APP_USR-3603337471654012-101417-73046df5da2f0ca7e92fab28b8fbc592-2035500959", });

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

// Ruta principal de prueba
app.get("/", (req, res) => {
    res.send("Soy el server :) ");
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Ruta para obtener los servicios desde la base de datos
app.get("/servicios", async (req, res) => {
    try {
        const servicios = await getServicios(); // Obtener los servicios desde la base de datos
        res.json(servicios); // Devolver los servicios como respuesta JSON
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        res.status(500).json({ error: "Error al obtener los servicios" });
    }
});
// Ruta para recibir y guardar la cotizacion en la base de datos
app.post('/cotizaciones', async (req, res) => {
    console.log('Datos recibidos:', req.body); // Aquí deberías ver los datos enviados desde el frontend

    try {
        const result = await insertCotizacion(req.body);  // Pasa solo los datos de la cotización
        res.json({ message: 'Cotización insertada correctamente', result });
    } catch (error) {
        console.error('Error al insertar cotización:', error);
        res.status(500).json({ message: 'Error al insertar cotización', error });
    }
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

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});