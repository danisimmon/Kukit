import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import editar from '../img/editar.png'; 
import eliminar from '../img/cerrar.png';

const ListaCompra = ({ showListaCompra, setListaCompra, refreshTrigger }) => {
  const navigate = useNavigate();
  const offcanvasRef = useRef();
  const bsOffcanvasRef = useRef(null);
  const addIngredientModalRef = useRef(); // Ref para el modal de añadir ingrediente
  const bsAddIngredientModalRef = useRef(null); // Instancia de Bootstrap Modal para añadir
  const editIngredientModalRef = useRef(); // Ref para el modal de editar ingrediente
  const bsEditIngredientModalRef = useRef(null); // Instancia de Bootstrap Modal para editar

  // Estados
  const [listaCompra, setLista] = useState([]); // Lista de la compra
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    cantidad: "",
    unidad: "unidad", // Valor por defecto para la unidad en el modal de añadir
  }); // Datos del producto para insertar
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error
  const [exito, setExito] = useState(false); // Estado de éxito o fallo
  const [showAddModal, setShowAddModal] = useState(false); // Estado para mostrar el modal de añadir producto
  const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal de editar producto
  const [productoAEditar, setProductoAEditar] = useState({
    id_producto: null,
    nombre: "",
    cantidad: "",
    unidad: "unidad", // Valor por defecto para la unidad en el modal de editar
  }); // Datos del producto que se está editando

  // Unidades de medida disponibles
  const unidades = ["unidad", "gramos", "kilogramos", "litros", "mililitros", "cucharadas", "cucharaditas"];

  // Efecto para controlar el Offcanvas
  useEffect(() => {
    if (!offcanvasRef.current || !window.bootstrap?.Offcanvas) return;

    // Solo inicializamos una vez
    if (!bsOffcanvasRef.current) {
      bsOffcanvasRef.current = new window.bootstrap.Offcanvas(offcanvasRef.current);

      // Listener que se dispara cuando se cierra el offcanvas
      offcanvasRef.current.addEventListener("hidden.bs.offcanvas", () => {
        if (typeof setListaCompra === 'function') {
          setListaCompra(false);
        }
      });
    }

    // Mostrar el offcanvas solo cuando cambia a true
    if (showListaCompra) {
      bsOffcanvasRef.current.show();
    }

  }, [showListaCompra, setListaCompra]);

  // Efecto para controlar el Modal de Añadir Ingrediente
  useEffect(() => {
    if (!addIngredientModalRef.current || !window.bootstrap?.Modal) return;

    // Inicializar la instancia del modal solo una vez
    if (!bsAddIngredientModalRef.current) {
      bsAddIngredientModalRef.current = new window.bootstrap.Modal(addIngredientModalRef.current);
    }

    // Mostrar u ocultar el modal basado en el estado `showAddModal`
    if (showAddModal) {
      bsAddIngredientModalRef.current.show();
    } else {
      // Solo ocultar si la instancia existe para evitar errores
      if (bsAddIngredientModalRef.current) {
        bsAddIngredientModalRef.current.hide();
      }
    }
  }, [showAddModal]); // Dependencia del estado showAddModal

  // Efecto para controlar el Modal de Editar Ingrediente
  useEffect(() => {
    if (!editIngredientModalRef.current || !window.bootstrap?.Modal) return;

    // Inicializar la instancia del modal solo una vez
    if (!bsEditIngredientModalRef.current) {
      bsEditIngredientModalRef.current = new window.bootstrap.Modal(editIngredientModalRef.current);
    }

    // Mostrar u ocultar el modal basado en el estado `showEditModal`
    if (showEditModal) {
      bsEditIngredientModalRef.current.show();
    } else {
      // Solo ocultar si la instancia existe para evitar errores
      if (bsEditIngredientModalRef.current) {
        bsEditIngredientModalRef.current.hide();
      }
    }
  }, [showEditModal]); // Dependencia del estado showEditModal

  // Funciones para mostrar/ocultar modales
  const handleShowAddModal = () => {
    setShowAddModal(true);
    setMensaje(""); // Limpiar mensajes al abrir el modal
    setExito(false);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNuevoProducto({ nombre: "", cantidad: "", unidad: "unidad" }); // Resetear el formulario al cerrar
  };

  const handleShowEditModal = (producto) => {
    // *** DEBUGGING: Log the product object to see its structure and id_producto ***
    console.log("Producto a editar:", producto);
    console.log("ID del producto a editar:", producto.id_producto, typeof producto.id_producto);

    // Parsear la cantidad para separar el número y la unidad
    const cantidadParts = producto.cantidad.split(' ');
    const cantidadNum = cantidadParts[0] || '';
    const unidadStr = cantidadParts.slice(1).join(' ') || 'unidad'; // Reconstruir la unidad si tiene espacios

    setProductoAEditar({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      cantidad: cantidadNum,
      unidad: unidades.includes(unidadStr) ? unidadStr : 'unidad', // Asegurarse de que la unidad sea válida
    });
    setShowEditModal(true);
    setMensaje(""); // Limpiar mensajes al abrir el modal
    setExito(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setProductoAEditar({ id_producto: null, nombre: "", cantidad: "", unidad: "unidad" }); // Resetear el estado
  };

  // Manejadores de cambio para los inputs de los modales
  const handleAddInputChange = (event) => {
    const { name, value } = event.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]: value,
    });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setProductoAEditar({
      ...productoAEditar,
      [name]: value,
    });
  };

  // Obtener la lista de la compra
  const getListaCompra = async () => {
    try {
      const response = await axios.get(
        "http://localhost/api/area_privada/listaCompra/getListaCompra.php",
        {
          withCredentials: true,
        }
      );
      if (response.data.status === "success") {
        setLista(response.data.data || []);
      } else {
        setMensaje(
          response.data.message || "Error al obtener la lista de la compra."
        );
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al obtener la lista de la compra.");
      setExito(false);
      console.error(error);
    }
  };

  // Añadir un producto a la lista de la compra
  const addListaCompra = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.cantidad) {
      setMensaje("El nombre y la cantidad son obligatorios.");
      setExito(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/api/area_privada/listaCompra/insertListaCompra.php", // Asumiendo que este es el endpoint correcto para añadir
        nuevoProducto,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success === "true") {
        setMensaje(response.data.message || "Producto añadido correctamente.");
        setExito(true);
        getListaCompra(); // Actualizar la lista
        handleCloseAddModal(); // Cerrar el modal después de añadir
      } else {
        setMensaje(response.data.message || "Error al añadir el producto.");
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al añadir el producto.");
      setExito(false);
      console.error(error);
    }
  };

  // Actualizar un producto de la lista de la compra
  const updateListaCompra = async () => {
    if (!productoAEditar.cantidad) {
      setMensaje("La cantidad es obligatoria.");
      setExito(false);
      return;
    }
    // Combinar la cantidad y la unidad para el backend
    const cantidadConUnidad = `${productoAEditar.cantidad} ${productoAEditar.unidad}`;

    try {
      // *** IMPORTANT: Ensure id_producto is a number before sending to PHP backend ***
      const idProductoNum = Number(productoAEditar.id_producto);

      const response = await axios.post(
        "http://localhost/api/area_privada/listaCompra/updateListaCompra.php",
        { id_producto: idProductoNum, cantidad: cantidadConUnidad },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success === "true") {
        setMensaje(response.data.message || "Cantidad actualizada correctamente.");
        setExito(true);
        getListaCompra(); // Actualizar la lista
        handleCloseEditModal(); // Cerrar el modal después de actualizar
      } else {
        setMensaje(response.data.message || "Error al actualizar la cantidad.");
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al actualizar la cantidad.");
      setExito(false);
      console.error(error);
    }
  };

  // Eliminar un producto de la lista de la compra
  const deleteListaCompra = async (nombre, cantidad) => {
    try {
      const response = await axios.post(
        "http://localhost/api/area_privada/listaCompra/deleteListaCompra.php",
        { nombre, cantidad },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success === "true") {
        setMensaje(
          response.data.message || "Producto eliminado correctamente."
        );
        setExito(true);
        getListaCompra(); // Actualizar la lista
      } else {
        setMensaje(response.data.message || "Error al eliminar el producto.");
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al eliminar el producto.");
      setExito(false);
      console.error(error);
    }
  };

  // Vaciar la lista de la compra
  const vaciarListaCompra = async () => {
    try {
      // Usar Promise.all para esperar a que todas las eliminaciones se completen
      await Promise.all(listaCompra.map(producto =>
        deleteListaCompra(producto.nombre, producto.cantidad)
      ));
      setMensaje("Lista de la compra vaciada correctamente.");
      setExito(true);
      getListaCompra(); // Recargar la lista después de vaciar
    } catch (error) {
      setMensaje("Error al vaciar la lista de la compra.");
      setExito(false);
      console.error(error);
    }
  };

  // Efecto para cargar/recargar la lista de la compra
  useEffect(() => {
    if (showListaCompra) { // Solo cargar si el offcanvas está destinado a estar visible
      getListaCompra();
    }
  }, [showListaCompra, refreshTrigger]); // Recargar si se muestra o si hay un trigger de refresco

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Mostrar la confirmación para vaciar lista
  const handleMostrarConfirmacion = () => {
    setMostrarConfirmacion(true);
  };

  // Ocultar sin vaciar
  const handleCancelarVaciado = () => {
    setMostrarConfirmacion(false);
  };

  // Confirmar y vaciar la lista
  const handleConfirmarVaciado = async () => {
    await vaciarListaCompra();
    setMostrarConfirmacion(false); // Ocultamos después
  };

  return (
    <>
      {/* Offcanvas de la Lista de la Compra */}
      <div
        ref={offcanvasRef}
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="lista-offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel" style={{ fontSize: '1.25rem', fontWeight: '500' }}>
            Lista de la Compra
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Botón para añadir ingrediente */}
          <div className="mb-3">
            <button className="btn no-hover btn-sm me-2 volver-receta" onClick={handleShowAddModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
              </svg>
              Añadir
            </button>
          </div>

          {/* Mensaje de éxito/error */}
          {mensaje && (
            <div className={`alert ${exito ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
              {mensaje}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setMensaje("")}></button>
            </div>
          )}

          {/* Contenido de la lista de la compra */}
          <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
            <h6 style={{ marginTop: '0', marginBottom: '15px', fontSize: '1rem', fontWeight: 'bold', color: '#495057' }}>
              TUS INGREDIENTES
            </h6>
            <div className="lista-compra-contenido">
            
            <ul className="list-group" style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
              {listaCompra.map((producto) => (
                <li className="lista-compra-item"
                  key={producto.id_producto}
                  style={{
                    display: 'flex',
                    alignItems: 'center', 
                    padding: '12px 8px',
                    borderBottom: '1px solid #e9ecef',
                    marginBottom: '0',
                    flexDirection: "row-reverse"
                  }}
                >
                  {/* Imágenes editar / eliminar */}
                  <img src={eliminar}
                  alt="eliminar"
                  className="eliminarImagen me-2"
                  style={{padding: '2px 6px', lineHeight: '1.2', borderRadius: '50%', maxWidth: "13%"}}
                  onClick={() => deleteListaCompra(producto.nombre, producto.cantidad)}
                  />
                  {/* <button
                    
                    className="btn btn-sm no-hover " // Añadido me-2 para margen derecho
                    style={{ padding: '2px 6px', lineHeight: '1.2', borderRadius: '50%' }}
                  > */}
                    {/* &times;
                  </button> */}
                    <img src={editar}
                    alt="editar"
                    className="editarImagen me-2"
                    style={{ padding: '2px 6px', lineHeight: '1.2', borderRadius: '50%',maxWidth: "13%"}}
                    onClick={() => handleShowEditModal(producto)}/>
                  
                  <span
                    style={{
                      flexGrow: 1,
                      fontSize: '0.9rem',
                      color: '#212529'
                    }}
                  >
                    
                    <strong style={{ fontWeight: '500' }}>{producto.nombre}</strong>
                    {producto.cantidad && <span style={{ color: '#6c757d', marginLeft: '5px' }}>- Cantidad: {producto.cantidad}</span>}
                  </span>
                </li>
              ))} 
            </ul>
            </div>
            {listaCompra.length === 0 && (
              <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '20px' }}>
                Tu lista de la compra está vacía.
              </p>
            )}
          </div>

          {/* Botones principales del offcanvas */}
          <div className="botones-lista-compra pt-3 mt-auto border-top" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', paddingBottom: '10px' }}>
            <button className="btn btn-danger no-hover" style={{ flexGrow: 1 }} onClick={handleMostrarConfirmacion}>
              Vaciar Lista
            </button>
            <button
              className="btn btn-secondary volver-receta"
              style={{ flexGrow: 1 }}
              onClick={() => {
                if (bsOffcanvasRef.current) {
                  bsOffcanvasRef.current.hide(); // Oculta el offcanvas de Bootstrap
                }
                navigate("/recetas"); // Navega después de iniciar el cierre
              }}
            >
              Ir a recetas
            </button>
          </div>

          {/* Panel de Confirmación */}
          {mostrarConfirmacion && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              textAlign: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <p style={{ marginBottom: '15px', fontSize: '0.95rem', color: '#343a40' }}>
                ¿Seguro que quieres vaciar tu lista de la compra?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontWeight: 'bold' }}>
                <button className="btn btn-danger no-hover btn-sm" onClick={handleConfirmarVaciado}>
                  Sí, Vaciar
                </button>
                <button className="btn btn-sm" onClick={handleCancelarVaciado}
                style={{borderColor: '#c33333', backgroundColor: '#fff', color: '#c33333', fontWeight: 'bold'}}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para añadir ingrediente */}
      <div
        className="modal fade"
        id="addIngredientModal"
        tabIndex="-1"
        aria-labelledby="addIngredientModalLabel"
        aria-hidden="true"
        ref={addIngredientModalRef} // Asignar la referencia al div del modal
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addIngredientModalLabel">Añadir Ingrediente</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseAddModal}></button>
            </div>
            <div className="modal-body">
              {/* Mensaje de error dentro del modal */}
              {mensaje && !exito && (
                <div className="alert alert-danger" role="alert">
                  {mensaje}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="nombreProducto" className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Leche, Pan, etc."
                  id="nombreProducto"
                  name="nombre"
                  value={nuevoProducto.nombre}
                  onChange={handleAddInputChange} // Usar el manejador específico para añadir
                />
              </div>
              <div className="mb-3">
                <label htmlFor="cantidadProducto" className="form-label">Cantidad</label>
                <input
                  type="number"
                  placeholder="Ej: 1, 2, 20, etc."
                  className="form-control"
                  id="cantidadProducto"
                  name="cantidad"
                  value={nuevoProducto.cantidad}
                  onChange={handleAddInputChange} // Usar el manejador específico para añadir
                />
              </div>
              <div className="mb-3">
                <label htmlFor="unidadProducto" className="form-label">Unidad</label>
                <select
                  className="form-select"
                  id="unidadProducto"
                  name="unidad"
                  value={nuevoProducto.unidad}
                  onChange={handleAddInputChange} // Usar el manejador específico para añadir
                >
                  {unidades.map((unidad) => (
                    <option key={unidad} value={unidad}>{unidad}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" style={{ backgroundColor: '#fff', color: '#c33333', borderColor: '#c33333',fontweight: "bold" }} data-bs-dismiss="modal" onClick={handleCloseAddModal}>Cancelar</button>
              <button type="button" className="btn"
              style={{ backgroundColor: '#c33333', color: '#fff',fontweight: "bold" }}
              onClick={addListaCompra}>Añadir</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar ingrediente */}
      <div
        className="modal fade"
        id="editIngredientModal"
        tabIndex="-1"
        aria-labelledby="editIngredientModalLabel"
        aria-hidden="true"
        ref={editIngredientModalRef} // Asignar la referencia al div del modal de edición
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editIngredientModalLabel">Editar Ingrediente</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseEditModal}></button>
            </div>
            <div className="modal-body">
              {/* Mensaje de error dentro del modal de edición */}
              {mensaje && !exito && (
                <div className="alert alert-danger" role="alert">
                  {mensaje}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="editNombreProducto" className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-control"
                  id="editNombreProducto"
                  name="nombre"
                  value={productoAEditar.nombre}
                  disabled // El nombre no se edita, solo la cantidad
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editCantidadProducto" className="form-label">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  id="editCantidadProducto"
                  name="cantidad"
                  value={productoAEditar.cantidad}
                  onChange={handleEditInputChange} // Usar el manejador específico para editar
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editUnidadProducto" className="form-label">Unidad</label>
                <select
                  className="form-select"
                  id="editUnidadProducto"
                  name="unidad"
                  value={productoAEditar.unidad}
                  onChange={handleEditInputChange} // Usar el manejador específico para editar
                >
                  {unidades.map((unidad) => (
                    <option key={unidad} value={unidad}>{unidad}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" style={{ backgroundColor: '#fff', color: '#c33333',fontweight: "bold" }} data-bs-dismiss="modal" onClick={handleCloseEditModal}>Cancelar</button>
              <button type="button" className="btn boton-popup-guardar" style={{ backgroundColor: '#c33333', color: '#fff',fontweight: "bold" }} onClick={updateListaCompra}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListaCompra;
