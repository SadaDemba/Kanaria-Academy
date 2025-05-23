import BaseService from './BaseService';

class FormResponsesService extends BaseService {
    constructor() {
        super();
        this.basePath = '/responseForm';
    }

    /**
     * Récupère les réponses d'un formulaire spécifique
     * @param {string} formId - ID du formulaire
     * @returns {Promise<Array>} - Promesse contenant les réponses
     */
    async getFormResponses(formId) {
        return this.get(`${this.basePath}/${formId}/responses`);
    }

    async getFormResponsesStats(formId) {
        return this.get(`${this.basePath}/${formId}/stats`);
    }

    /**
     * Marque une réponse comme lue ou non lue
     * @param {string} responseId - ID de la réponse à marquer comme lue
     * @param {boolean} isRead - Etat dans lequel on veut mettre la réponse
     * @returns {Promise<Object>} - Promesse contenant la réponse mise à jour
     */
    async toggleResponseReadStatus(responseId, isRead) {
        return this.put(`${this.basePath}/toggle-read-status/${responseId}`, { 'isRead': isRead });
    }

    /**
     * Soumet une nouvelle réponse à un formulaire
     * @param {Object} data - Données de la réponse
     * @param {string} data.formId - ID du formulaire
     * @param {string} data.email - Email de la personne qui répond
     * @param {Array} data.fieldResponses - Tableau des réponses aux champs
     * @returns {Promise<Object>} - Promesse contenant la réponse créée
     */
    async submitFormResponse(data) {
        return this.post(`${this.basePath}/submit`, data);
    }
}

export default FormResponsesService;