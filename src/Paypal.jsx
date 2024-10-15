import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButtonComponent = () => {
    const initialOptions = {
        clientId: "AYocrkJ-mwSewbAL8rgpPWZ8RHHhqT3ydZ-JQlvGo24xUuaH4ebFaQrVnxqdneGsetY5FFIhJ3aIZWZa",
        currency: "USD",
        intent: "capture"
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "5.00"
                    }
                }
            ]
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(function(details) {
            alert("Transacción completada por " + details.payer.name.given_name);
        });
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                    src="URL_DE_TU_IMAGEN" // Reemplaza con la URL de tu imagen
                    alt="Descripción del producto"
                    style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                />
                <p>Descripción del producto o servicio que estás vendiendo.</p>
            </div>
            <PayPalButtons
                style={{
                    layout: "horizontal",
                    color: "blue",
                    shape: "rect",
                    label: "paypal"
                }}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </PayPalScriptProvider>
    );
};

function Paypal() {
    return (
        <>
            <PayPalButtonComponent />
        </>
    );
}

export default Paypal;
