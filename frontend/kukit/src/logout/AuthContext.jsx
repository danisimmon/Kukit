import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // <--- NEW: Add isLoading state

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true); // <--- Set loading to true when starting the check
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
            setIsLoading(false); // <--- Set loading to false when the check is complete (success or error)
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        // After successful login, you might want to re-check status or simply rely on this state update
        // If your PHP script sets a session/cookie, subsequent reloads will pick it up
    };

    const logout = () => {
        // You might want to also call a backend endpoint here to destroy the session/cookie
        // For example: fetch("http://localhost/api/logout.php", { credentials: "include" })
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