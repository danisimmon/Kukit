import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const checkAuthStatus = useCallback(async () => {
        // Envolver en una promesa para asegurar que se pueda esperar su finalización completa,
        // incluyendo las actualizaciones de estado.
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch("http://localhost/api/login/gestion-autenticacion/gestion-autenticacion.php", {
                    credentials: "include"
                });
                const data = await response.json();

                setIsAuthenticated(data.loggedIn);
                if (data.loggedIn && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
                resolve(data.loggedIn); // Resuelve con el estado de autenticación
            } catch (err) {
                setUser(null);
                setIsAuthenticated(false);
                reject(err); // Rechaza en caso de error
            }
        });
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
