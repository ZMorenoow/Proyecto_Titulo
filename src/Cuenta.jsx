import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from './service/auth.service.js';
import './CSS/cuenta.css'


const Cuenta = () => {
    const [userData, setUserData] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getMe();
                if (data.error) {
                    throw new Error(data.message);
                }
                setUserData(data);
                setPurchases(data.compras || []); 
            } catch (error) {
                console.error('Error al obtener los datos del perfil:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    if (!userData) return <div>Cargando...</div>;

    return (
        <div className="container">
            <h2>Perfil de Usuario</h2>
            <div className="cards-container">
                {/* Tarjeta de perfil */}
                <div className="card profile-card">
                    <h3>Datos de Perfil</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" defaultValue={userData.nombre} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input type="text" id="apellido" defaultValue={userData.apellido} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Email</label>
                            <input type="email" id="correo" defaultValue={userData.correo} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="direccion">Dirección</label>
                            <input type="text" id="direccion" defaultValue={userData.direccion} />
                        </div>
                    </form>
                </div>

                {/* Tarjeta de compras */}
                <div className="card purchases-card">
                    <h3>Compras Realizadas</h3>
                    {purchases.length > 0 ? (
                        <ul>
                            {purchases.map((compra, index) => (
                                <li key={index}>{compra}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No has realizado ninguna compra.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cuenta;
