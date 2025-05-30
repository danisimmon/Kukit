import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Asegúrate de importar Bootstrap JS

const DesplegablePerfil = ({ showDesplegablePerfil, setDesplegablePerfil }) => {
    const navigate = useNavigate();
    const offcanvasRef = useRef();
    const bsOffcanvasRef = useRef(null);

    useEffect(() => {
        if (!offcanvasRef.current || !window.bootstrap?.Offcanvas) return;

        if (!bsOffcanvasRef.current) {
            bsOffcanvasRef.current = new window.bootstrap.Offcanvas(offcanvasRef.current);

            offcanvasRef.current.addEventListener("hidden.bs.offcanvas", () => {
                setDesplegablePerfil(false);
            });
        }

        if (showDesplegablePerfil) {
            bsOffcanvasRef.current.show();
        } else {
            bsOffcanvasRef.current?.hide(); // Ocultar cuando showDesplegablePerfil es false
        }

    }, [showDesplegablePerfil]);

    const navegarYCerrar = (path, state) => {
        bsOffcanvasRef.current?.hide();
        // Esperar un breve momento para que la animación de cierre termine (opcional)
        setTimeout(() => {
            navigate(path, { state });
        }, 150); // Ajusta el tiempo según la duración de la animación del offcanvas
        setDesplegablePerfil(false); // Asegúrate de que el estado también se actualice
    };

    const editarPerfil = () => {
        navegarYCerrar("/area-privada/editar-perfil", { seccion: "perfil" });
    };
    const crearReceta = () => {
        navegarYCerrar("/area-privada/editar-perfil", { seccion: "crear" });
    };
    const verRecetas = () => {
        navegarYCerrar("/area-privada/editar-perfil", { seccion: "recetas" });
    };

    const cerrarSesion = () => {
        axios
            .get("http://localhost/api/login/gestion-autenticacion/logout.php", {
                withCredentials: true,
            })
            .then((response) => {
                console.log("Respuesta del backend:", response.data);
                if (response.data.success) {
                    // Navegar después de cerrar el offcanvas
                    bsOffcanvasRef.current?.hide();
                    setTimeout(() => {
                        navigate("/home");
                    }, 150); // Ajusta el tiempo si es necesario
                    setDesplegablePerfil(false);
                } else {
                    console.error("Error al cerrar sesión:", response.data.message);
                    setDesplegablePerfil(false); // Asegúrate de actualizar el estado en caso de error también
                }
            })
            .catch((error) => {
                console.error("Error en la solicitud:", error);
                setDesplegablePerfil(false); // Asegúrate de actualizar el estado en caso de error también
            })
            .finally(() => {
                // No es necesario llamar a setDesplegablePerfil aquí, ya se hace en then/catch
            });
    };

    return (
        <>
            <div
                ref={offcanvasRef}
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="perfil-offcanvasExample"
                aria-labelledby="offcanvasExampleLabel"
            >
                <div className="offcanvas-header">
                    <h2 className="offcanvas-title" id="offcanvasExampleLabel">
                        Mi perfil
                    </h2>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={() => setDesplegablePerfil(false)} // Asegúrate de que el estado se actualice al cerrar con el botón
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <p className="perfil-titulo">Mi perfil</p>
                    <ul className="perfil-opciones">
                        <li onClick={editarPerfil}>Editar perfil</li>
                        <li onClick={crearReceta}>Crear receta</li>
                        <li onClick={verRecetas}>Recetas creadas</li>
                        <li onClick={cerrarSesion}>Salir</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DesplegablePerfil;