import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../footer/footer';
import Header from '../header/header';

const EditarRecetaCreada = () => {
    const { recetaId } = useParams();
    const navigate = useNavigate();

    // Estados del formulario de la receta
    const [formReceta, setFormReceta] = useState({
        nombre: '',
        dificultad: '',
        tiempo: '',
        pais: '',
        gluten: false,
        vegetariana: false,
        lactosa: false,
        vegana: false,
    });
    const [imagen, setImagen] = useState(null); // Para el nuevo archivo de imagen
    const [imagenPreview, setImagenPreview] = useState(null); // Para la vista previa de la imagen actual o nueva
    const [imagenExistenteUrl, setImagenExistenteUrl] = useState(''); // Para mostrar la imagen actual si no se cambia

    const [ingredientes, setIngredientes] = useState([]);
    const [pasos, setPasos] = useState([]);

    // Estados para los nuevos inputs de ingredientes y pasos
    const [newIngredienteNombre, setNewIngredienteNombre] = useState('');
    const [newIngredienteCantidad, setNewIngredienteCantidad] = useState('');
    const [newIngredienteUnidad, setNewIngredienteUnidad] = useState('');
    const [newPaso, setNewPaso] = useState('');

    // Estados para errores de validación
    const [errorNombreReceta, setErrorNombreReceta] = useState('');
    const [errorDificultad, setErrorDificultad] = useState('');
    const [errorImagenReceta, setErrorImagenReceta] = useState('');
    const [errorTiempo, setErrorTiempo] = useState('');
    const [errorPais, setErrorPais] = useState('');
    const [errorIngredientesLista, setErrorIngredientesLista] = useState('');
    const [errorPasosLista, setErrorPasosLista] = useState('');
    const [errorNuevoIngrediente, setErrorNuevoIngrediente] = useState('');
    const [errorNuevoPaso, setErrorNuevoPaso] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [exito, setExito] = useState(false);
    const [cargandoReceta, setCargandoReceta] = useState(true);

    // Cargar datos de la receta a editar
    useEffect(() => {
        setCargandoReceta(true);
        axios.get('http://localhost/api/area_privada/recetas/getRecetasConcreta.php', {
            params: { recetaId },
            withCredentials: true
        })
        .then(res => {
            if (res.data.success) {
                // Encontrar la receta específica. Asumimos que getRecetasConcreta.php puede devolver un array
                // o que el ID ya filtra a una sola receta en el backend.
                // Si devuelve un array, filtramos.
                const recetaAEditar = Array.isArray(res.data.recetas)
                    ? res.data.recetas.find(r => r._id?.$oid === recetaId || r.id === recetaId) // Ajustar según la estructura del ID
                    : res.data.recetas; // Si ya es un objeto único

                if (recetaAEditar) {
                    setFormReceta({
                        nombre: recetaAEditar.nombre || '',
                        dificultad: recetaAEditar.dificultad || '',
                        tiempo: recetaAEditar.tiempo || '',
                        pais: recetaAEditar.pais || '',
                        gluten: recetaAEditar.gluten || false,
                        vegetariana: recetaAEditar.vegetariana || false,
                        lactosa: recetaAEditar.lactosa || false,
                        vegana: recetaAEditar.vegana || false,
                    });
                    setIngredientes(recetaAEditar.ingredientes || []);
                    setPasos(recetaAEditar.pasos || []);
                    if (recetaAEditar.href) {
                        setImagenPreview(recetaAEditar.href);
                        setImagenExistenteUrl(recetaAEditar.href);
                    }
                } else {
                    setMensaje('Receta no encontrada.');
                    setExito(false);
                }
            } else {
                setMensaje(res.data.message || 'Error al cargar la receta.');
                setExito(false);
            }
        })
        .catch(err => {
            setMensaje('Error de conexión al cargar la receta.');
            setExito(false);
            console.error('Error al obtener receta para editar:', err);
        })
        .finally(() => {
            setCargandoReceta(false);
        });
    }, [recetaId]);


    const manejarCambioReceta = (e) => {
        const { name, value, type, checked } = e.target;
        setFormReceta(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : (type === 'radio' ? (value === 'sí') : value)
        }));
        // Limpiar errores específicos al escribir
        if (name === 'nombre') setErrorNombreReceta('');
        if (name === 'dificultad') setErrorDificultad('');
        if (name === 'tiempo') setErrorTiempo('');
        if (name === 'pais') setErrorPais('');
    };

    const manejarCambioOpcionBooleanaReceta = (e) => {
        const { name, value } = e.target;
        setFormReceta(prevState => ({
            ...prevState,
            [name]: value === 'sí'
        }));
    };

    const manejarCambioImagen = (e) => {
        const file = e.target.files[0];
        setErrorImagenReceta('');
        if (file) {
            const maxSize = 40 * 1024 * 1024; // 40MB
            if (file.size > maxSize) {
                setErrorImagenReceta('La imagen no puede superar los 40MB.');
                setImagen(null);
                setImagenPreview(imagenExistenteUrl); // Volver a la imagen existente si la nueva es muy grande
                e.target.value = null;
                return;
            }
            setImagen(file);
            setImagenPreview(URL.createObjectURL(file));
        } else {
            setImagen(null);
            setImagenPreview(imagenExistenteUrl); // Si se deselecciona, mostrar la original
        }
    };

    // --- Manejadores de Ingredientes ---
    const validateNewIngredientFields = () => {
        if (!newIngredienteNombre.trim()) {
          setErrorNuevoIngrediente('El nombre del ingrediente es obligatorio.');
          return false;
        }
        if (!isNaN(parseFloat(newIngredienteNombre)) && isFinite(newIngredienteNombre)) {
          setErrorNuevoIngrediente('El nombre del ingrediente no puede ser un número.');
          return false;
        }
        if (!newIngredienteCantidad.trim()) {
          setErrorNuevoIngrediente('La cantidad del ingrediente es obligatoria.');
          return false;
        }
        if (isNaN(parseFloat(newIngredienteCantidad)) || !isFinite(newIngredienteCantidad)) {
          setErrorNuevoIngrediente('La cantidad debe ser un número.');
          return false;
        }
        if (Number(newIngredienteCantidad) <= 0) {
          setErrorNuevoIngrediente('La cantidad debe ser un número positivo.');
          return false;
        }
        if (!newIngredienteUnidad.trim()) {
          setErrorNuevoIngrediente('La unidad del ingrediente es obligatoria.');
          return false;
        }
        if (!isNaN(parseFloat(newIngredienteUnidad)) && isFinite(newIngredienteUnidad)) {
          setErrorNuevoIngrediente('La unidad del ingrediente no puede ser un número.');
          return false;
        }
        setErrorNuevoIngrediente('');
        return true;
      };

    const handleAddIngrediente = () => {
        if (validateNewIngredientFields()) {
            setIngredientes([
                ...ingredientes,
                {
                    nombre: newIngredienteNombre,
                    cantidad: parseFloat(newIngredienteCantidad),
                    unidad: newIngredienteUnidad,
                },
            ]);
            setNewIngredienteNombre('');
            setNewIngredienteCantidad('');
            setNewIngredienteUnidad('');
            setErrorIngredientesLista('');
        }
    };

    const handleRemoveIngrediente = (index) => {
        const newIngredientes = ingredientes.filter((_, i) => i !== index);
        setIngredientes(newIngredientes);
    };

    // --- Manejadores de Pasos ---
    const handleAddPaso = () => {
        if (newPaso.trim()) {
            setPasos([...pasos, newPaso.trim()]);
            setNewPaso('');
            setErrorNuevoPaso('');
            setErrorPasosLista('');
        } else {
            setErrorNuevoPaso('Por favor, escribe el paso para añadirlo.');
        }
    };

    const handleRemovePaso = (index) => {
        const newPasos = pasos.filter((_, i) => i !== index);
        setPasos(newPasos);
    };

    // --- Blur Handlers para validación ---
    const handleRecipeFieldBlur = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nombre':
                if (!value.trim()) setErrorNombreReceta('El nombre de la receta es obligatorio.');
                break;
            case 'dificultad':
                if (!value) setErrorDificultad('La dificultad es obligatoria.');
                break;
            case 'tiempo':
                if (!value.trim()) {
                    setErrorTiempo('El tiempo de preparación es obligatorio.');
                } else if (isNaN(value) || Number(value) <= 0) {
                    setErrorTiempo('El tiempo debe ser un número positivo en minutos.');
                }
                break;
            case 'pais':
                if (!value) setErrorPais('El país es obligatorio.');
                break;
            default:
                break;
        }
    };

    const handleNewIngredientFieldBlur = (fieldName) => {
        let error = '';
        switch (fieldName) {
          case 'nombre':
            if (!newIngredienteNombre.trim()) error = 'El nombre del ingrediente es obligatorio.';
            else if (!isNaN(parseFloat(newIngredienteNombre)) && isFinite(newIngredienteNombre)) error = 'El nombre no puede ser un número.';
            break;
          case 'cantidad':
            if (!newIngredienteCantidad.trim()) error = 'La cantidad del ingrediente es obligatoria.';
            else if (isNaN(parseFloat(newIngredienteCantidad)) || !isFinite(newIngredienteCantidad)) error = 'La cantidad debe ser un número.';
            else if (Number(newIngredienteCantidad) <= 0) error = 'La cantidad debe ser un número positivo.';
            break;
          case 'unidad':
            if (!newIngredienteUnidad.trim()) error = 'La unidad del ingrediente es obligatoria.';
            else if (!isNaN(parseFloat(newIngredienteUnidad)) && isFinite(newIngredienteUnidad)) error = 'La unidad no puede ser un número.';
            break;
          default:
            break;
        }
        if (error) {
          setErrorNuevoIngrediente(error);
        }
      };

    const handleNewStepFieldBlur = () => {
        if (!newPaso.trim()) setErrorNuevoPaso('Por favor, escribe el paso para añadirlo.');
    };


    // --- Envío del formulario de edición ---
    const manejarEnvioEdicionReceta = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        // Limpiar errores previos
        setErrorNombreReceta('');
        setErrorDificultad('');
        setErrorTiempo('');
        setErrorPais('');
        setErrorIngredientesLista('');
        setErrorPasosLista('');
        // No limpiamos setErrorImagenReceta aquí, ya que se maneja en manejarCambioImagen
        setMensaje('');
        setExito(false);

        if (!formReceta.nombre.trim()) {
            setErrorNombreReceta('El nombre de la receta es obligatorio.');
            formIsValid = false;
        }
        if (!formReceta.dificultad) {
            setErrorDificultad('La dificultad es obligatoria.');
            formIsValid = false;
        }
        if (!formReceta.tiempo.trim()) {
            setErrorTiempo('El tiempo de preparación es obligatorio.');
            formIsValid = false;
        } else if (isNaN(formReceta.tiempo) || Number(formReceta.tiempo) <= 0) {
            setErrorTiempo('El tiempo debe ser un número positivo en minutos.');
            formIsValid = false;
        }
        if (!formReceta.pais) {
            setErrorPais('El país es obligatorio.');
            formIsValid = false;
        }
        if (ingredientes.length === 0) {
            setErrorIngredientesLista('Debes añadir al menos un ingrediente.');
            formIsValid = false;
        }
        if (pasos.length === 0) {
            setErrorPasosLista('Debes añadir al menos un paso.');
            formIsValid = false;
        }

        if (!formIsValid) return;

        const formDataToSend = new FormData();
        formDataToSend.append('recetaId', recetaId); // IMPORTANTE: Enviar el ID de la receta a editar

        for (const key in formReceta) {
            if (typeof formReceta[key] === 'boolean') {
                formDataToSend.append(key, formReceta[key] ? 'true' : 'false');
            } else {
                formDataToSend.append(key, formReceta[key]);
            }
        }

        if (imagen) { // Solo añadir la imagen si se seleccionó una nueva
            formDataToSend.append('imagen', imagen);
        }
        // Si no se sube una nueva imagen, el backend debería conservar la existente.
        // Si se quiere eliminar la imagen existente sin reemplazarla, se necesitaría un campo adicional o lógica.

        formDataToSend.append('ingredientes', JSON.stringify(ingredientes));
        formDataToSend.append('pasos', JSON.stringify(pasos));

        try {
            // Reemplaza la URL con tu endpoint PHP para editar recetas
            const respuesta = await axios.post(
                'http://localhost/api/area_privada/editar-perfil/editarRecetaCreada.php',
                formDataToSend,
                { withCredentials: true }
            );

            if (respuesta.data.success) {
                setExito(true);
                setMensaje(respuesta.data.message || 'Receta actualizada con éxito.');
                // Opcional: actualizar la imagen preview con la nueva URL si el backend la devuelve
                if (respuesta.data.nuevaImagenUrl) {
                    setImagenPreview(respuesta.data.nuevaImagenUrl);
                    setImagenExistenteUrl(respuesta.data.nuevaImagenUrl);
                }
                setImagen(null); // Limpiar el archivo de imagen seleccionado
                setTimeout(() => {
                    navigate(`/area-privada/verreceta/${recetaId}`); // Redirigir a la vista de la receta
                }, 1500);
            } else {
                setExito(false);
                setMensaje(respuesta.data.message || 'Error al actualizar la receta.');
            }
        } catch (error) {
            setExito(false);
            setMensaje('Hubo un error al procesar la solicitud de edición.');
            console.error('Error al editar receta:', error);
        }
    };

    if (cargandoReceta) {
        return (
            <>
                <Header />
                <main className="container mt-5 text-center">
                    <p>Cargando datos de la receta...</p>
                </main>
                <Footer />
            </>
        );
    }

    if (!cargandoReceta && !formReceta.nombre && !mensaje) { // Si no está cargando, no hay nombre y no hay mensaje de error de carga
        return (
            <>
                <Header />
                <main className="container mt-5 text-center">
                    <p>No se pudo cargar la receta o la receta no existe.</p>
                    <button onClick={() => navigate('/area-privada/editar-perfil', { state: { seccion: 'recetas' } })} className="btn btn-primary">
                        Volver a Mis Recetas
                    </button>
                </main>
                <Footer />
            </>
        );
    }


    return (
        <>
            <Header />
                <main>
                <div className="container mt-4">
                    <div className="d-flex align-items-center mb-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-secondary me-3" /* Estilo de botón más integrado y margen a la derecha */
                            title="Volver a la página anterior" /* Tooltip para accesibilidad y claridad */
                        >
                            &lt; Volver
                        </button>
                        <h2 className="mb-0 flex-grow-1 text-center">Editar Receta: {formReceta.nombre || "Cargando..."}</h2> {/* Título principal con mb-0 para alineación */}
                    </div>
                    {/* Aplicamos la misma estructura y clases que en EditarPerfil.jsx para la sección "crear" */}
                    <div className="crear-receta"> 
                        <form onSubmit={manejarEnvioEdicionReceta}>
                            <div className="crear-receta-info"> {/* Clase de EditarPerfil.jsx */}
                                <h3>Nombre de la Receta</h3>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder='Introduce el nombre de la receta'
                                    value={formReceta.nombre}
                                    onChange={manejarCambioReceta}
                                    onBlur={handleRecipeFieldBlur}
                                    required
                                />
                                {errorNombreReceta && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorNombreReceta}</span>}

                                <div className="subir-imagen-receta"> {/* Clase de EditarPerfil.jsx */}
                                    <h3>Imagen de la Receta</h3>
                                    {imagenPreview && (
                                        <div className="vista-previa-imagen">  {/* Clase de EditarPerfil.jsx (sin mb-2 para alinear con el original) */}
                                            <img src={imagenPreview} alt="Vista previa" style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginBottom: '10px' }} />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="imagen"
                                        accept="image/*"
                                        onChange={manejarCambioImagen}
                                    />
                                    {errorImagenReceta && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorImagenReceta}</span>}
                                </div>

                                <div className="info-basica-receta"> {/* Clase de EditarPerfil.jsx (sin row y mt-3 para alinear) */}
                                    <div className="apartado-dificultad"> {/* Clase de EditarPerfil.jsx (sin col-md-4) */}
                                        <h5>Introduce la dificultad</h5>
                                        <select
                                            name="dificultad"
                                            value={formReceta.dificultad}
                                            onChange={manejarCambioReceta}
                                            onBlur={handleRecipeFieldBlur}
                                            required
                                            className="form-select"
                                        >
                                            <option value="" disabled>Selecciona una dificultad</option>
                                            <option value="facil">Fácil</option>
                                            <option value="intermedio">Intermedio</option>
                                            <option value="dificil">Difícil</option>
                                        </select>
                                        {errorDificultad && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorDificultad}</span>}
                                    </div>
                                    <div className="apartado-tiempo col-md-4">
                                        <h5>Introduce el tiempo</h5>
                                        <input
                                            type="text"
                                            name="tiempo"
                                            placeholder='Tiempo en minutos'
                                            value={formReceta.tiempo}
                                            onChange={manejarCambioReceta}
                                            onBlur={handleRecipeFieldBlur}
                                            required
                                            className="form-control"
                                        />
                                        {errorTiempo && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorTiempo}</span>}
                                    </div>
                                    <div className="apartado-pais"> {/* Clase de EditarPerfil.jsx (sin col-md-4) */}
                                        <h5>Selecciona el país</h5>
                                        <select
                                            name="pais"
                                            value={formReceta.pais}
                                            onChange={manejarCambioReceta}
                                            onBlur={handleRecipeFieldBlur}
                                            className="form-select"
                                            aria-label="Selecciona el país"
                                        >
                                            <option value="" disabled>Selecciona un país</option>
                                            <option value="Italia">Italia</option>
                                            <option value="México">México</option>
                                            <option value="Japón">Japón</option>
                                            <option value="España">España</option>
                                            <option value="India">India</option>
                                            <option value="Francia">Francia</option>
                                            <option value="Alemania">Alemania</option>
                                            <option value="Estados Unidos">Estados Unidos</option>
                                            <option value="China">China</option>
                                            <option value="Brasil">Brasil</option>
                                            <option value="Tailandia">Tailandia</option>
                                            <option value="Grecia">Grecia</option>
                                            <option value="Turquía">Turquía</option>
                                            <option value="Corea del Sur">Corea del Sur</option>
                                            <option value="Libano">Líbano</option>
                                        </select>
                                        {errorPais && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorPais}</span>}
                                        <br /> 
                                    {/* Las siguientes secciones de booleanos se agrupan como en EditarPerfil.jsx */}
                                    <div className="apartado-gluten"> {/* Clase de EditarPerfil.jsx */}
                                        <h5>¿Contiene gluten?</h5>
                                        <label><input type="radio" name="gluten" value="sí" checked={formReceta.gluten === true} onChange={manejarCambioOpcionBooleanaReceta} /> Sí</label><br />
                                        <label><input type="radio" name="gluten" value="no" checked={formReceta.gluten === false} onChange={manejarCambioOpcionBooleanaReceta} /> No</label>
                                    </div>

                                    <div className="apartado-lactosa"> {/* Clase de EditarPerfil.jsx */}
                                        <h5>¿Contiene lactosa?</h5>
                                        <label><input type="radio" name="lactosa" value="sí" checked={formReceta.lactosa === true} onChange={manejarCambioOpcionBooleanaReceta} /> Sí</label><br />
                                        <label><input type="radio" name="lactosa" value="no" checked={formReceta.lactosa === false} onChange={manejarCambioOpcionBooleanaReceta} /> No</label>
                                    </div>
                                    <div className="apartado-vegetariana"> {/* Clase de EditarPerfil.jsx */}
                                        <h5>¿Es vegetariana?</h5>
                                        <label><input type="radio" name="vegetariana" value="sí" checked={formReceta.vegetariana === true} onChange={manejarCambioOpcionBooleanaReceta} /> Sí</label><br />
                                        <label><input type="radio" name="vegetariana" value="no" checked={formReceta.vegetariana === false} onChange={manejarCambioOpcionBooleanaReceta} /> No</label>
                                    </div>
                                    <div className="vegana"> {/* Clase de EditarPerfil.jsx */}
                                        <h5>¿Es vegana?</h5>
                                        <label><input type="radio" name="vegana" value="sí" checked={formReceta.vegana === true} onChange={manejarCambioOpcionBooleanaReceta} /> Sí</label><br />
                                        <label><input type="radio" name="vegana" value="no" checked={formReceta.vegana === false} onChange={manejarCambioOpcionBooleanaReceta} /> No</label>
                                    </div>
                                </div>
                            </div>
                            </div>

                            <div className="ingredientes-pasos"> {/* Clase de EditarPerfil.jsx (sin row y mt-4) */}
                                <div className="ingredientes-crear-receta"> {/* Clase de EditarPerfil.jsx (sin col-md-6) */}
                                  <div className="contenedor-ingredientes"> {/* Contenedor extra de EditarPerfil.jsx */}
                                    <h5>INGREDIENTES</h5>
                                    {ingredientes.length > 0 && (
                                        <table className="tabla-ingredientes table table-striped table-sm">
                                            <thead><tr><th>Nombre</th><th>Cantidad</th><th>Unidad</th><th></th></tr></thead> {/* Eliminado Acción del header para alinear */}
                                            <tbody>
                                                {ingredientes.map((ing, index) => (
                                                    <tr key={`ing-${index}`}><td>{ing.nombre}</td><td>{ing.cantidad}</td><td>{ing.unidad}</td>
                                                        <td><button type="button" onClick={() => handleRemoveIngrediente(index)}>Eliminar</button></td> {/* Botón sin clases Bootstrap para alinear */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    {errorIngredientesLista && <p style={{ color: 'red', minHeight: '1em' }}>{errorIngredientesLista}</p>}
                                    <div className="rellenar-ingrediente"> {/* Clase de EditarPerfil.jsx (sin card y p-3) */}
                                        Nombre Ingrediente:
                                        <input type="text" placeholder="Ej: Harina" value={newIngredienteNombre} onChange={(e) => { setNewIngredienteNombre(e.target.value); setErrorNuevoIngrediente(''); }} onBlur={() => handleNewIngredientFieldBlur('nombre')} />
                                        <span>Cantidad</span>
                                        <input type="text" placeholder="Ej: 200" value={newIngredienteCantidad} onChange={(e) => { setNewIngredienteCantidad(e.target.value); setErrorNuevoIngrediente(''); }} onBlur={() => handleNewIngredientFieldBlur('cantidad')} />
                                        <span>Unidad</span>
                                        <input type="text" placeholder="Ej: gramos" value={newIngredienteUnidad} onChange={(e) => { setNewIngredienteUnidad(e.target.value); setErrorNuevoIngrediente(''); }} onBlur={() => handleNewIngredientFieldBlur('unidad')} />
                                        <button type="button" onClick={handleAddIngrediente} className="anadir-ingrediente-btn">Añadir Ingrediente</button> {/* Clase de EditarPerfil.jsx */}
                                        {errorNuevoIngrediente && <span style={{ color: 'red', display: 'block', minHeight: '1em', marginTop: '5px' }}>{errorNuevoIngrediente}</span>}
                                    </div>
                                </div>
                                </div>

                                <div className="pasos-crear-receta"> {/* Clase de EditarPerfil.jsx (sin col-md-6) */}
                                    <h5>PASOS</h5>
                                    {pasos.length > 0 && (
                                        <table className="tabla-pasos table table-striped table-sm">
                                            <thead><tr><th>Paso</th><th>Descripción</th><th></th></tr></thead> {/* Eliminado Acción del header y # por Paso */}
                                            <tbody>
                                                {pasos.map((paso, index) => (
                                                    <tr key={`paso-${index}`}><td>{index + 1}</td><td>{paso}</td>
                                                        <td><button type="button" onClick={() => handleRemovePaso(index)}>Eliminar</button></td> {/* Botón sin clases Bootstrap */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    {errorPasosLista && <p style={{ color: 'red', minHeight: '1em' }}>{errorPasosLista}</p>}
                                    <div className="rellenar-pasos"> {/* Clase de EditarPerfil.jsx (sin card y p-3) */}
                                        Paso:
                                        <input type="text" placeholder="Describe el paso" value={newPaso} onChange={(e) => { setNewPaso(e.target.value); setErrorNuevoPaso(''); }} onBlur={handleNewStepFieldBlur} />
                                        <button type="button" onClick={handleAddPaso} className="anadir-pasos-btn">Añadir Paso</button> {/* Clase de EditarPerfil.jsx */}
                                        {errorNuevoPaso && <span style={{ color: 'red', display: 'block', minHeight: '1em', marginTop: '5px' }}>{errorNuevoPaso}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="botones-crear-receta"> {/* Clase de EditarPerfil.jsx (sin text-center, mt-4, mb-4) */}
                                <button className="botones-inversos" id="cancelar-receta" type='button' onClick={() => navigate(`/area-privada/verreceta/${recetaId}`)}> {/* Clase de EditarPerfil.jsx */}
                                    Cancelar
                                </button>
                                <button className="boton-crear-receta" id="terminar-receta" type="submit"> {/* Clase de EditarPerfil.jsx */}
                                    Guardar Cambios
                                </button>
                            </div>
                            {mensaje && (
                                <div className={`alert ${exito ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                                    {mensaje}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default EditarRecetaCreada;