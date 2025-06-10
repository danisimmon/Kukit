import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
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
            console.error("Error checking auth status:", err);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false); 
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
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);