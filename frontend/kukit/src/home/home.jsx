// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import logo from '../img/logo_kukit.png';
import hero from '../img/Hero.jpg';
import Login from '../login/login';
import Registro from '../login/registro/registro';
import Footer from '../footer/footer';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.bubbles');
    if (container) {
      for (let i = 0; i < 128; i++) {
        const div = document.createElement('div');
        div.className = 'bubble';
        div.style = `--size:${2 + Math.random() * 4}rem; --distance:${6 + Math.random() * 4}rem; --position:${-5 + Math.random() * 110}%; --time:${2 + Math.random() * 2}s; --delay:${-1 * (2 + Math.random() * 2)}s;`;
        container.appendChild(div);
      }
    }
  }, []);
//Código prueba Manu
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('token'); // O lo que uses para identificar la sesión
  navigate('/home'); // O redirige a '/login' si tienes una ruta específica
};

  return (
    <>
      <header>
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
            <li><Link to="/listaCompra">Lista de la Compra</Link></li>            
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
          <Login setShowLogin={setShowLogin}/>
        </div>
      </div>
      <div id="pop-up-sign-up" style={{ display: showRegistro ? 'flex' : 'none' }} onClick={() => setShowRegistro(false)}>
        <div className="modal-content-2" onClick={e => e.stopPropagation()}>
          <Registro setShowRegistro={setShowRegistro}/>
        </div>
      </div>

        <main>
          <div className="hero">
            <div className="textos-hero">
              <h1>ORGANIZA LO QUE COMES SIN COMERTE LA CABEZA</h1>
              <button className="btn-reservation">DESCUBRE UN NUEVO MUNDO CULINARIO</button>
            </div>
            <div className="fondo">
              <figure>
                <img src={hero} alt="" className="img-hero" />
              </figure>
            </div>
          </div>

          <section>
            <div className="contenendor-home" id="contenedor-recetas">
              <div className="recetas">
                <h2>Recetas</h2>
                <div className="tarjetas-recetas" id="tarjetas-recetas">
                  {/* Aquí se generarán las tarjetas de recetas */}
                </div>
                <button className="recetas">+ Recetas</button>
              </div>
            </div>

            <div className="contenedor-home" id="contenedor-imprescindibles-novedades">
              <h2>Imprescindibles Kukit</h2>
              <h2>Novedades de la semana</h2>
            </div>

            <div className="contenedor-home" id="contenedor-lista-compra">
              <h2>Añade tus recetas y crea tu lista de la compra</h2>
              <div className="contenedor-lista-compra-elementos">
                <div className="contenedor-home-checks"></div>
                <div className="contenedor-lista-compra-texto">
                  <h3>Organiza tu compra de manera rápida y sencilla con solo un clic.</h3>
                  <p>
                    Ahora, con nuestra nueva funcionalidad, podrás buscar fácilmente tus recetas favoritas y añadir
                    los ingredientes directamente a tu lista. Cuando te guste una receta, haz clic en "Añadir a la
                    lista" y los ingredientes necesarios se agregarán a tu lista de la compra.
                    Esto te permitirá ahorrar tiempo en tus compras y asegurarte de tener todo lo necesario para
                    tus platos. ¡Cocinar nunca fue tan fácil!
                  </p>
                </div>
              </div>
            </div>

            <div className="contenedor-home" id="contenedor-filtros-recetas">
              <h2>Filtra, Elige y Cocina tu próxima receta</h2>
              <div className="contenedor-lista-compra-elementos">
                <div className="contenedor-home-checks"></div>
                <div className="contenedor-lista-compra-texto">
                  <h3>Busca por país, ingredientes o necesidades especiales</h3>
                  <p>
                    En Kukit te lo ponemos fácil para encontrar la receta perfecta. Explora platos según su país
                    de origen, filtra por los ingredientes que tienes en casa o elige opciones que se adapten a tus
                    necesidades: sin gluten, veganas, bajas en carbohidratos y mucho más. Así ahorras tiempo y
                    disfrutas justo lo que necesitas, sin complicaciones.
                  </p>
                </div>
              </div>
            </div>

            <div className="contenedor-home" id="contenedor-calendario">
              <h2>Filtra tus recetas y descubre tu próxima receta</h2>
              <div className="contenedor-lista-compra-elementos">
                <div className="contenedor-home-checks"></div>
                <div className="contenedor-lista-compra-texto">
                  <h3>¿Cómo hacerlo?</h3>
                  <p>
                    En Kukit te lo ponemos fácil para encontrar la receta perfecta. Explora platos según su país
                    de origen, filtra por los ingredientes que tienes en casa o elige opciones que se adapten a tus
                    necesidades: sin gluten, veganas, bajas en carbohidratos y mucho más. Así ahorras tiempo y
                    disfrutas justo lo que necesitas, sin complicaciones.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* <footer>
          <div className="main"></div>
          <div className="footer">
            <div className="bubbles"></div>
            <div className="content">
              <div>
                <div>
                  <b>Eldew</b>
                  <a href="#">Secuce</a>
                  <a href="#">Drupand</a>
                  <a href="#">Oceash</a>
                  <a href="#">Ugefe</a>
                  <a href="#">Babed</a>
                </div>
                <div>
                  <b>Spotha</b>
                  <a href="#">Miskasa</a>
                  <a href="#">Agithe</a>
                  <a href="#">Scesha</a>
                  <a href="#">Lulle</a>
                </div>
                <div>
                  <b>Chashakib</b>
                  <a href="#">Chogauw</a>
                  <a href="#">Phachuled</a>
                  <a href="#">Tiebeft</a>
                  <a href="#">Ocid</a>
                  <a href="#">Izom</a>
                  <a href="#">Ort</a>
                </div>
                <div>
                  <b>Athod</b>
                  <a href="#">Pamuz</a>
                  <a href="#">Vapert</a>
                  <a href="#">Neesk</a>
                  <a href="#">Omemanen</a>
                </div>
              </div>
              <div>
                <a
                  className="image"
                  href="https://codepen.io/z-"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundImage: "url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/happy.svg')"
                  }}
                ></a>
                <p>©2019 Not Really</p>
              </div>
            </div>
          </div>

          <svg style={{ position: 'fixed', top: '100vh' }}>
            <defs>
              <filter id="blob">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                  result="blob"
                />
              </filter>
            </defs>
          </svg>
        </footer> */}
        <Footer />
    <footer className="section bg-footer">
      <div className="container-footer">
        <div className="row">
          <div className="col-lg-3">
            <div>
              <h6 className="footer-heading text-uppercase text-white">Visita nuestras secciones</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li><a href="#" className="enlace-footer">Recetas</a></li>
                <li><a href="#" className="enlace-footer">Lista de la compra</a></li>
                <li><a href="#" className="enlace-footer">Plan de alimentación</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3">
            <div>
              <h6 className="footer-heading text-uppercase text-white">Información Corporativa</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li><a href="#" className="enlace-footer">Sobre Kukit</a></li>
                <li><a href="#" className="enlace-footer">Partners o Colaboradores</a></li>
                <li><a href="#" className="enlace-footer">Términos y condiciones</a></li>
                <li><a href="#" className="enlace-footer">Aviso legal</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3">
            <div>
              <h6 className="footer-heading text-uppercase text-white">Empieza con Kukit</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li><a href="#" className="enlace-footer">Iniciar Sesión</a></li>
                <li><a href="#" className="enlace-footer">Crear Cuenta</a></li>
                <li><a href="#" className="enlace-footer">¿Olvidaste tu contraseña?</a></li>
                <li><a href="#" className="enlace-footer">Ver mi perfil</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3">
            <div>
              <h6 className="footer-heading text-uppercase text-white">Contáctanos</h6>
              <p className="contact-info mt-4">Contacta con nosotros si necesitas ayuda</p>
              <p className="contact-info">kukit@kukit.com</p>
              <div className="mt-5">
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <a href="#"><i className="fab facebook footer-social-icon fa-facebook-f"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#"><i className="fab twitter footer-social-icon fa-twitter"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#"><i className="fab google footer-social-icon fa-google"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#"><i className="fab apple footer-social-icon fa-apple"></i></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="footer-alt mb-0 f-14">
          2025 © Ainhoa Blanca, Manuel Gómez, Rubén Peña, Daniel Simón. All Rights Reserved
        </p>
      </div>
    </footer>
      </>
      );
}

      export default Home;
