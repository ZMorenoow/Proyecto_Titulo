import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../service/helpers.js'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializar el estado a partir del token almacenado y el rol en el localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [rol, setRol] = useState(localStorage.getItem('rol') || ''); 

  useEffect(() => {
    // Si no hay token, el usuario no está autenticado
    if (!getToken()) {
      setIsAuthenticated(false);
      setRol(''); // Limpia el rol si no hay token
    }
  }, []); // Esto solo se ejecuta una vez al montar el componente

  // Función para iniciar sesión
  const login = (token, userRol) => {
    setToken(token); // Guardamos el token
    localStorage.setItem('rol', userRol); // Guardamos el rol en localStorage
    setRol(userRol); // Actualizamos el estado del rol
    setIsAuthenticated(true); // Marcamos como autenticado
  };

  // Función para cerrar sesión
  const logout = () => {
    removeToken(); // Elimina el token del almacenamiento
    localStorage.removeItem('rol'); // Elimina el rol del almacenamiento
    setRol(''); // Limpiamos el estado del rol
    setIsAuthenticated(false); // Marcamos como no autenticado
  };

  // Función para obtener el token almacenado
  const fetchToken = () => {
    return getToken(); // Recupera el token desde el almacenamiento local o cualquier método que uses
  };

  // El contexto ahora incluye isAuthenticated, rol, login, logout y fetchToken
  return (
    <AuthContext.Provider value={{ isAuthenticated, rol, login, logout, fetchToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
