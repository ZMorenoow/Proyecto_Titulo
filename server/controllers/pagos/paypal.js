import axios from "axios";

export const initialOptions = {
    clientId: "AYocrkJ-mwSewbAL8rgpPWZ8RHHhqT3ydZ-JQlvGo24xUuaH4ebFaQrVnxqdneGsetY5FFIhJ3aIZWZa",
    currency: "USD",
    intent: "capture"
};

// Convertir el total de CLP a USD usando mindicador.cl
export const getExchangeRate = async () => {
    try {
        const response = await axios.get("https://mindicador.cl/api/dolar");
        return response.data.serie[0].valor; // Extrae el valor del dólar desde la respuesta
    } catch (error) {
        console.error("Error al obtener el tipo de cambio", error);
        return 1; // Retorna 1 como fallback en caso de error
    }
};

export const createOrder = async (data, actions, totalCLP, cart) => {
    console.log(`Total en CLP: ${totalCLP}`);
    const exchangeRate = await getExchangeRate();
    console.log("Tasa de cambio CLP a USD:", exchangeRate);

    const totalUSD = (totalCLP / exchangeRate).toFixed(2);
    console.log(`Total en USD: ${totalUSD}`);

    const productDescriptions = cart
        .map(item => {
            const nombre = item.nombre_servicio || "Producto sin nombre";
            const cantidad = item.cantidad || 1;
            return `${nombre} (x${cantidad})`;
        })
        .join(", ");

    return actions.order.create({
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: totalUSD
                },
                description: `Compra de productos: ${productDescriptions}`
            }
        ]
    });
};

export const onApprove = async (data, actions, requestData) => {
    try {
        const details = await actions.order.capture();
        alert("Transacción completada por " + details.payer.name.given_name);

        const token = localStorage.getItem("token");

        await axios.put(
            "http://localhost:3000/carrito/pagar",
            {
                ...requestData
            },
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
