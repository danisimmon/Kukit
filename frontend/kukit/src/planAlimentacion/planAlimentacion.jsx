import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';
import {useNavigate } from 'react-router-dom';

// Arrays con los dias de la semana y tipos de comida
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIPOS_COMIDA = [
  { key: 'desayuno', nombre: 'Desayuno' },
  { key: 'almuerzo', nombre: 'Almuerzo' },
  { key: 'comida', nombre: 'Comida' },
  { key: 'merienda', nombre: 'Merienda' },
  { key: 'cena', nombre: 'Cena' },
];
const NUMERO_SEMANAS_PLAN = 4; // El usuario puede planificar para 4 semanas
const API_BASE_URL = 'http://localhost/api/area_privada';
// URL para obtener (GET) y guardar (POST) el plan, apuntando a insertplanSemanal.php
const API_URL_SAVE_PLAN = 'http://localhost/api/plan-semanal/insertplanSemanal.php';
const API_URL_RECETAS_GUARDADAS = `${API_BASE_URL}/recetas/getRecetasGuardadas.php`;
const API_URL_RECETAS_CREADAS = `${API_BASE_URL}/recetas/getRecetasCreadas.php`;

const getDefaultPlan = () => Array(NUMERO_SEMANAS_PLAN).fill(null).map(() =>
  Array(DIAS_SEMANA.length).fill(null).map(() => TIPOS_COMIDA.reduce((acc, tipo) => {
    acc[tipo.key] = null;
    return acc;
  }, {}))
);

