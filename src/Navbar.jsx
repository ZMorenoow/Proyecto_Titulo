import { useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  // Define las rutas en las que no quieres mostrar el navbar
  const hideNavbarRoutes = ['/register', '/login', '/producto', '/error', '/success', '/paypal'];
  
  // Verifica si la ruta actual está dentro de las rutas a ocultar
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null; // No renderiza el navbar
  }

  return (
    <nav>
      {/* Aquí va el contenido de tu navbar */}
      <a href="/">Inicio</a>
      <a href="/register">Registrarse</a>
      <a href="/login">Login</a>
      <a href="/producto">Producto</a>
      <a href="/paypal">Paypal</a>
    </nav>
  );
}

export default Navbar;
