// paypal.js
import axios from "axios";

export const initialOptions = {
    clientId: "AYocrkJ-mwSewbAL8rgpPWZ8RHHhqT3ydZ-JQlvGo24xUuaH4ebFaQrVnxqdneGsetY5FFIhJ3aIZWZa",
    currency: "USD",
    intent: "capture"
};

// Convertir el total de CLP a USD
export const getExchangeRate = async () => {
    try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/CLP");
        return response.data.rates.USD; // Retorna la tasa de CLP a USD
    } catch (error) {
        console.error("Error al obtener el tipo de cambio", error);
        return 1; // Retorna 1 como fallback en caso de error
    }
};

export const createOrder = async (data, actions, totalCLP, cart) => {
    console.log(`Total en CLP: ${totalCLP}`); // Verifica el total en CLP
    const exchangeRate = await getExchangeRate();
    console.log("Tasa de cambio CLP a USD:", exchangeRate); // Verifica la tasa de cambio

    // Cambia la línea de conversión a USD
    const totalUSD = (totalCLP * exchangeRate).toFixed(2); // Multiplica, no dividas
    console.log(`Total en USD: ${totalUSD}`); // Verifica el total en USD

    // Crear una descripción de los productos
    const productDescriptions = cart.map(item => `${item.title} (x${item.quantity})`).join(", ");

    return actions.order.create({
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: totalUSD // Usa el valor convertido
                },
                description: `Compra de productos: ${productDescriptions}` // Agrega la descripción aquí
            }
        ]
    });
};

export const onApprove = async (data, actions) => {
    try {
        const details = await actions.order.capture();
        alert("Transacción completada por " + details.payer.name.given_name);

        const token = localStorage.getItem("token");

        await axios.put(
            "http://localhost:3000/carrito/pagar",
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {
        console.error("Error al completar la transacción:", error);
        alert("Hubo un error al procesar la transacción.");
    }
};

