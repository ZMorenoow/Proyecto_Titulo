import React from "react";
import "./CSS/modal.css";

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal__overlay">
            <div className="modal__content">
                <img
                    src="https://lh3.googleusercontent.com/d/17lbKazeg2FyA_wiQw5EcIFioBO3WDX77"
                    alt="Éxito"
                    className="modal__icon"
                />
                <h2>¡PAGO REALIZADO CON ÉXITO!</h2>
                <p>
                    Tu pago ha sido procesado y se ha enviado una confirmación a tu correo
                    electrónico.
                </p>
                <button className="modal__close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default Modal;

