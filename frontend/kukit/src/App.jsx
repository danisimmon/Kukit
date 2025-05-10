// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login';
import PasswordReset from './login/restablecer-password/password-reset';
import Registro from './login/registro/registro';
// import Home from './Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/restablecimiento-password" element={<PasswordReset />} />
        <Route path="/login/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;