// Componente principal de la planificación semanal
function PlanificacionSemanal() {
  const [plan, setPlan] = useState([]);
  const [cargandoPlanInicial, setCargandoPlanInicial] = useState(true);
  const [semanaActualVisualizada, setSemanaActualVisualizada] = useState(0);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [recetasGuardadas, setRecetasGuardadas] = useState([]);
  const [recetasCreadas, setRecetasCreadas] = useState([]);
  const [slotParaEliminar, setSlotParaEliminar] = useState(null);
  const navigate = useNavigate();

  const recipeSelectorOffcanvasRef = useRef(null);
  const recipeSelectorOffcanvasInstance = useRef(null);
  const confirmDeleteModalRef = useRef(null);
  const confirmDeleteModalInstance = useRef(null);
  const vaciarPlanModalRef = useRef(null); // Ref para el modal de vaciar plan
  const vaciarPlanModalInstance = useRef(null); // Instancia del modal de vaciar plan

  useEffect(() => {
    const cargarPlan = async () => {
      setCargandoPlanInicial(true);
      try {
        // Usar la misma URL base para GET y POST, el método HTTP los diferencia
        const response = await axios.get(API_URL_SAVE_PLAN, { withCredentials: true });
        if (response.data && response.data.status === 'success' && response.data.data && Array.isArray(response.data.data.plan) && response.data.data.plan.length === NUMERO_SEMANAS_PLAN) {
          setPlan(response.data.data.plan);
        } else {
          console.warn("Plan no encontrado o formato incorrecto desde API, inicializando uno nuevo.", response.data);
          setPlan(getDefaultPlan());
        }
      } catch (error) {
        console.error("Error cargando el plan semanal:", error);
        setPlan(getDefaultPlan());
      } finally {
        setCargandoPlanInicial(false);
      }
    };

    cargarPlan();

    // Cargar recetas guardadas
    const cargarRecetasGuardadas = async () => {
      try {
        const response = await axios.get(API_URL_RECETAS_GUARDADAS, {
          withCredentials: true,
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setRecetasGuardadas(data);
        } else if (data && Array.isArray(data.recetas)) {
          setRecetasGuardadas(data.recetas);
        } else if (data && data.n_recetas && Array.isArray(data.n_recetas)) {
          setRecetasGuardadas(data.n_recetas);
        } else {
          setRecetasGuardadas([]);
          console.error("Respuesta inesperada recetas guardadas:", data);
        }
      } catch (error) {
        setRecetasGuardadas([]);
        console.error("Error cargando recetas guardadas:", error);
      }
    };

    // Cargar recetas creadas
    const cargarRecetasCreadas = async () => {
      try {
        const response = await axios.get(API_URL_RECETAS_CREADAS, {
          withCredentials: true,
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setRecetasCreadas(data);
        } else if (data && Array.isArray(data.recetas)) {
          setRecetasCreadas(data.recetas);
        } else if (data && data.n_recetas && Array.isArray(data.n_recetas)) {
          setRecetasCreadas(data.n_recetas);
        } else {
          setRecetasCreadas([]);
          console.error("Respuesta inesperada recetas creadas:", data);
        }
      } catch (error) {
        setRecetasCreadas([]);
        console.error("Error cargando recetas creadas:", error);
      }
    };

    cargarRecetasGuardadas();
    cargarRecetasCreadas();

    // Inicializar Bootstrap Offcanvas y Modal
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then(bootstrap => {
      if (recipeSelectorOffcanvasRef.current && !recipeSelectorOffcanvasInstance.current) {
        recipeSelectorOffcanvasInstance.current = new bootstrap.Offcanvas(recipeSelectorOffcanvasRef.current);
      }
      if (confirmDeleteModalRef.current && !confirmDeleteModalInstance.current) {
        confirmDeleteModalInstance.current = new bootstrap.Modal(confirmDeleteModalRef.current);
      }
      if (vaciarPlanModalRef.current && !vaciarPlanModalInstance.current) { // Inicializar modal de vaciar plan
        vaciarPlanModalInstance.current = new bootstrap.Modal(vaciarPlanModalRef.current);
      }
    }).catch(err => console.error("No se pudo cargar Bootstrap JS", err));

    return () => {
      if (recipeSelectorOffcanvasInstance.current) {
        recipeSelectorOffcanvasInstance.current.dispose();
        recipeSelectorOffcanvasInstance.current = null;
      }
      if (confirmDeleteModalInstance.current) {
        confirmDeleteModalInstance.current.dispose();
        confirmDeleteModalInstance.current = null;
      }
      if (vaciarPlanModalInstance.current) { // Limpiar instancia del modal de vaciar plan
        vaciarPlanModalInstance.current.dispose();
        vaciarPlanModalInstance.current = null;
      }
    };
  }, []);

  const guardarPlan = async (planAGuardar) => {
    try {
      const response = await axios.post(API_URL_SAVE_PLAN, { plan: planAGuardar }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (response.data && response.data.status === 'success') {
        console.log("Plan guardado exitosamente.");
      } else {
        console.error("Error al guardar el plan:", response.data.message || "Respuesta desconocida del servidor.");
      }
    } catch (error) {
      console.error("Error de red o servidor al guardar el plan:", error);
    }
  };

  const cambiarSemana = (direccion) => {
    setSemanaActualVisualizada(prev => {
      const nuevaSemana = prev + direccion;
      if (nuevaSemana >= 0 && nuevaSemana < NUMERO_SEMANAS_PLAN) {
        return nuevaSemana;
      }
      return prev;
    });
  };

  const abrirSelectorRecetas = (semanaIndex, diaIndex, tipoComidaKey) => {
    setSlotSeleccionado({ semanaIndex, diaIndex, tipoComidaKey });
    if (recipeSelectorOffcanvasRef.current && recipeSelectorOffcanvasInstance.current) {
      recipeSelectorOffcanvasInstance.current.show();
    } else if (recipeSelectorOffcanvasRef.current) {
      console.warn("Instancia de Offcanvas no encontrada, intentando reinicializar.");
      // @ts-ignore
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(bootstrap => {
        recipeSelectorOffcanvasInstance.current = new bootstrap.Offcanvas(recipeSelectorOffcanvasRef.current);
        recipeSelectorOffcanvasInstance.current.show();
      }).catch(err => console.error("No se pudo cargar Bootstrap JS para abrir Offcanvas", err));
    } else {
      console.error("Referencia al DOM del Offcanvas no encontrada. No se puede abrir.");
    }
  };



  const seleccionarRecetaParaSlot = async (receta) => {
    if (!slotSeleccionado) return;

    const { semanaIndex, diaIndex, tipoComidaKey } = slotSeleccionado;

    const nuevoPlan = plan.map((semana, sIndex) => {
      if (sIndex === semanaIndex) {
        return semana.map((dia, dIndex) => {
          if (dIndex === diaIndex) {
            return {
              ...dia,
              [tipoComidaKey]: receta,
            };
          }
          return dia;
        });
      }
      return semana;
    });

    setPlan(nuevoPlan);
    await guardarPlan(nuevoPlan);
    if (recipeSelectorOffcanvasInstance.current) {
      recipeSelectorOffcanvasInstance.current.hide();
    }
    setSlotSeleccionado(null);
  };

  const iniciarEliminacionComida = (semanaIndex, diaIndex, tipoComidaKey) => {
    setSlotParaEliminar({ semanaIndex, diaIndex, tipoComidaKey });

    if (confirmDeleteModalInstance.current) {
      confirmDeleteModalInstance.current.show();
    } else if (confirmDeleteModalRef.current) {
      // Intentar crear la instancia en caliente
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(bootstrap => {
        confirmDeleteModalInstance.current = new bootstrap.Modal(confirmDeleteModalRef.current);
        confirmDeleteModalInstance.current.show();
      }).catch(err => console.error("Error al crear modal dinámicamente:", err));
    } else {
      console.error("Referencia al DOM del modal no encontrada.");
    }
  };

  const confirmarEliminacionComida = async () => {
    if (!slotParaEliminar) return;

    const { semanaIndex, diaIndex, tipoComidaKey } = slotParaEliminar;

    const nuevoPlan = plan.map((semana, sIndex) => {
      if (sIndex === semanaIndex) {
        return semana.map((dia, dIndex) => {
          if (dIndex === diaIndex) {
            return {
              ...dia,
              [tipoComidaKey]: null,
            };
          }
          return dia;
        });
      }
      return semana;
    });

    setPlan(nuevoPlan);
    await guardarPlan(nuevoPlan);
    if (confirmDeleteModalInstance.current) {
      confirmDeleteModalInstance.current.hide();
    }
    setSlotParaEliminar(null);
  };

  const cancelarEliminacion = () => {
    if (confirmDeleteModalInstance.current) {
      confirmDeleteModalInstance.current.hide();
    }
    setSlotParaEliminar(null);
  };

  const abrirConfirmacionVaciarPlan = () => {
    // Primero, verificar si la instancia del modal existe y tiene el método show
    if (vaciarPlanModalInstance.current && typeof vaciarPlanModalInstance.current.show === 'function') {
      vaciarPlanModalInstance.current.show();
    } else if (vaciarPlanModalRef.current) {
      // Si la instancia no existe (o no es válida) pero el ref al elemento DOM sí, intentar crearla
      // Esto es una salvaguarda si la inicialización en useEffect falló o aún no se completó.
      console.warn("Instancia de vaciarPlanModal no encontrada o inválida al intentar abrir, intentando inicializar dinámicamente...");
      // @ts-ignore
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(bootstrap => {
        // Volver a verificar por si se creó en el intertanto o por el useEffect inicial
        // y asegurarse de que no se re-inicialice innecesariamente si ya existe.
        if (!vaciarPlanModalInstance.current || typeof vaciarPlanModalInstance.current.show !== 'function') {
            vaciarPlanModalInstance.current = new bootstrap.Modal(vaciarPlanModalRef.current);
        }
        // Asegurarse de que la instancia se creó correctamente antes de llamar a show()
        if (vaciarPlanModalInstance.current && typeof vaciarPlanModalInstance.current.show === 'function') {
            vaciarPlanModalInstance.current.show();
        } else {
            console.error("No se pudo crear o encontrar la instancia del modal de vaciar plan para mostrarla después del intento de inicialización.");
        }
      }).catch(err => {
        console.error("Error al importar Bootstrap o crear modal de vaciar plan dinámicamente:", err);
      });
    } else {
      console.error("Referencia al DOM del modal de vaciar plan (vaciarPlanModalRef) no encontrada. No se puede abrir el modal.");
    }
  };

  const confirmarVaciarPlan = async () => {
    setPlan(getDefaultPlan());
    await guardarPlan(getDefaultPlan());
    if (vaciarPlanModalInstance.current) {
      vaciarPlanModalInstance.current.hide();
    }
  };

  if (cargandoPlanInicial) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando planificación...</span>
        </div>
      </div>
    );
  }

  // Fallback por si algo muy extraño ocurre y el plan no se carga ni se inicializa
  if (!plan || plan.length !== NUMERO_SEMANAS_PLAN) {
    return <div className="container mt-5 text-center alert alert-danger">Error: No se pudo cargar la estructura del plan. Intente recargar la página.</div>;
  }

  const semanaVisible = plan[semanaActualVisualizada];
  return (
    <>
      <Header />
      {/* Contenedor para el botón de volver y el título, fuera del main */}
      <div className="container mt-3 mb-3"> {/* Ajusta mt-3 y mb-3 según necesites para el espaciado */}
        <div className="d-flex align-items-center">
          {/* Botón para volver atrás */}
          <button
            onClick={() => navigate(-1)}
            className="btn volver me-3" /* Estilo de botón y margen a la derecha */
            title="Volver a la página anterior"
          >
            Volver
          </button>
          {/* Título principal de la página */}
          <h2 className="mb-0">Planificación Semanal de Comidas</h2> {/* mb-0 para quitar margen inferior si el contenedor d-flex ya lo maneja */}
        </div>
      </div>
      <main>
        <div className="container">

          <div className="d-flex justify-content-between align-items-center mb-3 semana-navegacion">
            <button
              className="btn"
              onClick={() => cambiarSemana(-1)}
              disabled={semanaActualVisualizada === 0}
              style={{fontWeight: 'bold'}}
            >
              &laquo; Semana Anterior
            </button>
            <h4>Semana {semanaActualVisualizada + 1} de {NUMERO_SEMANAS_PLAN}</h4>
            <button
              className="btn"
              onClick={() => cambiarSemana(1)}
              disabled={semanaActualVisualizada === NUMERO_SEMANAS_PLAN - 1}
              style={{fontWeight: 'bold'}}
            >
              Semana Siguiente &raquo;
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th>Comida</th>
                  {DIAS_SEMANA.map(dia => <th key={dia}>{dia}</th>)}
                </tr>
              </thead>
              <tbody>
                {TIPOS_COMIDA.map(tipoComida => (
                  <tr key={tipoComida.key}>
                    <td><strong>{tipoComida.nombre}</strong></td>
                    {DIAS_SEMANA.map((diaNombre, diaIndex) => {
                      const comidaPlanificada =
                        semanaVisible && semanaVisible[diaIndex]
                          ? semanaVisible[diaIndex][tipoComida.key]
                          : null;
                      return (
                        <td key={`${diaNombre}-${tipoComida.key}`} style={{ verticalAlign: 'middle' }}>
                          {comidaPlanificada ? (
                            <div>
                              <span>{comidaPlanificada.nombre}</span>
                              <div className="mt-1">
                                <button
                                  className="btn btn-sm me-1"
                                  onClick={() => abrirSelectorRecetas(semanaActualVisualizada, diaIndex, tipoComida.key)}
                                  title="Cambiar receta"
                                  style={{borderColor: '#c00000'}}
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => iniciarEliminacionComida(semanaActualVisualizada, diaIndex, tipoComida.key)}
                                  title="Eliminar receta"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="btn btn-sm"
                              onClick={() => abrirSelectorRecetas(semanaActualVisualizada, diaIndex, tipoComida.key)}
                            >
                              + Añadir
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/*Botón vaciar plan*/}
        <button id="vaciarPlanButton"
          className="btn vaciar-plan"
          onClick={abrirConfirmacionVaciarPlan}
        >
          Vaciar Plan
        </button>


        {/* Offcanvas para Selector de Recetas */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="recipeSelectorOffcanvas"
          aria-labelledby="recipeSelectorOffcanvasLabel"
          ref={recipeSelectorOffcanvasRef}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="recipeSelectorOffcanvasLabel">Seleccionar Receta</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => recipeSelectorOffcanvasInstance.current && recipeSelectorOffcanvasInstance.current.hide()}
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            {slotSeleccionado && (
              <p>
                Añadiendo/Editando para: Semana {slotSeleccionado.semanaIndex + 1}, {DIAS_SEMANA[slotSeleccionado.diaIndex]}, {TIPOS_COMIDA.find(tc => tc.key === slotSeleccionado.tipoComidaKey)?.nombre}
              </p>
            )}
            <hr />
            <h6>Recetas Guardadas</h6>
            <ul className="list-group mb-3">
              {recetasGuardadas.length > 0 ? (
                recetasGuardadas.map((receta, index) => (
                  <li
                    key={receta.id_receta ?? receta.id ?? `receta-guardada-${index}`}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => seleccionarRecetaParaSlot(receta)}
                  >
                    {receta.nombre}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No tienes recetas guardadas.</li>
              )}
            </ul>

            <h6>Mis Recetas Creadas</h6>
            <ul className="list-group">
              {recetasCreadas.length > 0 ? (
                recetasCreadas.map((receta, index) => (
                  <li
                    key={receta.id ?? `receta-creada-${index}`}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => seleccionarRecetaParaSlot(receta)}
                  >
                    {receta.nombre}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No has creado recetas.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Modal de Confirmación de Eliminación */}
        <div
          className="modal fade"
          id="confirmDeleteModal"
          tabIndex="-1"
          aria-labelledby="confirmDeleteModalLabel"
          aria-hidden="true"
          ref={confirmDeleteModalRef}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmDeleteModalLabel">Confirmar Eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelarEliminacion}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que quieres eliminar esta comida de tu planificación?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelarEliminacion}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={confirmarEliminacionComida}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Confirmación para Vaciar Plan */}
        <div
          className="modal fade"
          id="confirmVaciarPlanModal"
          tabIndex="-1"
          aria-labelledby="confirmVaciarPlanModalLabel"
          aria-hidden="true"
          ref={vaciarPlanModalRef}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmVaciarPlanModalLabel">Confirmar Vaciar Plan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => vaciarPlanModalInstance.current && vaciarPlanModalInstance.current.hide()}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que quieres vaciar todo el plan? Esta acción no se puede deshacer.
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => vaciarPlanModalInstance.current && vaciarPlanModalInstance.current.hide()}
                >
                  No
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ backgroundColor: '#fff', color: '#c00000', borderColor: '#c00000', fontWeight: 'bold' }} 
                  onClick={confirmarVaciarPlan}>Sí, Vaciar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default PlanificacionSemanal;
