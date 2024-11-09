import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from './service/auth.service.js';

const Cuenta = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getMe();
                if (data.error) {
                    throw new Error(data.message);
                }
                setUserData(data); 
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
            <div className="profile-info">
                <p><strong>Nombre:</strong> {userData.nombre}</p>
                <p><strong>Apellido:</strong> {userData.apellido}</p>
                <p><strong>Email:</strong> {userData.correo}</p>
                <p><strong>Dirección:</strong> {userData.direccion}</p>
            </div>
        </div>
    );
};

export default Cuenta;