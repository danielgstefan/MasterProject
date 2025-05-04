import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check if user is authenticated on mount
        const initAuth = () => {
            try {
                if (AuthService.isAuthenticated()) {
                    const userData = AuthService.getCurrentUser();
                    if (userData) {
                        setUser(userData);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsInitialized(true);
            }
        };
        
        initAuth();
    }, []);

    const login = (userData) => {
        if (!userData) return;
        try {
            setUser(userData);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = () => {
        try {
            AuthService.logout();
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (!isInitialized) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 