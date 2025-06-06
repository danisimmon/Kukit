import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import logo from '../img/logo_kukit.png'; // No usado
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import dificultadIcon from '../img/velocidad.png';
import tiempoIcon from '../img/tiempo.png';
// import Login from '../login/login'; // No usado
// import Registro from '../login/registro/registro'; // No usado
import Footer from '../footer/footer';
// import ListaCompra from '../listaCompra/listaCompra'; // No usado
import Header from '../header/header';
import { useParams, useNavigate } from 'react-router-dom';
// import ImagenReceta from 'http://localhost/api/img/recetas/pasta-al-pesto.jpg';

const VerRecetaTexto = () => {
    const [receta, setReceta] = useState(null);
    const [raciones, setRaciones] = useState(2);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef(null);
    // Estado para la paginación de los pasos
    const [paginaPasosActual, setPaginaPasosActual] = useState(1);
    const PASOS_POR_PAGINA = 1; // Mostrar un paso a la vez, puedes cambiarlo si quieres mostrar más
    const [showSpeechErrorPopup, setShowSpeechErrorPopup] = useState(false); // Estado para el pop-up de error de lectura
    const [showPlainText, setShowPlainText] = useState(false); // Estado para mostrar/ocultar texto plano
    const { recetaId } = useParams(); // Obtener recetaId de los parámetros de la URL

    const navigate = useNavigate();

    useEffect(() => {
        // Detener cualquier locución activa si cambia el ID de la receta o al cargar inicialmente.
        const synthOnLoad = window.speechSynthesis;
        if (synthOnLoad && synthOnLoad.speaking) {
            synthOnLoad.cancel();
        }

        axios.get('http://localhost/api/area_privada/recetas/getRecetas.php') // Ajusta esta URL a la tuya
            .then(res => {
                if (res.data.success) {
                    const recetaSeleccionada = res.data.recetas.find(r => r._id === recetaId);
                    setReceta(recetaSeleccionada);
                    if (!recetaSeleccionada) {
                        console.warn(`Receta con ID ${recetaId} no encontrada.`);
                    }
                } else {
                    setReceta(null);
                    console.error('API no devolvió success para obtener recetas.');
                }
            })
            .catch(err => {
                console.error('Error al obtener recetas:', err);
                setReceta(null);
            });
        setPaginaPasosActual(1); // Resetear la paginación de pasos si cambia la receta

        // Función de limpieza: se ejecuta cuando el componente se desmonta o antes de que el efecto se ejecute de nuevo.
        return () => {
            const synth = window.speechSynthesis;
            if (synth && synth.speaking) {
                synth.cancel(); // Detiene la locución
            }
            if (utteranceRef.current) {
                utteranceRef.current.onstart = null;
                utteranceRef.current.onend = null;
                utteranceRef.current.onerror = null;
                // utteranceRef.current = null; // Opcional: limpiar la referencia si es necesario
            }
        };
    }, [recetaId]);

    const handleVerReceta = () => {
        if (recetaId) {
            navigate(`/area-privada/verreceta/${recetaId}`);
        }
    };

    const ajustarRaciones = (cambio) => {
        setRaciones(prev => Math.max(1, prev + cambio));
    };

    // Lógica de paginación de pasos
    const totalPaginasPasos = receta ? Math.ceil(receta.pasos.length / PASOS_POR_PAGINA) : 0;
    const indexUltimoPaso = paginaPasosActual * PASOS_POR_PAGINA;
    const indexPrimerPaso = indexUltimoPaso - PASOS_POR_PAGINA;
    const pasosEnPaginaActual = receta ? receta.pasos.slice(indexPrimerPaso, indexUltimoPaso) : [];

    const cambiarPaginaPasos = (numero) => {
        if (numero >= 1 && numero <= totalPaginasPasos) {
            setPaginaPasosActual(numero);
        }
    };

    // Función para renderizar los números de página de los pasos con elipsis (similar a VerReceta.jsx)
    const renderNumerosPaginaPasos = () => {
        const items = [];
        const maxPaginasVisibles = 3;
        let inicio = Math.max(1, paginaPasosActual - Math.floor(maxPaginasVisibles / 2));
        let fin = Math.min(totalPaginasPasos, inicio + maxPaginasVisibles - 1);

        if (fin - inicio + 1 < maxPaginasVisibles && inicio > 1) {
            inicio = Math.max(1, fin - maxPaginasVisibles + 1);
        }

        if (inicio > 1) {
            items.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        for (let i = inicio; i <= fin; i++) {
            items.push(
                <li key={i} className={`page-item ${paginaPasosActual === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => cambiarPaginaPasos(i)}>{i}</button>
                </li>
            );
        }

        if (fin < totalPaginasPasos) {
            items.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }
        return items;
    };

    const getTextToSpeak = () => {
        if (!receta) return "";

        let textParts = [];

        textParts.push(`Receta: ${receta.nombre}.`);
        textParts.push(`Para ${raciones} ${raciones === 1 ? 'ración' : 'raciones'}.`);
        textParts.push(`Dificultad: ${receta.dificultad}.`);
        textParts.push(`Tiempo estimado: ${receta.tiempo_estimado}.`);

        textParts.push("Ingredientes:");
        receta.ingredientes.forEach(ing => {
            const cantidadBase = ing.cantidad || 0;
            const racionesBase = receta.raciones_originales || 1;
            const cantidadFinal = (cantidadBase * raciones) / racionesBase;
            textParts.push(`${ing.nombre}: ${cantidadFinal.toFixed(1)} ${ing.unidad}.`);
        });

        if (receta.nutricion && Object.keys(receta.nutricion).length > 0) {
            textParts.push("Información nutricional por ración:");
            if (receta.nutricion.calorias) textParts.push(`Calorías: ${receta.nutricion.calorias} kilocalorías.`);
            if (receta.nutricion.proteina) textParts.push(`Proteínas: ${receta.nutricion.proteina} gramos.`);
            if (receta.nutricion.grasa) textParts.push(`Grasas: ${receta.nutricion.grasa} gramos.`);
            if (receta.nutricion.carbohidratos) textParts.push(`Carbohidratos: ${receta.nutricion.carbohidratos} gramos.`);
            if (receta.nutricion.fibra) textParts.push(`Fibra: ${receta.nutricion.fibra} gramos.`);
        } else {
            textParts.push("No hay información nutricional disponible para esta receta.");
        }

        textParts.push("Pasos para la preparación:");
        receta.pasos.forEach((paso, index) => {
            textParts.push(`Paso ${index + 1}: ${paso}.`);
        });

        return textParts.join('\n\n'); // Usar doble salto de línea para mejor legibilidad del texto plano
    };
    const handleToggleSpeak = () => {
        if (!receta) return;
        const synth = window.speechSynthesis;

        if (!synth) {
            alert("La funcionalidad de leer en voz alta no está soportada en tu navegador.");
            return;
        }

        if (isSpeaking) { // Si ya está hablando (isSpeaking es true)
            synth.cancel(); // Detiene la locución actual
            // onend se encargará de setIsSpeaking(false)
        } else {
            const textToSpeak = getTextToSpeak();
            if (textToSpeak) {
                const newUtterance = new SpeechSynthesisUtterance(textToSpeak);
                newUtterance.lang = 'es-ES'; // Español
                newUtterance.onstart = () => setIsSpeaking(true);
                newUtterance.onend = () => {
                    setIsSpeaking(false);
                    utteranceRef.current = null;
                };
                newUtterance.onerror = (event) => {
                    console.error('Error en SpeechSynthesis:', event.error);
                    setIsSpeaking(false);
                    utteranceRef.current = null;
                    setShowSpeechErrorPopup(true); // Mostrar el pop-up personalizado
                };
                utteranceRef.current = newUtterance;
                synth.speak(newUtterance);
            }
        }
    };
    const toggleShowPlainText = () => {
        setShowPlainText(!showPlainText);
    };
    const handlePrint = () => {
        window.print();
    };

    if (!receta) { // Estado de carga
        return (
            <>
                <Header />
                <p className="text-center mt-5">Cargando receta...</p>
                <Footer />
            </>
        );
    }

    return ( // JSX principal del componente
        <>
            <Header />
            <main>
                <div className="container mt-4">
                    {/* Título de la receta */}
                    <div className="mb-2">
                        <h4>Recetas Guardadas <span className="text-danger">| {receta.nombre}</span></h4>
                    </div>
                    {/* Contenedor de botones alineado a la derecha */}
                    <div className="d-flex justify-content-end mb-3">
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className={`btn ${isSpeaking ? 'btn-danger' : 'btn-primary'} btn-sm me-2 btn-lectura`}
                                onClick={handleToggleSpeak}
                                disabled={!receta}
                                aria-label={isSpeaking ? `Detener la lectura de la receta ${receta.nombre}` : `Pasar a texto y leer en voz alta la receta ${receta.nombre}`}
                            >
                                {isSpeaking ? 'Detener Lectura' : 'Pasar a Texto y Leer'}
                            </button>
                            {showPlainText && (
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    style={{
                                        margin: "10px",
                                        backgroundColor: "var(--background-color)",
                                        color: "var(--primary-color)",
                                        border: "1px solid var(--primary-color)",
                                        fontWeight: "bold",
                                        cursor: "pointer"
                                    }}
                                    onClick={handlePrint}
                                    aria-label={`Imprimir versión en texto de la receta ${receta.nombre}`}
                                >
                                    Imprimir Texto
                                </button>
                            )}
                            <button
                                className={`btn btn-sm btn-texto-toggle ${showPlainText ? 'btn-activo' : ''}`}
                                onClick={toggleShowPlainText}
                                disabled={!receta}
                                aria-label={showPlainText ? `Ocultar versión en texto de la receta ${receta.nombre}` : `Mostrar versión en texto de la receta ${receta.nombre}`}
                            >
                                {showPlainText ? 'Ocultar Texto' : 'Mostrar Texto'}
                            </button>
                            
                        </div>
                    </div>
                    <button
                        className="btn btn-outline-secondary mt-2 mb-3 volver-receta"
                        onClick={handleVerReceta}
                    >
                        Volver
                    </button>
                    {showPlainText ? (
                        <div className="mt-4 p-3 bg-light border rounded">
                            <div id="printable-text-content" className="mt-4 p-3 bg-light border rounded">
                                <h4 className="mb-3">Versión en Texto: {receta.nombre}</h4>
                                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', fontSize: 'inherit' }}>
                                    {getTextToSpeak()}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex flex-column flex-md-row gap-4 mt-4">
                                <div className="text-center">
                                    {/* Aquí podrías poner la imagen de la receta si la tienes */}
                                    {/* <img src={`http://localhost/api/img/recetas/${receta.imagen}`} alt={receta.nombre} className="img-fluid rounded shadow-sm" style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }} /> */}
                                </div>

                                <div className="flex-fill">
                                    {/* El título ya está arriba, se puede omitir aquí si se prefiere */}
                                    {/* <h3>{receta.nombre}</h3> */}
                                    <div className="d-flex gap-4">
                                        <div>
                                            <p className="mb-1 fw-bold">Dificultad</p>
                                            <div className="d-flex align-items-center">
                                                <img src={dificultadIcon} alt="Dificultad" style={{ width: '20px', marginRight: '5px' }} />
                                                <span>{receta.dificultad}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-1 fw-bold">Tiempo Estimado</p>
                                            <div className="d-flex align-items-center">
                                                <img src={tiempoIcon} alt="Tiempo" style={{ width: '20px', marginRight: '5px' }} />
                                                <span>{receta.tiempo}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="receta-header">
                                        <h1>{receta.nombre}</h1>
                                        <p><strong>Creado por:</strong> {receta.idUsuario}</p>
                                    </div>

                                    <hr />

                                    <h5>INGREDIENTES ({raciones} {raciones === 1 ? 'ración' : 'raciones'})</h5>
                                    <div>
                                        <button className="btn btn-outline-secondary btn-sm me-2 volver-receta" onClick={() => ajustarRaciones(-1)} disabled={raciones <= 1}>-</button>
                                        <span>{raciones}</span>
                                        <button className="btn btn-outline-secondary btn-sm ms-2 volver-receta" onClick={() => ajustarRaciones(1)}>+</button>
                                    </div>
                                    <div className="row g-2 mt-2">
                                        {receta.ingredientes.map((ing, idx) => {
                                            const cantidadBase = ing.cantidad || 0;
                                            const racionesBase = receta.raciones_originales || 1; // Asumir 1 si no está definido
                                            const cantidadFinal = (cantidadBase * raciones) / racionesBase;
                                            return (
                                                <div key={idx} className="col-md-6">
                                                    <div className="bg-white rounded shadow-sm p-2">
                                                        {ing.nombre}: {cantidadFinal.toFixed(1)} {ing.unidad}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {receta.nutricion && Object.keys(receta.nutricion).length > 0 && (
                                        <div className="mt-4">
                                            <h5>INFORMACIÓN NUTRICIONAL POR RACIÓN</h5>
                                            <div className="row g-2 mt-2">
                                                {receta.nutricion.calorias && <div className="col-md-6 col-lg-4">
                                                    <div className="bg-white rounded shadow-sm p-2">
                                                        <strong>Calorías:</strong> {receta.nutricion.calorias} kcal
                                                    </div>
                                                </div>}
                                                {receta.nutricion.proteina && <div className="col-md-6 col-lg-4">
                                                    <div className="bg-white rounded shadow-sm p-2">
                                                        <strong>Proteína:</strong> {receta.nutricion.proteina} g
                                                    </div>
                                                </div>}
                                                {receta.nutricion.grasa && <div className="col-md-6 col-lg-4">
                                                    <div className="bg-white rounded shadow-sm p-2">
                                                        <strong>Grasa:</strong> {receta.nutricion.grasa} g
                                                    </div>
                                                </div>}
                                                {receta.nutricion.carbohidratos && <div className="col-md-6 col-lg-4">
                                                    <div className="bg-white rounded shadow-sm p-2">
                                                        <strong>Carbohidratos:</strong> {receta.nutricion.carbohidratos} g
                                                    </div>
                                                </div>}
                                                {receta.nutricion.fibra && <div className="col-md-6 col-lg-4">
                                                    <div className="bg-white rounded shadow-sm p-2">
                                                        <strong>Fibra:</strong> {receta.nutricion.fibra} g
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <h5>PASOS</h5>
                                        {pasosEnPaginaActual.map((paso, idx) => (
                                            <div key={indexPrimerPaso + idx} className="bg-white rounded shadow-sm p-3 mb-3">
                                                <p className="fw-bold">Paso {indexPrimerPaso + idx + 1}:</p>
                                                <p>{paso}</p>
                                            </div>
                                        ))}
                                        {totalPaginasPasos > 1 && (
                                            <nav>
                                                <ul className="pagination justify-content-center">
                                                    <li className={`page-item ${paginaPasosActual === 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => cambiarPaginaPasos(paginaPasosActual - 1)}>&lt;</button>
                                                    </li>
                                                    {renderNumerosPaginaPasos()}
                                                    <li className={`page-item ${paginaPasosActual === totalPaginasPasos ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => cambiarPaginaPasos(paginaPasosActual + 1)}>&gt;</button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Modal para error de lectura */}
                {showSpeechErrorPopup && (
                    <>
                        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} role="dialog" aria-modal="true" aria-labelledby="speechErrorModalTitle">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="speechErrorModalTitle">Aviso</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowSpeechErrorPopup(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Se ha parado la lectura.</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowSpeechErrorPopup(false)}>Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div> {/* Fondo del modal */}
                    </>
                )}
            </main>
        </>
    );
};

export default VerRecetaTexto;
