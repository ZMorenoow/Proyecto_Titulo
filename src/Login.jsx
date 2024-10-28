import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.open('http://localhost:3000/auth/google', '_self');
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;