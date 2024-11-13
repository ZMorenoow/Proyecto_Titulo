import React from 'react';
import  './CSS/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 Watch & Wash</p>
                <div className="redes">
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <img src="../img/Facebook.jpg" alt="Facebook" />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <img src="../img/Instagram.jpg" alt="Instagram" />
                    </a>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                        <img src="../img/WhatsApp.jpg" alt="WhatsApp" />
                    </a>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
