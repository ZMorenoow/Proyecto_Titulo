import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './utils/AuthContext.jsx';
import { login } from './service/auth.service.js';
import { decodeToken } from './service/helpers.js';  // Importamos la función decodeToken
import './CSS/login.css';  

const Login = () => {
    const { isAuthenticated, login: authenticate } = useAuth();
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const messageFromUrl = queryParams.get('message');
        if (messageFromUrl) {
            setMessage(decodeURIComponent(messageFromUrl));
            navigate('/login', { replace: true });
        }
    }, [location.search, navigate]);

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        const result = await login({ correo, contrasena });
        if (result.error) {
            setError(result.message);
        } else {
            // Decodificamos el token JWT para extraer el rol
            const decodedToken = decodeToken(result.token);  // Usamos decodeToken aquí
            if (decodedToken) {
                const rol = decodedToken.rol;  // Obtenemos el rol del token
                authenticate(result.token, rol);  // Pasamos el token y rol al contexto de autenticación
                navigate('/');  // Redirigimos al home
            } else {
                setError('Error al decodificar el token.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-left">
                    <h1>Iniciar sesión</h1>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <label>Correo electrónico</label>
                        <input className="login"
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                        <label>Contraseña</label>
                        <input className="login"
                            type="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                    <a href="#">Olvidaste tu contraseña?</a>
                </div>
                <div className="login-right">
                    <h2>Bienvenido!</h2>
                    <p>Ingresa tus datos y conoce el mundo de la limpieza</p>
                    <button onClick={() => navigate('/registro')}>Registrarse</button>
                </div>
            </div>
        </div>
    );
};

export default Login;