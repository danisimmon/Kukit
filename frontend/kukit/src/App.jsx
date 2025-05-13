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
import hero from './img/hero.jpg';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/login/restablecer-password" element={<PasswordReset />} />
        <Route path="/login/restablecer-password/nueva-password" element={<NuevaPassword />} />
        <Route path="/login/registro" element={<Registro />} />
        <Route path="/area-privada/editar-perfil" element={<EditarPerfil />} />
        <Route path="/listaCompra/listaCompra" element={<ListaCompra />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;