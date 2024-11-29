import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../../styles/Footer.css';

import PropTypes from 'prop-types';

const Footer = ({ isDarkMode }) => {
    return (
        <footer className={`footer ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="footer-container">
                {/* Logo y Descripción */}
                <div className="footer-top">
                    <div className="footer-logo">
                        <span className="company-name">SIRENAH</span>
                        <p className="company-description">
                            Muy de lo ultimo, muy de nivel.
                        </p>
                    </div>
                </div>

                {/* Columnas del Footer */}
                <div className="footer-columns">
                    {/* Servicios */}
                    <div className="footer-column">
                        <h4>Servicios</h4>
                        <ul>
                            <li>Un espacio de prendas alernativas.</li>
                            <li>Prendas en tendencia.</li>
                            <li></li>
                        </ul>
                    </div>
                    
                    {/* Atención al Cliente */}
                    <div className="footer-column">
                        <h4>Atención al Cliente</h4>
                        <div className="contact-item">
                            <FaMapMarkerAlt className="icon" />
                            <span>Urb. Sol de Huacachina H-4, Ica, Peru 1101</span>
                        </div>
                        <div className="contact-item">
                            <FaPhone className="icon" />
                            <span>(+51) 930 462 483</span>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="icon" />
                            <span><a href="Sirenahica@gmail.com">contacto@sirenah.com</a></span>
                        </div>
                    </div>
                    {/* Redes Sociales y Ubicación */}
                    <div className="footer-column">
                        <h4>Redes Sociales</h4>
                        <div className="footer-social">
                            <a href="https://www.facebook.com/share/RVfsP21uNpK4breo/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="icon" />
                            </a>
                            <a href="https://www.instagram.com/sirenah.ica?igsh=amNleTBscjk0amRz" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

Footer.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
};

export default Footer;
