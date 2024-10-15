import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/producto');  
    };

    return (
        <div className="container text-center" style={{ marginTop: '100px' }}>
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">¡Error en la Transacción!</h4>
                <p>Ocurrió un problema al procesar tu pago. Por favor, inténtalo nuevamente.</p>
                <hr />
                <p className="mb-0">Puedes volver a la aplicación para intentarlo de nuevo.</p>
            </div>
            <button className="btn btn-primary mt-4" onClick={handleGoBack}>
                Volver a la aplicación
            </button>
        </div>
    );
};

export default Error;
