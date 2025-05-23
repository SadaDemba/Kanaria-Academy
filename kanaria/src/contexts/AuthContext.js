import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

/**
 * Provider du contexte d'authentification qui encapsule la logique d'authentification
 * et la partage avec les composants enfants
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const authService = new AuthService();

    useEffect(() => {
        const loadUser = () => {
            try {
                const user = authService.getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    /**
     * Connexion d'un utilisateur
     * @param {Object} credentials - Les identifiants de l'utilisateur
     * @returns {Promise} Résultat de la connexion
     */
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setCurrentUser(authService.getCurrentUser());
            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Déconnexion d'un utilisateur
     */
    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    /**
     * Vérification si l'utilisateur a un certain rôle
     * @param {string} role - Le rôle à vérifier
     * @returns {boolean} True si l'utilisateur a le rôle
     */
    const hasRole = (role) => {
        return currentUser && currentUser.role === role;
    };

    // Valeur du contexte exposée aux composants
    const value = {
        currentUser,
        loading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!currentUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns {Object} Contexte d'authentification
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used in a AuthProvider");
    }
    return context;
};

export default AuthContext;