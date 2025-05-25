import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DesplegablePerfil = ({ showDesplegablePerfil, setDesplegablePerfil }) => {
    const navigate = useNavigate();
    const offcanvasRef = useRef();
    const bsOffcanvasRef = useRef(null);
    const editarPerfil = () => {
        navigate("/area-privada/editar-perfil", {
            state: { seccion: "perfil" },
        });
        setDesplegablePerfil(false);
    };
    const crearReceta = () => {
        navigate("/area-privada/editar-perfil", {
            state: { seccion: "crear" },
        });
        setDesplegablePerfil(false);
    };
    const verRecetas = () => {
        navigate("/area-privada/editar-perfil", {
            state: { seccion: "recetas" },
        });
        setDesplegablePerfil(false);
    };
    const cerrarSesion = () => {
        axios
            .get("http://localhost/api/login/gestion-autenticacion/logout.php", {
                withCredentials: true,
            })
            .then((response) => {
                console.log("Respuesta del backend:", response.data);
                if (response.data.success) {
                    // Redirigir a la página de inicio o a otra página después de cerrar sesión
                    navigate("/home");
                } else {
                    console.error("Error al cerrar sesión:", response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error en la solicitud:", error);
            });
        setDesplegablePerfil(false);
    };

    useEffect(() => {
        if (!offcanvasRef.current || !window.bootstrap?.Offcanvas) return;

        // Solo inicializamos una vez
        if (!bsOffcanvasRef.current) {
            bsOffcanvasRef.current = new window.bootstrap.Offcanvas(offcanvasRef.current);

            // Listener que se dispara cuando se cierra el offcanvas
            offcanvasRef.current.addEventListener("hidden.bs.offcanvas", () => {
                setDesplegablePerfil(false);
            });
        }

        // Mostrar el offcanvas solo cuando cambia a true
        if (showDesplegablePerfil) {
            bsOffcanvasRef.current.show();
        }

    }, [showDesplegablePerfil]);
    return (
        <>
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
                integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
                rel="stylesheet"
            ></link>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq"
                crossOrigin="anonymous"
                defer
            ></script>

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