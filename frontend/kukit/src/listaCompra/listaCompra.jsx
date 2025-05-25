import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListaCompra = ({ showListaCompra, setListaCompra }) => {
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
        setListaCompra(false);
      });
    }

    // Mostrar el offcanvas solo cuando cambia a true
    if (showListaCompra) {
      bsOffcanvasRef.current.show();
    }

  }, [showListaCompra]);

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

  // Llamar a getListaCompra al cargar el componente
  useEffect(() => {
    getListaCompra();
  }, []);

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
          <h2 className="offcanvas-title" id="offcanvasExampleLabel">
            Lista de la Compra
          </h2>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div>
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
            {mostrarConfirmacion && (
              <div className="confirmacion-vaciar">
                <h1>¿Seguro que quieres vaciar tu lista de la compra?</h1>
                <div className="botones-lista-compra">
                  <button className="btn btn-danger" onClick={handleConfirmarVaciado}>Vaciar</button>
                  <button className="btn btn-secondary" onClick={handleCancelarVaciado}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
          <div className="botones-lista-compra">
            <button className="btn btn-danger" onClick={handleMostrarConfirmacion}>
              Vaciar Lista
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/recetas")}
            >Ir a recetas</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListaCompra;