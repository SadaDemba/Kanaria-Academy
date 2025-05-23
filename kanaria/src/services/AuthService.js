import BaseService from './BaseService';

class AuthService extends BaseService {
    constructor() {
        super();
        this.baseEndpoint = '/auth';
    }

    /**
     * Inscrit un nouvel utilisateur
     * @param {Object} userData - Les données de l'utilisateur
     * @param {string} userData.email - L'email de l'utilisateur
     * @param {string} userData.password - Le mot de passe de l'utilisateur
     * @returns {Promise<Object>} Les données de l'utilisateur créé
     */
    async signUp(userData) {
        try {
            const response = await this.post(`${this.baseEndpoint}/signup`, userData);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 409) {
                throw new Error('Cet email est déjà utilisé');
            }
            throw error;
        }
    }

    /**
     * Connecte un utilisateur
     * @param {Object} credentials - Les identifiants de l'utilisateur
     * @param {string} credentials.email - L'email de l'utilisateur
     * @param {string} credentials.password - Le mot de passe de l'utilisateur
     * @returns {Promise<Object>} Les données de l'utilisateur connecté et son token
     */
    /**
     * Connecte un utilisateur
     * @param {Object} credentials - Les identifiants de l'utilisateur
     * @param {string} credentials.email - L'email de l'utilisateur
     * @param {string} credentials.password - Le mot de passe de l'utilisateur
     * @returns {Promise<Object>} Les données de l'utilisateur connecté et son token
     * @throws {Error} - Erreur avec un message spécifique selon le cas
     */
    async login(credentials) {
        try {
            const response = await this.post(`${this.baseEndpoint}/login`, credentials);

            // Stocker le token dans le localStorage
            if (response && response.token) {
                localStorage.setItem('token', response.token);

                // Stocker les infos utilisateur
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                return response;
            } else {
                throw new Error('Réponse du serveur incomplète');
            }
        } catch (error) {
            // Erreurs spécifiques à l'authentification
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        throw new Error('Mot de passe non conforme. Il faut 8 caractères avec au moins une majuscule et un chiffre.');
                    case 401:
                        throw new Error('Email ou mot de passe incorrect');
                    case 404:
                        throw new Error('Compte non trouvé. Vérifiez votre email.');
                    case 403:
                        throw new Error('Votre compte est désactivé ou n\'a pas les permissions nécessaires.');
                    case 429:
                        throw new Error('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
                    case 500:
                        throw new Error('Erreur serveur. Veuillez réessayer ultérieurement.');
                    default:
                        throw new Error(`Erreur lors de la connexion: ${error.response.data?.message || 'Erreur inattendue'}`);
                }
            }

            if (error.message === 'Network Error') {
                throw new Error('Problème de connexion au serveur. Vérifiez votre connexion internet.');
            }

            throw error;
        }
    }
    /**
     * Déconnecte l'utilisateur
     */
    logout() {
        // Supprimer les données d'authentification du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Optionnellement, vous pouvez appeler une API de déconnexion côté serveur
        // si votre backend gère les sessions ou l'invalidation de tokens
        // return this.post(`${this.baseEndpoint}/logout`);
    }

    /**
     * Vérifie si l'utilisateur est connecté
     * @returns {boolean} True si l'utilisateur est connecté, false sinon
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    /**
     * Récupère les informations de l'utilisateur connecté
     * @returns {Object|null} Les informations de l'utilisateur ou null s'il n'est pas connecté
     */
    getCurrentUser() {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }

    /**
     * Récupère le token d'authentification
     * @returns {string|null} Le token ou null s'il n'existe pas
     */
    getToken() {
        return localStorage.getItem('token');
    }
}

export default AuthService;