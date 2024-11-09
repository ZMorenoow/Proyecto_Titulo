import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './utils/AuthContext.jsx';
import { login } from './service/auth.service.js';

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
            authenticate(result.token);
            navigate('/');
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            {message && <p style={{ color: 'green' }}>{message}</p>} 
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo electrónico:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;