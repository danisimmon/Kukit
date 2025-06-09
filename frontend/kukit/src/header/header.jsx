import React, { useState, useRef, useEffect } from 'react';
import logo from '../img/logo_kukit.png';
import perfilAnimado from '../img/perfil-animado.gif'; // Asumiendo que tu GIF se llama así y está en src/img/
import Login from '../login/login';
import Registro from '../login/registro/registro';
import ListaCompra from '../listaCompra/listaCompra';
import { NavLink } from 'react-router-dom';
import DesplegablePerfil from '../area-privada/desplegable-perfil';
import { useAuth } from '../logout/AuthContext';

function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showListaCompra, setListaCompra] = useState(false);
  const [showDesplegablePerfil, setDesplegablePerfil] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const offcanvasRef = useRef(null);
  const bsOffcanvasRef = useRef(null);

  // Bootstrap Offcanvas init
  useEffect(() => {
    if (!offcanvasRef.current || !window.bootstrap?.Offcanvas) return;
    if (!bsOffcanvasRef.current) {
      bsOffcanvasRef.current = new window.bootstrap.Offcanvas(offcanvasRef.current);
      offcanvasRef.current.addEventListener("hidden.bs.offcanvas", () => {
        setShowOffcanvas(false);
      });
    }
    if (showOffcanvas) {
      bsOffcanvasRef.current.show();
    } else {
      bsOffcanvasRef.current?.hide();
    }
  }, [showOffcanvas]);

  // Cierra el menú hamburguesa al navegar
  const closeOffcanvas = () => {
    setShowOffcanvas(false);
  };

  return (
    <>
      <header>
        <a href="/home" id="logo-header">
          <img src={logo} alt="" id="logo-header" />
        </a>
        <button
          id="hamburger-menu"
          className="d-md-none"
          type="button"
          aria-label="Menú"
          onClick={() => setShowOffcanvas(true)}
        >{/* Icono hamburguesa Bootstrap */}
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z" />
          </svg>
        </button>
        {/* Menú desktop */}
        <nav className="d-none d-md-block">
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
            <li onClick={() => setListaCompra(true)} className="nav-link-li">Lista de la Compra</li>
            <li>
              <NavLink to="/planAlimentacion" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Plan de alimentación
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* Botón perfil solo en desktop */}
        <div className="contenedor-header d-none d-md-flex">
          {!isAuthenticated && (
            <>
              <button className="sign-in" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
              <button className="sign-up" onClick={() => setShowRegistro(true)} id="sign-up">Regístrate</button>
            </>
          )}
          {isAuthenticated && (
            <div
              onClick={() => setDesplegablePerfil(!showDesplegablePerfil)}
              style={{
                width: '45px', // Ligeramente más grande para acomodar el GIF si es necesario
                height: '45px',
                borderRadius: '50%',
                backgroundColor: 'transparent', // Puedes mantener un color de fondo si tu GIF tiene transparencias
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '10px',
                overflow: 'hidden' // Para asegurar que el GIF no se salga del círculo
              }}
              title={user?.nombre || user?.email || 'Perfil'}
            >
              <img 
                src={perfilAnimado} 
                alt="Perfil" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          )}
        </div>
      </header >

      {/* Offcanvas menú hamburguesa */}
      <div
        ref={offcanvasRef}
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar" onClick={closeOffcanvas}></button>
      </div>
      <div className="offcanvas-body">
        <ul style={{ listStyle: 'none', padding: 0 }} className='perfil-opciones'> 
          <li >
            <NavLink to="/recetas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end onClick={closeOffcanvas}>
              Recetas
            </NavLink>
          </li>
          <li>
            <NavLink to="/recetas/recetasguardadas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeOffcanvas}>
              Recetas Guardadas
            </NavLink>
          </li>
          <li onClick={() => { setListaCompra(true); closeOffcanvas(); }} className="nav-link-li">Lista de la Compra</li>
          <li>
            <NavLink to="/planAlimentacion" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeOffcanvas}>
              Plan de alimentación
            </NavLink>
          </li>
          {/* Botón perfil solo en mobile */}
          <li style={{ marginTop: '1em' }} >
            {!isAuthenticated && (
              <>
                <button className="botones-inversos" style={{ width: '100%', marginBottom: '8px' }} onClick={() => { setShowLogin(true); closeOffcanvas(); }}>Iniciar sesión</button>
                <button className="sign-up" style={{ width: '100%' }} onClick={() => { setShowRegistro(true); closeOffcanvas(); }}>Regístrate</button>
              </>
            )}
            {isAuthenticated && (
              <div
              // className='perfil-menu-hamburguesa'
                onClick={() => { setDesplegablePerfil(true); closeOffcanvas(); }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#C33333',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: isFallbackText ? '0.7em' : '1.2em',
                  fontWeight: 'bold',
                  margin: '0 auto',
                  padding: isFallbackText ? '2px' : '0',
                  textAlign: 'center'
                }}
                title={user?.nombre || user?.email || 'Perfil'}
              >
                {/* Perfil */}
                {initialDisplay}
              </div>
            )}
          </li>
        </ul>
      </div>
    </div >

      {/* Popups y componentes */ }
      <div id = "pop-up-sign-in" style = {{ display: showLogin ? 'flex' : 'none' }
} onClick = {() => setShowLogin(false)}>
  <div className="modal-content" onClick={e => e.stopPropagation()}>
    <Login setShowLogin={setShowLogin} setShowRegistro={setShowRegistro} />
  </div>
      </div >
  <div id="pop-up-sign-up" style={{ display: showRegistro ? 'flex' : 'none' }} onClick={() => setShowRegistro(false)}>
    <div className="modal-content-2" onClick={e => e.stopPropagation()}>
      <Registro setShowRegistro={setShowRegistro} setShowLogin={setShowLogin} />
    </div>
  </div>
{
  showListaCompra && (
    <ListaCompra showListaCompra={showListaCompra} setListaCompra={setListaCompra} />
  )
}
{
  showDesplegablePerfil && (
    <DesplegablePerfil showDesplegablePerfil={showDesplegablePerfil} setDesplegablePerfil={setDesplegablePerfil} />
  )
}
    </>
  );
}

export default Header;