// FormsService.js
import BaseService from './BaseService';

class FormsService extends BaseService {
    constructor() {
        super();
        this.basePath = '/forms';
    }

    /**
     * Crée un nouveau formulaire
     * @param {Object} formData - Données du formulaire (title, description)
     * @returns {Promise} - Promesse contenant la réponse
     */
    async createForm(formData) {
        return this.post(`${this.basePath}/add`, formData);
    }

    /**
     * Vérifie si un formulaire peut être modifié
     * @param {string} formId - ID du formulaire
     * @returns {Promise<boolean>} - Promesse contenant le résultat
     */
    async canModifyForm(formId) {
        return this.get(`${this.basePath}/check/${formId}/can-modify`);
    }

    /**
     * Remplace les champs d'un formulaire
     * @param {string} formId - ID du formulaire
     * @param {Array} fields - Tableau des champs
     * @returns {Promise} - Promesse contenant la réponse
     */
    async replaceFormFields(formId, fields) {
        return this.put(`${this.basePath}/edit/${formId}/fields`, { fields });
    }

    /**
     * Récupère un formulaire avec ses champs
     * @param {string} formId - ID du formulaire
     * @returns {Promise<Object>} - Promesse contenant le formulaire
     */
    async getFormWithFields(formId) {
        return this.get(`${this.basePath}/get-by-id/${formId}`);
    }

    /**
     * Récupère tous les formulaires actifs
     * @returns {Promise<Array>} - Promesse contenant la liste des formulaires actifs
     */
    async getActiveForms() {
        return this.get(`${this.basePath}/get-actives`);
    }

    /**
     * Récupère tous les formulaires
     * @returns {Promise<Array>} - Promesse contenant la liste des formulaires
     */
    async getAllForms() {
        return this.get(`${this.basePath}/get-all`);
    }

    /**
     * Met à jour les informations générales d'un formulaire
     * @param {string} formId - ID du formulaire
     * @param {Object} formData - Données du formulaire à mettre à jour
     * @returns {Promise<Object>} - Promesse contenant le formulaire mis à jour
     */
    async updateFormInfo(formId, formData) {
        return this.put(`${this.basePath}/edit/${formId}/info`, formData);
    }
}

export default FormsService;