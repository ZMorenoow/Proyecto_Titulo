import React from 'react';
import { Navigate } from 'react-router-dom';  
import { useAuth } from './utils/AuthContext.jsx';

const PrivateRoute = ({ element, allowedRoles, ...rest }) => {
  const { isAuthenticated, rol } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigimos al login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(rol)) {
    // Si el rol no es permitido, redirigimos a la página principal
    return <Navigate to="/" />;
  }

  // Si está autorizado, mostramos el elemento de la ruta
  return element;  
};

export default PrivateRoute;
