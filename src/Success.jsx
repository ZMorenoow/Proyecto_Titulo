import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/app');  // Redirige a la ruta '/app'
    };

    return (
        <div className="container text-center" style={{ marginTop: '100px' }}>
            <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">¡Transacción Exitosa!</h4>
                <p>Tu pago ha sido procesado correctamente. Gracias por tu compra.</p>
                <hr />
                <p className="mb-0">Puedes volver a la aplicación en cualquier momento.</p>
            </div>
            <button className="btn btn-primary mt-4" onClick={handleGoBack}>
                Volver a la aplicación
            </button>
        </div>
    );
};

export default Success;
