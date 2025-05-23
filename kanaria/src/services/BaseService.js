// BaseService.js
import axios from 'axios';
import { ENV } from './config/env';

class BaseService {
    constructor(baseURL = ENV.BASE_API) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.client.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });

        this.client.interceptors.response.use(
            response => response,
            error => {
                // Ne pas rediriger pour les erreurs 401 sur les endpoints d'authentification
                const isAuthEndpoint = error.config.url.includes('/auth/');

                if (error.response && error.response.status === 401 && !isAuthEndpoint) {
                    localStorage.removeItem('token');
                    window.location.href = baseURL + 'admin/auth';
                }
                return Promise.reject(error);
            }
        );
    }

    async get(url, config = {}) {
        try {
            const response = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async post(url, data = {}, config = {}) {
        try {
            const response = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async put(url, data = {}, config = {}) {
        try {
            const response = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async delete(url, config = {}) {
        try {
            const response = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    handleError(error) {
        if (error.response) {
            console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            console.error('Request error:', error.request);
        } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error('Error:', error.message);
        }
    }
}

export default BaseService;