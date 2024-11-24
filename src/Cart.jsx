import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './CSS/carro.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:3000/carrito/obtener", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCart(response.data.carrito);
            } catch (error) {
                console.error("Error al obtener el carrito:", error);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        // Calcular el total
        const calculatedTotal = cart.reduce((acc, item) => acc + item.valor * item.cantidad, 0);
        setTotal(calculatedTotal);
    }, [cart]);

    const handleReserva = () => {
        navigate("/reservas"); // Redirige a la ruta de reservas
    };

    const handleEliminar = async (id_carrito) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "http://localhost:3000/carrito/eliminar",
                { id_carrito },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCart(cart.filter(item => item.id_carrito !== id_carrito));
        } catch (error) {
            console.error("Error al eliminar el artículo del carrito:", error);
        }
    };

    return (
        <div className="cart-container" style={{ padding: "20px" }}>
            <h2>Carrito de Compras</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.id_carrito} style={{ marginBottom: "10px" }}>
                        {item.nombre_servicio} - ${item.valor} x {item.cantidad} = ${item.valor * item.cantidad}
                        <button
                            onClick={() => handleEliminar(item.id_carrito)}
                            style={{
                                marginLeft: "10px",
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer"
                            }}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
            <h3>Total: ${total}</h3>
            <button onClick={handleReserva}>Ir a Reservas</button>
        </div>
    );
};

export default Cart;

