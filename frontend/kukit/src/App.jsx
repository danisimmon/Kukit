// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/login';
import PasswordReset from './login/restablecer-password/password-reset';
import NuevaPassword from './login/restablecer-password/nueva-password';
import Registro from './login/registro/registro';
import EditarPerfil from './area-privada/editar-perfil/editar-perfil';
import ListaCompra from './listaCompra/listaCompra';
import Home from './home/home';
// import Home from './Home';
import './style.css';
//importo las imagenes de la carpeta img
import RecetasGuardadas from './area-privada/recetasguardadas/recetasguardadas.jsx';
import Recetas from './area-privada/recetas';
import VerReceta from './area-privada/verreceta.jsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import PlanificacionSemanal from './planAlimentacion/planAlimentacion.jsx';
import VerRecetaTexto from './area-privada/verRecetaPorTexto.jsx';
import Footer from './footer/footer.jsx';
import { useState } from 'react';
import Partners from './footer/partners.jsx';
import SobreKukit from './footer/sobrekukit.jsx';
import TerminosCondiciones from './footer/terminosycondiciones.jsx';
import { AuthProvider } from './logout/AuthContext.jsx';
// import './bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [showListaCompra, setShowListaCompra] = useState(false);
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/login/restablecer-password" element={<PasswordReset />} />
        <Route path="/login/restablecer-password/nueva-password" element={<NuevaPassword />} />
        <Route path="/recetas" element={<Recetas />} />
        <Route path="/recetas/recetasguardadas" element={<RecetasGuardadas />} />
        <Route path="/area-privada/editar-perfil" element={<EditarPerfil />} />
        <Route path="/planAlimentacion" element={<PlanificacionSemanal />} />
        <Route path="/area-privada/verreceta/:recetaId" element={<VerReceta />} />
        <Route path="/area-privada/verrecetaportexto/:recetaId" element={<VerRecetaTexto />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/sobrekukit" element={<SobreKukit />} />
        <Route path="/terminosycondiciones" element={<TerminosCondiciones />} />
      </Routes>

      {/* <Footer /> */}
      <Footer setShowListaCompra={setShowListaCompra} />
      <ListaCompra showListaCompra={showListaCompra} setListaCompra={setShowListaCompra} />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;