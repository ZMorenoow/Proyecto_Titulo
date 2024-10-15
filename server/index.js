import express from "express";
import { MercadoPagoConfig, Preference } from 'mercadopago'; 
import cors from "cors";

// Configura Mercado Pago
const client = new MercadoPagoConfig({ accessToken: "APP_USR-3603337471654012-101417-73046df5da2f0ca7e92fab28b8fbc592-2035500959", });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
    console.log('Servidor está corriendo en el puerto ${port}');
});
