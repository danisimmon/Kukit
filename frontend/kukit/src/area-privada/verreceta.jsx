import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../img/logo_kukit.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CorazonRelleno from '../img/corazonRelleno.png'
import CorazonSinRelleno from '../img/corazonSinRelleno.png'
import NoFavorito from '../img/bookmark.png'
import Favorito from '../img/bookmark-relleno.png'
import Login from '../login/login';
import Registro from '../login/registro/registro';
import Footer from '../footer/footer';
import ListaCompra from '../listaCompra/listaCompra';
import Header from '../header/header';
// import ImagenReceta from 'http://localhost/api/img/recetas/pasta-al-pesto.jpg';

const VerReceta = ({ receta, onFavoritoToggle, isFavorito }) => {



    return (
        <>
            <Header />
            <h1>Recetas guardadas <span>|</span> Pasta al pesto</h1>
            <div class="inforeceta">
                <div class="inforecetaimg">
                    {/* <img src={ImagenReceta} alt="" /> */}
                </div>
                <div class="inforecetadescripcion">
                    <h3>Pasta al pesto</h3>
                </div>
            </div>
            <div className="crear-receta">
                <div className="crear-receta-info">
                    {/* Aquí se obtiene el nombre de la receta */}
                    <h3>Pasta al pesto</h3>
                    
                    <div className="info-basica-receta">
                        <div className="apartado-dificultad">
                            <h5>Dificultad</h5>
                            {/* Está sería la imagen que representa la dificultad */}
                            {/* <img src="" alt="" /> */}
                            {/* Aquí se muestra la dificultad */}
                            <h5>Baja</h5>
                        </div>
                        <div className="apartado-tiempo">
                            <h5>Tiempo</h5>
                            {/* Está sería la imagen que representa el tiempo */}
                            {/* <img src="" alt="" /> */}
                            {/* Aquí se muestra la dificultad */}
                            <h5>Baja</h5>
                        </div>
                    </div>
                </div>

                <div className="racion-ingredientes">
                    <h5>Ración</h5>
                    <h2>1</h2>
                </div>

                <div className="ingredientes-pasos">
                    <div className="ingredientes-crear-receta">
                        <div className="contenedor-ingredientes">
                            <h5>INGREDIENTES</h5>

                            {/* Aquí se crean los elementos de cada ingrediente, el código que hay es de como son los contenedores dinámicos de crear receta por si se quieren usar */}

                            {/* {ingredientes.map((ing, index) => (
                                <div key={index} className="rellenar-ingrediente">
                                    Nombre Ingrediente:
                                    <input
                                        type="text"
                                        value={ing.nombre}
                                        onChange={(e) => handleIngredienteChange(index, 'nombre', e.target.value)}
                                    />
                                    <span>Cantidad</span>
                                    <input
                                        type="number"
                                        value={ing.cantidad}
                                        onChange={(e) => handleIngredienteChange(index, 'cantidad', e.target.value)}
                                    />
                                    <span>Unidad</span>
                                    <input
                                        type="text"
                                        value={ing.unidad}
                                        onChange={(e) => handleIngredienteChange(index, 'unidad', e.target.value)}
                                    />
                                    <button type="button" onClick={() => handleRemoveIngrediente(index)}>
                                        Eliminar
                                    </button>
                                </div>
                            ))} */}
                            {/* <div className="anadir-ingrediente" onClick={handleAddIngrediente}>
                                Añadir Ingrediente
                            </div> */}
                        </div>
                    </div>
                    <div className="pasos-crear-receta">
                        <h5>PASOS</h5>
                        {/* {pasos.map((paso, index) => (
                            <div key={index} className="rellenar-pasos">
                                Paso {index + 1}
                                <input
                                    type="text"
                                    value={paso}
                                    onChange={(e) => handlePasoChange(index, e.target.value)}
                                />
                                <button type="button" onClick={() => handleRemovePaso(index)}>
                                    Eliminar
                                </button>
                            </div>
                        ))} */}
                        {/* <div className="anadir-pasos" onClick={handleAddPaso}>
                            Añadir Paso
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default VerReceta;