// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login';
import PasswordReset from './login/restablecer-password/password-reset';
import Registro from './login/registro/registro';
import EditarPerfil from './area-privada/editar-perfil/editar-perfil';
import ListaCompra from './listaCompra/listaCompra';
import Home from './home/home';
// import Home from './Home';
import './style.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/restablecimiento-password" element={<PasswordReset />} />
        <Route path="/login/registro" element={<Registro />} />
        <Route path="/area-privada/editar-perfil" element={<EditarPerfil />} />
        <Route path="/listaCompra/listaCompra" element={<ListaCompra />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;