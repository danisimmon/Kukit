import React from "react";
import danonelogo from "../img/Danone.png";
import bimbologo from "../img/bimbo.png";
import asturianalogo from "../img/asturiana.png";
import nesquiklogo from "../img/nesquicklogo.png";
import Header from "../header/header.jsx";

function Partners() {
    return (
        <>
            <Header />
        
        <div className="container py-5">
            <h1 className="mb-4 text-center">Partners y Colaboradores</h1>
            <p className="text-center mb-5">
                En Kukit creemos en la colaboración con marcas que comparten nuestra visión:
                facilitar una alimentación equilibrada, accesible y divertida para todos.
                Gracias a nuestros colaboradores podemos llegar más lejos y ofrecer un mejor servicio.
            </p>

            <div className="row text-center">
                {/* DANONE */}
                <div className="col-md-3 mb-4">
                    <img src={danonelogo} alt="Danone" className="img-fluid partner-logo" />
                    <h5 className="mt-3">Danone</h5>
                    <p className="small">
                        Kukit colabora con Danone porque compartimos una visión común: promover una alimentación equilibrada, saludable y accesible para todas las familias. Danone, con su compromiso por la salud a través de la alimentación y su apuesta por la sostenibilidad, encaja perfectamente con los valores de Kukit. Juntos, trabajamos para inspirar hábitos saludables desde casa.
                    </p>
                </div>

                {/* BIMBO */}
                <div className="col-md-3 mb-4">
                    <img src={bimbologo} alt="Bimbo" className="img-fluid partner-logo" />
                    <h5 className="mt-3">Bimbo</h5>
                    <p className="small">
                        En Kukit, confiamos en marcas que comparten nuestra pasión por la alimentación saludable y accesible. Bimbo nos acompaña como uno de nuestros colaboradores clave, aportando su amplia gama de panes integrales y productos horneados que forman parte de muchos de nuestros planes de alimentación. Gracias a Bimbo, nuestras recetas ganan en sabor, textura y equilibrio nutricional.
                    </p>
                </div>

                {/* LECHE ASTURIANA */}
                <div className="col-md-3 mb-4">
                    <img src={asturianalogo} alt="Leche Asturiana" className="img-fluid partner-logo" />
                    <h5 className="mt-3">Leche Asturiana</h5>
                    <p className="small">
                        La calidad y el compromiso con la sostenibilidad de Leche Asturiana nos convierten en aliados naturales. Esta emblemática marca española aporta valor a nuestras propuestas gracias a sus productos lácteos de origen 100% natural, ideales para desayunos, meriendas o recetas saludables. Su compromiso con el entorno rural conecta con los valores de Kukit: cercanía, salud y autenticidad.
                    </p>
                </div>

                {/* NESQUIK */}
                <div className="col-md-3 mb-4">
                    <img src={nesquiklogo} alt="Nesquik" className="img-fluid partner-logo" />
                    <h5 className="mt-3">Nesquik</h5>
                    <p className="small">
                        Nesquik es sinónimo de sabor, energía y alegría para los más pequeños. Como parte de nuestra colaboración, algunos de nuestros desayunos para niños incluyen esta marca tan reconocida, siempre dentro de un contexto equilibrado y guiado por profesionales de la nutrición. Porque creemos que una alimentación saludable también puede ser divertida y deliciosa.
                    </p>
                </div>
            </div>
        </div>
      
    </>
  );
}

export default Partners;
