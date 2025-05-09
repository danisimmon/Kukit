// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login';
// import Home from './Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;