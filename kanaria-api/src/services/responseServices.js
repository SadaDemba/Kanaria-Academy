const prisma = require("../config/prisma");

/**
 * Service pour la gestion des réponses aux formulaires
 */
class FormResponseService {
    /**
     * Soumet une réponse complète à un formulaire
     * @param {string} formId - L'ID du formulaire
     * @param {string} email - L'email de la personne qui répond
     * @param {Array} fieldResponses - Les réponses aux différents champs
     * @returns {Promise<Object>} La réponse créée
     */
    async submitFormResponse(formId, email, fieldResponses) {
        try {
            // Vérifier que le formulaire existe et est actif
            const form = await prisma.form.findUnique({
                where: { id: formId },
                include: { fields: true }
            });

            if (!form) {
                throw new Error('Formulaire non trouvé');
            }

            if (!form.isActive) {
                throw new Error('Ce formulaire n\'est pas actif');
            }

            // Vérifier les dates de début et de fin si elles sont définies
            const now = new Date();
            if (form.beginDate && form.beginDate > now) {
                throw new Error('Ce formulaire n\'est pas encore disponible');
            }
            if (form.endDate && form.endDate < now) {
                throw new Error('Ce formulaire n\'est plus disponible');
            }

            // Vérifier que tous les champs requis ont une réponse
            const requiredFieldIds = form.fields
                .filter(field => field.isRequired)
                .map(field => field.id);

            const providedFieldIds = fieldResponses.map(resp => resp.fieldId);

            const missingRequiredFields = requiredFieldIds.filter(
                id => !providedFieldIds.includes(id)
            );

            if (missingRequiredFields.length > 0) {
                throw new Error('Des champs obligatoires n\'ont pas été remplis');
            }

            const formResponse = await prisma.$transaction(async (tx) => {
                const response = await tx.formResponse.create({
                    data: {
                        formId,
                        email,
                        status: "UNREAD"
                    }
                });

                for (const fieldResponse of fieldResponses) {
                    // Vérifier que le champ appartient bien à ce formulaire
                    const field = form.fields.find(f => f.id === fieldResponse.fieldId);
                    if (!field) {
                        throw new Error(`Le champ ${fieldResponse.fieldId} n'appartient pas à ce formulaire`);
                    }

                    this.validateFieldResponse(field, fieldResponse.value);

                    await tx.fieldResponse.create({
                        data: {
                            formResponseId: response.id,
                            fieldId: fieldResponse.fieldId,
                            value: fieldResponse.value
                        }
                    });
                }

                return response;
            });

            return formResponse;
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
            throw error;
        }
    }

    /**
     * Valide une réponse en fonction du type de champ
     * @param {Object} field - Le champ à valider
     * @param {string} value - La valeur à valider
     * @throws {Error} Si la validation échoue
     */
    validateFieldResponse(field, value) {
        // Si le champ est obligatoire, vérifier que la valeur n'est pas vide
        if (field.isRequired && (!value || value.trim() === '')) {
            throw new Error(`Le champ "${field.title}" est obligatoire`);
        }

        // Validation selon le type
        switch (field.type) {
            case 'EMAIL':
                if (value && !this.isValidEmail(value)) {
                    throw new Error(`Le format de l'email pour "${field.title}" est invalide`);
                }
                break;
            case 'PHONE':
                if (value && !this.isValidPhone(value)) {
                    throw new Error(`Le format du téléphone pour "${field.title}" est invalide`);
                }
                break;
            case 'NUMBER':
                if (value && isNaN(Number(value))) {
                    throw new Error(`La valeur pour "${field.title}" doit être un nombre`);
                }
                break;
            case 'DATE':
                if (value && isNaN(Date.parse(value))) {
                    throw new Error(`Le format de date pour "${field.title}" est invalide`);
                }
                break;
            case 'TEXT':
            case 'TEXTAREA':
                if (field.maxLength && value && value.length > field.maxLength) {
                    throw new Error(`La réponse pour "${field.title}" dépasse la longueur maximale de ${field.maxLength} caractères`);
                }
                if (field.minLength && value && value.length < field.minLength) {
                    throw new Error(`La réponse pour "${field.title}" est inférieure à la longueur minimale de ${field.minLength} caractères`);
                }
                break;
            case 'CHECKBOX':
            case 'RADIO':
                // Vérifier que la valeur est parmi les options disponibles
                if (value && field.options && !this.isValueInOptions(value, field.options)) {
                    throw new Error(`La valeur sélectionnée pour "${field.title}" n'est pas une option valide`);
                }
                break;
        }
    }

    /**
     * Vérifie si un email est valide
     * @param {string} email - L'email à vérifier
     * @returns {boolean} True si l'email est valide
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Vérifie si un numéro de téléphone est valide
     * @param {string} phone - Le numéro à vérifier
     * @returns {boolean} True si le numéro est valide
     */
    isValidPhone(phone) {
        // Format international simplifié
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Vérifie si une valeur est dans les options disponibles
     * @param {string} value - La valeur à vérifier
     * @param {string|Array} options - Les options disponibles (peut être une chaîne JSON)
     * @returns {boolean} True si la valeur est dans les options
     */
    isValueInOptions(value, options) {
        try {
            // Convertir options en tableau si c'est une chaîne JSON
            const optionsArray = typeof options === 'string' 
                ? JSON.parse(options) 
                : (Array.isArray(options) ? options : []);
                
            return optionsArray.some(option => 
                option === value || 
                (option && option.value && option.value === value)
            );
        } catch (error) {
            console.error('Erreur lors de la vérification des options:', error);
            return false;
        }
    }

    /**
     * Récupère les réponses d'un formulaire spécifique
     * @param {string} formId - L'ID du formulaire
     * @returns {Promise<Array>} Les réponses au formulaire
     */
    async getFormResponses(formId) {
        try {
            const responses = await prisma.formResponse.findMany({
                where: { formId },
                include: {
                    responses: {
                        include: {
                            field: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Parser les options JSON pour chaque champ
            return responses.map(response => ({
                ...response,
                responses: response.responses.map(fieldResponse => ({
                    ...fieldResponse,
                    field: {
                        ...fieldResponse.field,
                        options: JSON.parse(fieldResponse.field.options)
                    }
                }))
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des réponses:', error);
            throw error;
        }
    }

    /**
     * Met à jour le statut de lecture d'une réponse
     * @param {string} responseId - L'ID de la réponse
     * @param {boolean} isRead - True pour marquer comme lue, False pour marquer comme non lue
     * @returns {Promise<Object>} La réponse mise à jour
     */
    async toggleResponseReadStatus(responseId, isRead) {
        try {
            const updatedResponse = await prisma.formResponse.update({
                where: { id: responseId },
                data: { status: isRead ? 'READ' : 'UNREAD' }
            });

            return updatedResponse;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de lecture:', error);
            throw error;
        }
    }

    /**
     * Récupère les statistiques des réponses pour un formulaire spécifique
     * @param {string} formId - L'ID du formulaire
     * @returns {Promise<Object>} Statistiques des réponses (total, lues, non lues)
     */
    async getFormResponsesStats(formId) {
        try {
            // Compter toutes les réponses
            const totalCount = await prisma.formResponse.count({
                where: { formId }
            });

            // Compter les réponses lues
            const readCount = await prisma.formResponse.count({
                where: {
                    formId,
                    status: 'READ'
                }
            });

            // Calculer les réponses non lues
            const unreadCount = totalCount - readCount;

            return {
                total: totalCount,
                read: readCount,
                unread: unreadCount
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques de réponses:', error);
            throw error;
        }
    }
}

module.exports = new FormResponseService();