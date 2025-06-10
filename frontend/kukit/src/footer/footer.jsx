import React, { useState } from "react";
import facebookLogo from '../img/icons8-facebook-48.png';
import instagramLogo from '../img/Instagram.png';
import xLogo from '../img/x.png';
import tiktokLogo from '../img/tikTok.png';

function Footer({ setShowListaCompra }) {
    const [currentYear] = useState(new Date().getFullYear());

    return (
        <>
            
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <footer className="section bg-footer footer-kukit">
                <div className="container-footer">
                    <div className="row" style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                        {/* Sección 1 */}
                        <div className="col-lg-3">
                            <div>
                                <h6 className="footer-heading text-white">Visita nuestras secciones</h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li><a href="/recetas" className="enlace-footer">Recetas</a></li>
                                    <li><a className="enlace-footer" onClick={() => setShowListaCompra(true)}>Lista de la compra</a></li>
                                    <li><a href="/planAlimentacion" className="enlace-footer">Plan de alimentación</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sección 2 */}
                        <div className="col-lg-3">
                            <div>
                                <h6 className="footer-heading text-white">Información Corporativa</h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li><a href="/sobrekukit" className="enlace-footer">Sobre Kukit</a></li>
                                    <li><a href="/partners" className="enlace-footer">Partners o Colaboradores</a></li>
                                    <li><a href="/terminosycondiciones" className="enlace-footer">Términos y condiciones</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sección 3 */}
                        <div className="col-lg-3">
                            <div style={{ color: '#fff' }}>
                                <h6 className="footer-heading text-white" style={{ color: '#fff' }}>Contáctanos</h6>
                                <p className="contact-info mt-4" style={{ color: '#fff' }}>Contacta con nosotros si necesitas ayuda</p>
                                <p className="contact-info" style={{ color: '#fff' }}>kukit.contacto@gmail.com</p>
                                
                            </div>
                            <ul className="list-inline">
                                        <li className="list-inline-item">
                                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                                <img src={instagramLogo} alt="Instagram Logo" className="footer-icon-img" />
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="https://x.com/home" target="_blank" rel="noopener noreferrer">
                                                <img src={xLogo} alt="X Logo" className="footer-icon-img" />
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                                <img src={facebookLogo} alt="Facebook Logo" className="footer-icon-img footer-facebook-icon-img" />
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                                                <img src={tiktokLogo} alt="TikTok Logo" className="footer-icon-img" />
                                            </a>
                                        </li>
                                    </ul>
                        </div>
                        
                    </div>
                </div>
                <div className="footer-copyright">
                    <p className="footer-alt mb-0 f-14">
                        © {currentYear} Ainhoa Blanca, Manuel Gómez, Rubén Peña, Daniel Simón. All Rights Reserved
                    </p>
                </div>
            </footer>
        </>
    );
}

export default Footer;