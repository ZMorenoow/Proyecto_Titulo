import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "./service/auth.service.js";
import { useAuth } from "./utils/AuthContext.jsx"; 
import axios from "axios";
import "./CSS/cuenta.css";

const Cuenta = () => {
  const [userData, setUserData] = useState(null);
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();
  const { rol } = useAuth(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMe();
        if (data.error) {
          throw new Error(data.message);
        }
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
        navigate("/login");
      }
    };

    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/reserva/obtener", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservas(response.data.reservas || []);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
      }
    };

    fetchUserData();
    fetchReservas();
  }, [navigate]);

  if (!userData) return <div className="loading">Cargando...</div>;

  return (
    <div className="container-perfil">
      <h2 className="section-title">Mi Cuenta</h2>

      {/* Sección del perfil */}
      <div className="profile-card">
        <h3 className="card-title">Datos del Perfil</h3>
        <form className="profile-form">
          <div className="form-group-perfil">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" defaultValue={userData.nombre} disabled />
          </div>
          <div className="form-group-perfil">
            <label htmlFor="apellido">Apellido</label>
            <input type="text" id="apellido" defaultValue={userData.apellido} disabled />
          </div>
          <div className="form-group-perfil">
            <label htmlFor="correo">Email</label>
            <input type="email" id="correo" defaultValue={userData.correo} readOnly disabled />
          </div>
          <div className="form-group-perfil">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" id="direccion" defaultValue={userData.direccion} disabled />
          </div>
        </form>
      </div>

      {/* Mostrar la sección de pagos solo si el rol es Usuario */}
      {rol !== "Trabajador" && rol !== "Administrador" && (
        <>
          <h3 className="cart-title">Pagos Realizados</h3>
          <div className="pagos-container">
            {reservas.length > 0 ? (
              reservas.map((reserva, index) => (
                <div key={index} className="pagos-card">
                  <div className="pagos-header">
                    <strong>{reserva.nombre_destinatario}</strong>
                    <span className="pago-fecha">{new Date(reserva.fecha_reserva).toLocaleDateString()}</span>
                    <span className="pago-hora">{new Date(reserva.hora_reserva).toLocaleTimeString()}</span>
                  </div>
                  <div className="pago-detalles">
                    <p>
                      <strong>Servicio:</strong> {reserva.nombre_servicio}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {reserva.cantidad}
                    </p>
                    <p>
                      <strong>Monto Total:</strong> ${reserva.valor}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-pagos">No has realizado ningun pago.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cuenta;
