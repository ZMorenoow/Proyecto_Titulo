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
        <div className="cart-container">
            <h2>Carrito de Compras</h2>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.id_carrito}>
                            <td>{item.nombre_servicio}</td>
                            <td>${item.valor}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.valor * item.cantidad}</td>
                            <td>
                            <button className="delete-button" onClick={() => handleEliminar(item.id_carrito)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="trash-icon"
                                    viewBox="0 0 100 120"
                                    width="48"
                                    height="48"
                                >
                                    
                                    <g className="trash-lid">
                                        <path
                                            d="M20 30 L80 30 Q90 30 85 20 L15 20 Q10 30 20 30"
                                            fill="#555"
                                            stroke="#333"
                                            strokeWidth="2"
                                        />
                                    </g>

                                    <g className="trash-body">
                                        <rect
                                            x="20"
                                            y="30"
                                            width="60"
                                            height="80"
                                            fill="#999"
                                            stroke="#333"
                                            strokeWidth="2"
                                            rx="10"
                                        />
                                       
                                        <line x1="35" y1="40" x2="35" y2="100" stroke="#ccc" strokeWidth="2" />
                                        <line x1="50" y1="40" x2="50" y2="100" stroke="#ccc" strokeWidth="2" />
                                        <line x1="65" y1="40" x2="65" y2="100" stroke="#ccc" strokeWidth="2" />
                                    </g>
                                </svg>
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>
            <br/>
            <h3 className="valor-total">Total: ${total}</h3>
            <br/>
            <button className="cart-button" onClick={handleReserva} disabled={total === 0}>Continuar compra</button>
            {total === 0 && (
                <p>
                    Tu carrito está vacío. Agrega servicios para continuar.
                </p>
            )}
        </div>
    );
};


export default Cart;