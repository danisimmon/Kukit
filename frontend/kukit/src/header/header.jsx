import React, { useState, useEffect } from 'react';
import logo from '../img/logo_kukit.png';
import Login from '../login/login';
import Registro from '../login/registro/registro';
import ListaCompra from '../listaCompra/listaCompra';
import { NavLink } from 'react-router-dom'; // Cambiado Link por NavLink
import { useNavigate } from 'react-router-dom';
import Recetas from '../area-privada/recetas';
import DesplegablePerfil from '../area-privada/desplegable-perfil'


function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showListaCompra, setListaCompra] = useState(false);
  const [showDesplegablePerfil, setDesplegablePerfil] = useState(false);
  const [recetas, setRecetas] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const fetchRecetas = async () => {
  //     try {
  //       const response = await fetch('http://localhost/api/area_privada/recetas/getRecetas.php');
  //       const data = await response.json();
  //       // Ordena las recetas por algún criterio fijo si necesitas que siempre sean las mismas
  //       // Ejemplo: por nombre (alfabéticamente), por id, o similar.
  //       const recetasOrdenadas = [...data.recetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
  //       setRecetas(recetasOrdenadas.slice(0, 4));
  //     } catch (error) {
  //       console.error('Error cargando recetas:', error);
  //     }
  //   };
  //   fetchRecetas();
  // }, []);

  useEffect(() => {
    fetch("http://localhost/api/login/gestion-autenticacion/gestion-autenticacion.php", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta del backend:", data);
        setLoggedIn(data.loggedIn);
        if (data.loggedIn) {
          setUser(data.user); // opcional, si quieres guardar el correo del usuario
        } else {
          setUser(null);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <header>
        <a href="/home" id="logo-header">
          <img src={logo} alt="" id="logo-header" />
        </a>
        <button id="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav>
          <ul>
            <li>
              <NavLink to="/recetas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
                Recetas
              </NavLink>
            </li>
            <li>
              <NavLink to="/recetas/recetasguardadas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Recetas Guardadas
              </NavLink>
            </li>
            {/* Para "Lista de la Compra", como no es una ruta, el estilo activo se manejaría diferente si es necesario */}
            <li onClick={() => setListaCompra(true)} className="nav-link-li">Lista de la Compra</li>
            <li>
              <NavLink to="/planAlimentacion" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Plan de alimentación
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="contenedor-header">
          {!loggedIn && (
            <>
              <button className="sign-in" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
              <button className="sign-up" onClick={() => setShowRegistro(true)} id="sign-up">Regístrate</button>
            </>
          )}
          {loggedIn && (
            <button className="mi-perfil" onClick={() => setDesplegablePerfil(true)}>Perfil</button>
          )}
        </div>
      </header>
      <div id="pop-up-sign-in" style={{ display: showLogin ? 'flex' : 'none' }} onClick={() => setShowLogin(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <Login setShowLogin={setShowLogin} />
        </div>
      </div>
      <div id="pop-up-sign-up" style={{ display: showRegistro ? 'flex' : 'none' }} onClick={() => setShowRegistro(false)}>
        <div className="modal-content-2" onClick={e => e.stopPropagation()}>
          <Registro setShowRegistro={setShowRegistro} />
        </div>
      </div>
      {showListaCompra && (
        <ListaCompra showListaCompra={showListaCompra} setListaCompra={setListaCompra} />
      )}
      {showDesplegablePerfil && (
        <DesplegablePerfil showDesplegablePerfil={showDesplegablePerfil} setDesplegablePerfil={setDesplegablePerfil} />
      )}

    </>
  );
}

export default Header;