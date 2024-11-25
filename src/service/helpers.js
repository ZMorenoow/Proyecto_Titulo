import { axiosInstance } from "../service/auth.service.js";

export function setToken(token) {
  localStorage.setItem("token", token);
  axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export function removeToken() {
  localStorage.removeItem("token");
  axiosInstance.defaults.headers["Authorization"] = "";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  removeToken();
  axiosInstance.defaults.headers["Authorization"] = "";
  localStorage.removeItem("verified");
}

// Función para decodificar el token JWT
export function decodeToken(token) {
  try {
    // Dividir el token en sus tres partes (encabezado, payload, firma)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodificar de Base64 a UTF-8
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    // Convertir el JSON a un objeto
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
}
