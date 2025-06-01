import React from "react";
import Header from "../header/header";

const TerminosCondiciones = () => {
    return (
        <>
        <Header />
        <div className="terminos-container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "1rem" }}>📄 Términos y Condiciones</h1>

            <p>
                Bienvenido a <strong>Kukit</strong>. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes
                términos y condiciones. Por favor, léelos cuidadosamente antes de continuar utilizando nuestros servicios.
            </p>

            <h2 style={{ marginTop: "2rem" }}>1. Uso del Sitio</h2>
            <p>
                Kukit está destinado exclusivamente a uso personal y educativo. No está permitida la utilización de nuestros
                contenidos con fines comerciales sin autorización previa.
            </p>

            <h2 style={{ marginTop: "2rem" }}>2. Propiedad Intelectual</h2>
            <p>
                Todo el contenido publicado en esta web, incluyendo recetas, imágenes, diseño y código, es propiedad de Kukit o
                de sus colaboradores. Queda prohibida su reproducción sin consentimiento expreso.
            </p>

            <h2 style={{ marginTop: "2rem" }}>3. Cuentas de Usuario</h2>
            <p>
                El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña, así como de todas las
                actividades que ocurran bajo su cuenta. Kukit no se hace responsable del mal uso de las cuentas.
            </p>

            <h2 style={{ marginTop: "2rem" }}>4. Modificaciones del Servicio</h2>
            <p>
                Nos reservamos el derecho a modificar, suspender o interrumpir cualquier parte del servicio sin previo aviso,
                especialmente al tratarse de un proyecto académico.
            </p>

            <h2 style={{ marginTop: "2rem" }}>5. Limitación de Responsabilidad</h2>
            <p>
                Kukit no se hace responsable por errores en las recetas, alergias alimentarias o malentendidos derivados del uso
                de la plataforma. Recomendamos revisar siempre los ingredientes y adaptar las recetas a tus necesidades.
            </p>

            <h2 style={{ marginTop: "2rem" }}>6. Contacto</h2>
            <p>
                Para cualquier duda relacionada con estos términos, puedes escribirnos a <strong>kukit.contacto@gmail.com</strong>.
            </p>

            <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
                Última actualización: Junio de 2025
            </p>
        </div>
        </>
    );
};

export default TerminosCondiciones;
