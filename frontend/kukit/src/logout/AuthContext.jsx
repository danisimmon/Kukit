import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const checkAuthStatus = useCallback(async () => {
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
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
        }
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
