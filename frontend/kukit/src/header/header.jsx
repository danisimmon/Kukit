import React, { useState, useEffect } from 'react';
import logo from '../img/logo_kukit.png';
import Login from '../login/login';
import Registro from '../login/registro/registro';
import ListaCompra from '../listaCompra/listaCompra';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Recetas from '../area-privada/recetas';


function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegistro, setShowRegistro] = useState(false);
    const [showListaCompra, setListaCompra] = useState(false);
    const [recetas, setRecetas] = useState([]);
    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const response = await fetch('http://localhost/api/area_privada/recetas/getRecetas.php');
                const data = await response.json();
                // Ordena las recetas por algún criterio fijo si necesitas que siempre sean las mismas
                // Ejemplo: por nombre (alfabéticamente), por id, o similar.
                const recetasOrdenadas = [...data.recetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
                setRecetas(recetasOrdenadas.slice(0, 4));
            } catch (error) {
                console.error('Error cargando recetas:', error);
            }
        };

        fetchRecetas();
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
                        <li><Link to="/recetas">Recetas</Link></li>
                        <li><Link to="/recetas/recetasguardadas">Recetas Guardadas</Link></li>
                        <li onClick={() => setListaCompra(true)}>Lista de la Compra</li>
                        <li><a href="/plan-alimentacion">Plan de alimentación</a></li>
                    </ul>
                </nav>
                <div className="contenedor-header">
                    <button className="sign-in" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
                    <button className="sign-up" onClick={() => setShowRegistro(true)} id="sign-up">Regístrate</button>
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
            {/*  <header>
        <a href="/" id="logo-header">
          <img src={logo} alt="" id="logo-header" />
        </a>
        <button id="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav>
          <ul>
            <li><Link to="/recetas">Recetas</Link></li>
            <li><Link to="/recetas/recetasguardadas">Recetas Guardadas</Link></li>
            <li onClick={() => setListaCompra(true)}>Lista de la Compra</li>
            <li><a href="/plan-alimentacion">Plan de alimentación</a></li>
          </ul>
        </nav>
        <div className="contenedor-header">
          <button className="sign-in" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
          <button className="sign-up" onClick={() => setShowRegistro(true)} id="sign-up">Regístrate</button>
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
      )} */}
        </>
    );
}

export default Header;