import express from 'express';
import cors from 'cors';
import authRoutes from '../server/routes/auth.router.js';
import adminRoutes from '../server/routes/admin.router.js';
import trabajadorRoutes from '../server/routes/trabajador.router.js';
import carritoRoutes from '../server/routes/carrito.router.js';
import reservaRoutes from '../server/routes/reserva.router.js'
import { getServicios,insertCotizacion } from './configs/db.js'; 
import { fileURLToPath } from 'url';
import path from 'path';
import { geminiApiCall } from './utils/GeminiAPI.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/worker', trabajadorRoutes);
app.use('/carrito', carritoRoutes);
app.use('/reserva', reservaRoutes);

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
    try {
        const cotizacion = req.body;

        // Llamada a Gemini para calcular el valor
        const geminiValor = await geminiApiCall(cotizacion);

        // Asegurarse de que el valor calculado de Gemini sea un número
        const valorCalculado = parseFloat(geminiValor.replace(/[^0-9.-]+/g, ""));

        // Insertar la cotización con el valor calculado
        cotizacion.valor = valorCalculado;

        const { insertId } = await insertCotizacion(cotizacion);

        res.status(200).json({
            message: 'Cotización insertada correctamente',
            idCotizacion: insertId,
            precioFinal: valorCalculado
        });
    } catch (error) {
        console.error('Error al procesar la cotización:', error);
        res.status(500).json({ error: 'Error al procesar la cotización' });
    }
});


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
   console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



