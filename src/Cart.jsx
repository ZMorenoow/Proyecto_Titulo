import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { initialOptions, createOrder, onApprove } from "../server/controllers/pagos/paypal.js";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import './CSS/carro.css';

const Cart = () => {
    // Estado inicial del carrito
    const initialCart = [
        { id: 1, title: "Producto Limpieza de Piso", price: 1000, quantity: 1 },
        { id: 2, title: "Producto Limpieza Alfombra", price: 1500, quantity: 1 },
    ];

    const [cart, setCart] = useState(initialCart);
    const [total, setTotal] = useState(0);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false); // Controla la visibilidad de las opciones de pago
    const [preferenceId, setPreferenceId] = useState(null); // Controla el ID de preferencia de Mercado Pago

    // Inicializar Mercado Pago
    initMercadoPago("APP_USR-35a3f979-d2ec-4856-aa93-41e176c1aa88", { locale: "es-CL" });

    useEffect(() => {
        // Calcular el total
        const calculatedTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(calculatedTotal);
    }, [cart]);

    const handleQuantityChange = (id, delta) => {
        setCart(prevCart => prevCart.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const handlePaymentClick = async () => {
        // Generar preferencia para Mercado Pago y mostrar opciones de pago
        try {
            const response = await axios.post("http://localhost:3000/create_preference", {
                title: "Compra en W&W",
                quantity: 1,
                price: total
            });
            setPreferenceId(response.data.id); // Almacenar ID de preferencia
            setShowPaymentOptions(true); // Mostrar opciones de pago
        } catch (error) {
            console.error("Error al procesar el pago con Mercado Pago", error);
        }
    };

    return (
        <div className = "cart-container" style={{ padding: "20px" }}>
            <h2>Carrito de Compras</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.id} style={{ marginBottom: "10px" }}>
                        {item.title} - ${item.price} x {item.quantity}
                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    </li>
                ))}
            </ul>
            <h3>Total: ${total}</h3>

            <div style={{ marginTop: "20px" }}>
                {!showPaymentOptions ? (
                    <button onClick={handlePaymentClick} style={{ marginRight: "10px" }}>
                        Pagar
                    </button>
                ) : (
                    <div>
                        {/* Mercado Pago */}
                        {preferenceId && (
                            <Wallet
                                initialization={{ preferenceId: preferenceId }}
                                customization={{ texts: { valueProp: 'smart_option' } }}
                            />
                        )}
                        
                        {/* PayPal */}
                        <PayPalScriptProvider options={initialOptions}>
                        <PayPalButtons
                                style={{
                                    layout: "horizontal",
                                    color: "blue",
                                    shape: "rect",
                                    label: "paypal"
                                }}
                                createOrder={async (data, actions) => await createOrder(data, actions, total, cart)} // Pasa el cart
                                onApprove={onApprove}
                            />
                        </PayPalScriptProvider>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;