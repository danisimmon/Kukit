// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from 'react';
import hero from '../img/mesa-de-cocina-con-platos-preparados-e-ingredientes.jpg';
import Login from '../login/login'; // Descomentado
import Registro from '../login/registro/registro'; // Descomentado
// import Footer from '../footer/footer';
import ListaCompra from '../listaCompra/listaCompra';
import { Link } from 'react-router-dom';
import imgHome1 from '../img/imgHome1.png';
import imgHome2 from '../img/imgHome2.jpg';
import imgHome3 from '../img/imgHome3.jpg';
import Organiza from '../img/ChatGPT Image 15 may 2025, 18_09_34.png'
import Header from '../header/header';

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);

  const [recetasImprescindibles, setRecetasImprescindibles] = useState([]);
  const [currentIndexImprescindibles, setCurrentIndexImprescindibles] = useState(0);
  const [recetasNovedades, setRecetasNovedades] = useState([]);
  const [currentIndexNovedades, setCurrentIndexNovedades] = useState(0);


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

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const response = await fetch('http://localhost/api/area_privada/recetas/getRecetasHome.php');
        const data = await response.json();

        if (data && Array.isArray(data.recetas)) {
          const todasLasRecetas = data.recetas;

          // Para Imprescindibles Kukit (ordenadas por nombre, las primeras 4)
          const imprescindiblesOrdenadas = [...todasLasRecetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecetasImprescindibles(imprescindiblesOrdenadas.slice(0, 4));

          // Para Novedades de la semana (ordenadas por fecha, las 4 más recientes)
          const novedadesOrdenadas = [...todasLasRecetas].sort((a, b) => {
            const dateA = a.fecha_creacion ? new Date(a.fecha_creacion).getTime() : 0;
            const dateB = b.fecha_creacion ? new Date(b.fecha_creacion).getTime() : 0;
            const validTimeA = isNaN(dateA) ? 0 : dateA;
            const validTimeB = isNaN(dateB) ? 0 : dateB;
            return validTimeB - validTimeA; // Descendente
          });
          setRecetasNovedades(novedadesOrdenadas.slice(0, 4));

        } else {
          console.error('Error cargando recetas: la estructura de datos no es la esperada o no hay recetas.', data);
          setRecetasImprescindibles([]);
          setRecetasNovedades([]);
        }
      } catch (error) {
        console.error('Error cargando recetas:', error);
        setRecetasImprescindibles([]);
        setRecetasNovedades([]);
      }
    };

    fetchRecetas();
  }, []);

  // Manejadores para el carrusel de Imprescindibles
  const handleNextImprescindibles = useCallback(() => {
    const numTotalSlides = recetasImprescindibles.length + 1; // +1 para la tarjeta de login/registro
    setCurrentIndexImprescindibles((prev) => (prev + 1) % numTotalSlides);
  }, [recetasImprescindibles.length]);

  const handlePrevImprescindibles = useCallback(() => {
    const numTotalSlides = recetasImprescindibles.length + 1;
    setCurrentIndexImprescindibles((prev) => (prev - 1 + numTotalSlides) % numTotalSlides);
  }, [recetasImprescindibles.length]);

  const recetaImprescindibleActual = recetasImprescindibles[currentIndexImprescindibles];

  // Manejadores para el carrusel de Novedades
  const handleNextNovedades = useCallback(() => {
    const numTotalSlides = recetasNovedades.length + 1; // +1 para la tarjeta de login/registro
    setCurrentIndexNovedades((prev) => (prev + 1) % numTotalSlides);
  }, [recetasNovedades.length]);

  const handlePrevNovedades = useCallback(() => {
    const numTotalSlides = recetasNovedades.length + 1;
    setCurrentIndexNovedades((prev) => (prev - 1 + numTotalSlides) % numTotalSlides);
  }, [recetasNovedades.length]);

  const recetaNovedadActual = recetasNovedades[currentIndexNovedades];

  // Los useEffect para el carrusel automático han sido eliminados.
  // La navegación manual seguirá funcionando con los botones.

  return (
    <>
      <Header />
      {/* Renderizado condicional de modales de Login y Registro */}
      {showLogin && <Login onClose={() => setShowLogin(false)} setShowRegistro={setShowRegistro} setShowLogin={setShowLogin} />}
      {showRegistro && <Registro onClose={() => setShowRegistro(false)} setShowLogin={setShowLogin} setShowRegistro={setShowRegistro} />}

      <main>
        <div className="hero">
          <div className="textos-hero">
            <h1 className='rojopasion'>ORGANIZA LO QUE COMES SIN COMERTE LA CABEZA</h1>
            <p className="subtitulo-hero">Descubre un nuevo mundo culinario y simplifica tu cocina.</p>
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

          {/* Contenedor para las secciones de Imprescindibles y Novedades */}
          {/* Usamos container-fluid para ancho completo y my-5 para margen vertical. La clase 'row' de Bootstrap permite que los elementos hijos se coloquen en línea. */}
          <div className="container-fluid my-5" id="contenedor-imprescindibles-novedades">
            <div className="row gap-3">

              {/* Sección Imprescindibles Kukit - Ocupa la mitad del ancho en pantallas medianas y superiores */}
              <div className="col-md-6 bg-light ms-auto">
                <div className="seccion-home-recetas text-center mb-4 mb-md-0"> {/* mb-4 para móviles, mb-md-0 para resetear en medianas+ */}
                  <h2>Imprescindibles Kukit</h2>
                  <div className="imprescindibles-kukit-recetas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentIndexImprescindibles < recetasImprescindibles.length && recetaImprescindibleActual ? (
                      <div
                        className="tarjeta-receta"
                        key={recetaImprescindibleActual._id || currentIndexImprescindibles}
                        style={{
                          minHeight: '300px', // Altura mínima consistente para la tarjeta
                          width: '100%',      // Ancho consistente
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <img
                          src={recetaImprescindibleActual.href || '/img/comida_default.jpg'}
                          alt={recetaImprescindibleActual.nombre}
                          onError={(e) => { e.target.onerror = null; e.target.src = "/img/comida_default.jpg"; }}
                          style={{
                            height: '200px',    // Altura fija para la caja de la imagen
                            width: '100%',      // La imagen ocupa todo el ancho de la tarjeta
                            objectFit: 'cover' // La imagen cubre el área, puede recortarse
                          }}
                        />
                        <div style={{ padding: '10px 15px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{recetaImprescindibleActual.nombre}</h3>
                        </div>
                      </div>
                    ) : (
                      // Tarjeta de Login/Registro para Imprescindibles
                      <div className="tarjeta-receta tarjeta-login-extra" key="login-imprescindibles" style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '300px', width: '100%' }}>
                        <h4>¡Únete a Kukit!</h4>
                        <p style={{ fontSize: '0.9rem', margin: '10px 0' }}>Regístrate o inicia sesión para descubrir un mundo de recetas y funcionalidades.</p>
                        <button
                          className="btn btn-primary mt-2 w-75"
                          style={{ backgroundColor: '#C33333', color: '#FFFFFF', borderColor: '#C33333' }}
                          onClick={() => setShowLogin(true)}
                        >
                          Iniciar Sesión
                        </button>
                        <button
                          className="btn btn-outline-primary mt-2 w-75"
                          style={{ backgroundColor: '#FFFFFF', color: '#C33333', borderColor: '#C33333' }}
                          onClick={() => setShowRegistro(true)}
                        >
                          Registrarse
                        </button>                      </div>
                    )}
                    <div className='contenedor-boton'>
                      {/* Los botones se deshabilitan si solo hay un slide (la tarjeta de login/registro cuando no hay recetas) */}
                      <button onClick={handlePrevImprescindibles} disabled={(recetasImprescindibles.length + 1) <= 1}>&lt;</button>
                      <button onClick={handleNextImprescindibles} disabled={(recetasImprescindibles.length + 1) <= 1}>&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto d-flex align-items-center">
                  <div class="vr"></div>
              </div>
              {/* Sección Novedades de la semana - Ocupa la mitad del ancho en pantallas medianas y superiores */}
              <div className="col-md-6 bg-light">
                <div className="seccion-home-recetas text-center">
                  <h2>Novedades de la semana</h2>
                  <div className="imprescindibles-kukit-recetas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentIndexNovedades < recetasNovedades.length && recetaNovedadActual ? (
                      <div
                        className="tarjeta-receta"
                        key={recetaNovedadActual._id || currentIndexNovedades}
                        style={{
                          minHeight: '300px', // Altura mínima consistente para la tarjeta
                          width: '100%',      // Ancho consistente
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <img
                          src={recetaNovedadActual.href || '/img/comida_default.jpg'}
                          alt={recetaNovedadActual.nombre}
                          onError={(e) => { e.target.onerror = null; e.target.src = "/img/comida_default.jpg"; }}
                          style={{
                            height: '200px',    // Altura fija para la caja de la imagen
                            width: '100%',      // La imagen ocupa todo el ancho de la tarjeta
                            objectFit: 'cover' // La imagen cubre el área, puede recortarse
                          }}
                        />
                        <div style={{ padding: '10px 15px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{recetaNovedadActual.nombre}</h3>
                        </div>
                      </div>
                    ) : (
                      // Tarjeta de Login/Registro para Novedades
                      <div className="tarjeta-receta tarjeta-login-extra" key="login-novedades" style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '300px', width: '100%' }}>
                        <h4>¡Explora Más!</h4>
                        <p style={{ fontSize: '0.9rem', margin: '10px 0' }}>Inicia sesión para acceder a todas las funcionalidades y guardar tus recetas favoritas.</p>
                        <button
                          className="btn btn-primary mt-2 w-75"
                          style={{ backgroundColor: '#C33333', color: '#FFFFFF', borderColor: '#C33333' }}
                          onClick={() => setShowLogin(true)}
                        >
                          Iniciar Sesión
                        </button>
                        <button
                          className="btn btn-outline-primary mt-2 w-75"
                          style={{ backgroundColor: '#FFFFFF', color: '#C33333', borderColor: '#C33333' }}
                          onClick={() => setShowRegistro(true)}
                        >
                          Registrarse
                        </button>
                      </div>
                    )}
                    <div className='contenedor-boton'>
                      <button onClick={handlePrevNovedades} disabled={(recetasNovedades.length + 1) <= 1}>&lt;</button>
                      <button onClick={handleNextNovedades} disabled={(recetasNovedades.length + 1) <= 1}>&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="contenedor-home" id="contenedor-lista-compra">
            <h2>Añade tus recetas y crea tu lista de la compra</h2>
            <div className="contenedor-lista-compra-elementos">
              <div className="contenedor-home-checks">
                <img src={imgHome1} alt="imgHome1" className='imgHome1' />
              </div>
              <div className="contenedor-lista-compra-texto">
                <h3>Organiza tu compra de manera rápida y sencilla con solo un clic.</h3>
                <p>
                  Ahora, con nuestra nueva funcionalidad, podrás buscar fácilmente tus recetas favoritas y añadir
                  los ingredientes directamente a tu lista. Cuando te guste una receta, haz clic en "Añadir a la
                  lista" y los ingredientes necesarios se agregarán a tu lista de la compra.
                  Esto te permitirá ahorrar tiempo en tus compras y asegurarte de tener todo lo necesario para
                  tus platos. ¡Cocinar nunca fue tan fácil!
                </p>
                <div class="registro-animado" onClick={() => setShowRegistro(true)}>
                  🚀 ¡Accede a tu espacio de recetas personalizadas! Regístrate gratis.
                </div>
              </div>
            </div>
          </div>

          <div className="contenedor-home" id="contenedor-filtros-recetas">
            <h2>Filtra, Elige y Cocina tu próxima receta</h2>
            <div className="contenedor-lista-compra-elementos">
              <div className="contenedor-home-checks">
                <img src={imgHome2} alt="imgHome2" className='imgHome2' />
              </div>
              <div className="contenedor-lista-compra-texto">
                <h3>Busca por país, ingredientes o necesidades especiales</h3>
                <p>
                  En Kukit te lo ponemos fácil para encontrar la receta perfecta. Explora platos según su país
                  de origen, filtra por los ingredientes que tienes en casa o elige opciones que se adapten a tus
                  necesidades: sin gluten, veganas, bajas en carbohidratos y mucho más. Así ahorras tiempo y
                  disfrutas justo lo que necesitas, sin complicaciones.
                </p>
                <span class="registro-pill" onClick={() => setShowRegistro(true)}>
                  🔐 Solo para usuarios registrados
                </span>
              </div>
            </div>
          </div>

          <div className="contenedor-home" id="contenedor-calendario">
            <h2>Filtra tus recetas y descubre tu próxima receta</h2>
            <div className="contenedor-lista-compra-elementos">
              <div className="contenedor-home-checks">
                <img src={imgHome3} alt="imgHome3" className='imgHome3' />
              </div>
              <div className="contenedor-lista-compra-texto">
                <h3>¿Cómo hacerlo?</h3>
                <p>
                  Organiza tus comidas con facilidad y encuentra inspiración para cada día. Con nuestro calendario semanal, podrás agregar recetas, adaptar tu menú y gestionar tu alimentación de manera práctica. Convierte la planificación en una experiencia sencilla y deliciosa.
                </p>
                <p class="mensaje-subrayado" onClick={() => setShowRegistro(true)}>Crea tu cuenta y descubre todo lo que Kukit tiene preparado para ti.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default Home;
