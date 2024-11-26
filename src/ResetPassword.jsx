import React, { useState } from 'react';

const PasswordReset = () => {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState('');  // Updated field name to match backend
  const [token, setToken] = useState('');    // Renamed 'code' to 'token'
  const [nuevaContrasena, setNuevaContrasena] = useState('');  // Updated field name
  const [confirmarContrasena, setConfirmarContrasena] = useState('');  // Updated field name
  const [error, setError] = useState('');
  const [passwordAlert, setPasswordAlert] = useState('');
  const [confirmPasswordAlert, setConfirmPasswordAlert] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  // Función para enviar la solicitud de restablecimiento de contraseña
  const requestPasswordReset = async (correo) => {
    const response = await fetch('http://localhost:3000/recovery/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo }),  // Updated field name to match backend
    });

    if (!response.ok) {
      throw new Error('No se pudo enviar el correo de restablecimiento.');
    }
    return response.json();
  };

  // Función para verificar el código de restablecimiento
  const verifyToken = async (token) => {
    const response = await fetch('http://localhost:3000/recovery/token-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),  // Updated field name to match backend
    });

    if (!response.ok) {
      throw new Error('Código inválido o expirado.');
    }
    return response.json();
  };

  // Función para restablecer la contraseña
  const resetPassword = async (token, nuevaContrasena) => {
    const response = await fetch('http://localhost:3000/recovery/reset-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, nuevaContrasena }),  // Updated field name
    });

    if (!response.ok) {
      throw new Error('No se pudo restablecer la contraseña.');
    }
    return response.json();
  };

  // Función para manejar el siguiente paso (enviar correo)
  const handleNextStep = async () => {
    setError('');
    if (step === 1) {
      if (!correo) {
        setError('Por favor ingresa un correo electrónico.');
        return;
      }
      try {
        await requestPasswordReset(correo);
        setStep(2);  // Paso 2: Verificar código
      } catch (err) {
        setError(err.message);
      }
    } else {
      setStep(2);
    }
  };

  // Función para verificar el código
  const handleVerifyCode = async () => {
    setError('');
    if (!token) {  // Renamed 'code' to 'token'
      setError('Por favor ingresa el código.');
      return;
    }
    try {
      const response = await verifyToken(token);
      if (response.valid) {
        setStep(3);  // Paso 3: Nueva contraseña
      } else {
        setError('El código es inválido o ha expirado.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para enviar la nueva contraseña
  const submitNewPassword = async () => {
    setError('');
    if (passwordAlert || confirmPasswordAlert) {
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setConfirmPasswordAlert('Las contraseñas no coinciden.');
      return;
    }

    try {
      await resetPassword(token, nuevaContrasena);  // Updated field name
      window.location.href = '/Login'; // Redirigir al login después de cambiar la contraseña
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para reenviar el código de verificación
  const resendVerificationCode = async () => {
    setError('');
    setResendMessage('');
    try {
      await requestPasswordReset(correo);  // Updated field name
      setResendMessage('Código reenviado. Revisa tu correo.');
      setTimeout(() => {
        setResendMessage('');
      }, 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Validación de contraseñas
  const handlePasswordChange = (value) => {
    setNuevaContrasena(value);  // Updated field name
    if (value.length < 8) {
      setPasswordAlert('La contraseña debe tener al menos 8 caracteres.');
    } else {
      setPasswordAlert('');
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmarContrasena(value);  // Updated field name
    if (value !== nuevaContrasena) {  // Updated field name
      setConfirmPasswordAlert('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordAlert('');
    }
  };

  return (
    <div className="password-reset-container">
      <div className="form-container">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {step === 1 && (
          <>
            <h2>¿Has olvidado tu contraseña?</h2>
            <p>Introduce el correo electrónico asociado a tu cuenta.</p>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}  // Updated field name
              onChange={(e) => setCorreo(e.target.value)}  // Updated field name
            />
            <button onClick={handleNextStep}>Enviar</button>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </>
        )}

        {step === 2 && (
          <>
            <h2>Ingresa el código de verificación</h2>
            <p>Ingresa el código que hemos enviado a tu correo.</p>
            <input
              type="text"
              placeholder="Ingresa el código"
              value={token}  // Renamed 'code' to 'token'
              onChange={(e) => setToken(e.target.value)}  // Renamed 'code' to 'token'
            />
            <button onClick={handleVerifyCode}>Enviar</button>
            <p>
              ¿No has recibido tu código?
              <span className="resend-link" onClick={resendVerificationCode}>Reenviar correo</span>
            </p>
            {resendMessage && <div className="alert alert-success mt-2">{resendMessage}</div>}
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </>
        )}

        {step === 3 && (
          <>
            <h2>Introduce tu nueva contraseña</h2>
            <p>Para finalizar, ingresa la nueva contraseña que deseas usar.</p>
            {passwordAlert && <div className="error-text">{passwordAlert}</div>}
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContrasena}  // Updated field name
              onChange={(e) => handlePasswordChange(e.target.value)}  // Updated field name
            />
            {confirmPasswordAlert && <div className="error-text">{confirmPasswordAlert}</div>}
            <input
              type="password"
              placeholder="Repite tu nueva contraseña"
              value={confirmarContrasena}  // Updated field name
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}  // Updated field name
            />
            <button onClick={submitNewPassword}>Enviar</button>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
