import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useState } from 'react';

const Producto = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    
    // Inicializar Mercado Pago
    initMercadoPago("APP_USR-35a3f979-d2ec-4856-aa93-41e176c1aa88", { locale: "es-CL" });

    const createPreference = async () => {
        try {
            const response = await axios.post("http://localhost:3000/create_preference", {
                title: "Limpieza de Piso",
                quantity: 1,
                price: 100,
            });

            const { id } = response.data;
            return id; 
        } catch (error) {
            console.error("Error al crear preferencia:", error);
            return null; // Devolver null si hay un error
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            setPreferenceId(id);
        }
    };

    return (
        <div className="card-product-container">
            <img src="ruta/a/tu/imagen.jpg" alt="Descripción del producto" className="product-image" />
            <h2>Nombre del Producto</h2>
            <p>Descripción breve del producto.</p>
            <p className='price'>100$</p>
            <button onClick={handleBuy}>Comprar</button>
            {preferenceId && (
                <Wallet
                    initialization={{ preferenceId: preferenceId }} // Corregido: pasamos el valor de preferenceId
                    customization={{ texts: { valueProp: 'smart_option' } }}
                />
            )}
        </div>
    );
}

export default Producto;