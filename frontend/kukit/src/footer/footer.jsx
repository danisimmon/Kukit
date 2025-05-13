import React, { useEffect, useState } from "react";
function Footer() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentYear(new Date().getFullYear());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <footer className="section bg-footer">
                <div className="container-footer">
                    <div className="row">
                        {/* Sección 1 */}
                        <div className="col-lg-3">
                            <div>
                                <h6 className="footer-heading text-uppercase text-white">Visita nuestras secciones</h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li><a href="#" className="enlace-footer">Recetas</a></li>
                                    <li><a href="#" className="enlace-footer">Lista de la compra</a></li>
                                    <li><a href="#" className="enlace-footer">Plan de alimentación</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sección 2 */}
                        <div className="col-lg-3">
                            <div>
                                <h6 className="footer-heading text-uppercase text-white">Información Corporativa</h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li><a href="#" className="enlace-footer">Sobre Kukit</a></li>
                                    <li><a href="#" className="enlace-footer">Partners o Colaboradores</a></li>
                                    <li><a href="#" className="enlace-footer">Términos y condiciones</a></li>
                                    <li><a href="#" className="enlace-footer">Aviso legal</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sección 3 */}
                        <div className="col-lg-3">
                            <div>
                                <h6 className="footer-heading text-uppercase text-white">Empieza con Kukit</h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li><a href="#" className="enlace-footer">Iniciar Sesión</a></li>
                                    <li><a href="#" className="enlace-footer">Crear Cuenta</a></li>
                                    <li><a href="#" className="enlace-footer">¿Olvidaste tu contraseña?</a></li>
                                    <li><a href="#" className="enlace-footer">Ver mi perfil</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sección 4 */}
                        <div className="col-lg-3">
                            <div>
                                <h6 className="footer-heading text-uppercase text-white">Contáctanos</h6>
                                <p className="contact-info mt-4">Contacta con nosotros si necesitas ayuda</p>
                                <p className="contact-info">kukit@kukit.com</p>
                                <div className="mt-5">
                                    <ul className="list-inline">
                                        <li className="list-inline-item">
                                            <a href="#"><i className="fab facebook footer-social-icon fa-facebook-f"></i></a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#"><i className="fab twitter footer-social-icon fa-twitter"></i></a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#"><i className="fab google footer-social-icon fa-google"></i></a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#"><i className="fab apple footer-social-icon fa-apple"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <p className="footer-alt mb-0 f-14">
                        2025 © Ainhoa Blanca, Manuel Gómez, Rubén Peña, Daniel Simón. All Rights Reserved
                    </p>
                </div>
            </footer>
        </>
    );
}

export default Footer;