import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

function AuthGuard({ loggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicPaths = [
      '/home',
      '/login',
      '/registro',
      '/login/restablecer-password',
      '/login/restablecer-password/nueva-password',
      '/partners',
      '/sobrekukit',
      '/terminosycondiciones',
    ];

    if (!loggedIn && !publicPaths.includes(location.pathname.toLowerCase())) {
      navigate('/login', { replace: true });
    }
  }, [loggedIn, location.pathname, navigate]);

  // Si estás logueado o en ruta pública, renderiza las rutas hijas
  return <Outlet />;
}

export default AuthGuard;
