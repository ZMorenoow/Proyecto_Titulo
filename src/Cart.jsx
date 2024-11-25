import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './CSS/carro.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

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
        navigate("/reservas", { state: { totalCarrito: total, carrito: cart } });
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
            <button
                onClick={handleReserva}
                disabled={total === 0} // Botón deshabilitado si el total es 0
                style={{
                    backgroundColor: total === 0 ? "#ccc" : "#007bff",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: total === 0 ? "not-allowed" : "pointer",
                    marginTop: "10px",
                }}
            >
                Ir a Reservas
            </button>
            {total === 0 && (
                <p style={{ color: "red", marginTop: "10px" }}>
                    Tu carrito está vacío. Agrega servicios para continuar.
                </p>
            )}
        </div>
    );
};

export default Cart;
