import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListaCompra = ({ showListaCompra, setListaCompra, refreshTrigger }) => {
  const navigate = useNavigate();
  const offcanvasRef = useRef();
  const bsOffcanvasRef = useRef(null);

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

  const [listaCompra, setLista] = useState([]); // Lista de la compra
  const [nuevoProducto, setNuevoProducto] = useState({
    id_producto: "",
    cantidad: "",
  }); // Datos del producto para insertar
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error
  const [exito, setExito] = useState(false); // Estado de éxito o fallo

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
        setMensaje("Lista de compra obtenida correctamente.");
        setExito(true);
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
      for (const producto of listaCompra) {
        await deleteListaCompra(producto.nombre, producto.cantidad);
      }
      setMensaje("Lista de la compra vaciada correctamente.");
      setExito(true);
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

  // Mostrar la confirmación
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
        id="lista-offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h4 className="offcanvas-title" id="offcanvasExampleLabel"> {/* Ajustado tamaño para consistencia visual */}
            Lista de la Compra
          </h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        {/* Añadimos position: relative para que el pop-up se posicione correctamente dentro del offcanvas-body */}
        <div className="offcanvas-body" style={{ position: 'relative' }}>
          <div className="lista-compra-contenido"> {/* Contenedor para el contenido principal de la lista */}
            <h3>Ingredientes</h3>
            <ul>
              {listaCompra.map((producto) => (
                <li key={producto.id_producto}>
                  {producto.nombre} - Cantidad: {producto.cantidad}
                  <button
                    onClick={() => deleteListaCompra(producto.nombre, producto.cantidad)}
                    className="btn btn-danger btn-sm mx-2"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Botones principales del offcanvas, con un poco de separación superior */}
          <div className="botones-lista-compra pt-3 mt-3 border-top">
            <button className="btn btn-danger" onClick={handleMostrarConfirmacion}>
              Vaciar Lista
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/recetas")}
            >
              Ir a recetas
            </button>
          </div>

          {/* Panel de Confirmación (debajo de los botones) */}
          {mostrarConfirmacion && (
            <div style={{
              marginTop: '20px', // Espacio superior para separarlo de los botones
              padding: '20px',
              border: '1px solid #dee2e6', // Un borde sutil
              borderRadius: '8px',
              backgroundColor: '#f8f9fa', // Un fondo ligeramente diferente para distinguirlo
              textAlign: 'center',
              // maxWidth: '320px', // Opcional: si quieres limitar su ancho
              // margin: '0 auto' // Si se usa maxWidth, para centrarlo
            }}>
              <h5 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
                ¿Seguro que quieres vaciar tu lista de la compra?
              </h5>
              <button className="btn btn-danger me-2" onClick={handleConfirmarVaciado}>
                Sí, Vaciar
              </button>
              <button className="btn btn-secondary" onClick={handleCancelarVaciado}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListaCompra;