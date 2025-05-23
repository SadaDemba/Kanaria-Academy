const prisma = require("../config/prisma");

class FormService {
    /**
   * Crée un nouveau formulaire sans champs
   * @param {Object} formData - Les metadata du formulaire
   * @param {string} userId - L'ID de l'utilisateur créant le formulaire
   * @returns {Promise<Object>} Le formulaire créé
   */
    async createForm(formData, userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            const form = await prisma.form.create({
                data: {
                    title: formData.title,
                    description: formData.description,
                    isActive: formData.isActive !== undefined ? formData.isActive : true,
                    beginDate: formData.beginDate ? new Date(formData.beginDate) : null,
                    endDate: formData.endDate ? new Date(formData.endDate) : null,
                    createdBy: userId
                }
            });

            return form;
        } catch (error) {
            console.error('Erreur lors de la création du formulaire:', error);
            throw error;
        }
    }

    /**
   * Vérifie si un formulaire peut être modifié (aucune réponse)
   * @param {string} formId - L'ID du formulaire à vérifier
   * @returns {Promise<boolean>} True si le formulaire peut être modifié
   */
    async canModifyForm(formId) {
        try {
            const responseCount = await prisma.formResponse.count({
                where: { formId }
            });

            return responseCount === 0;
        } catch (error) {
            console.error('Erreur lors de la vérification du formulaire:', error);
            throw error;
        }
    }

    /**
 * Remplace tous les champs d'un formulaire
 * @param {string} formId - L'ID du formulaire
 * @param {Array} newFields - Les nouveaux champs à ajouter
 * @returns {Promise<Array>} Les champs créés
 */
    async replaceFormFields(formId, newFields) {
        try {
            // Vérifier si le formulaire existe
            const form = await prisma.form.findUnique({
                where: { id: formId }
            });

            if (!form) {
                throw new Error('Formulaire non trouvé');
            }

            const result = await prisma.$transaction(async (tx) => {
                await tx.field.deleteMany({
                    where: { formId }
                });

                const createdFields = [];
                for (let i = 0; i < newFields.length; i++) {
                    const field = newFields[i];

                    // Convertir les options en chaîne JSON pour SQL Server
                    const optionsString = field.options
                        ? JSON.stringify(field.options)
                        : JSON.stringify([]);

                    const createdField = await tx.field.create({
                        data: {
                            formId,
                            title: field.title,
                            description: field.description,
                            type: field.type,
                            maxLength: field.maxLength,
                            minLength: field.minLength,
                            options: optionsString,
                            isRequired: field.isRequired !== undefined ? field.isRequired : false,
                            order: field.order,
                            errorMessage: field.errorMessage || null
                        }
                    });

                    // Reconvertir les options en objet pour la réponse
                    createdFields.push({
                        ...createdField,
                        options: JSON.parse(createdField.options)
                    });
                }

                return createdFields;
            });

            return result;
        } catch (error) {
            console.error('Erreur lors du remplacement des champs:', error);
            throw error;
        }
    }

    /**
   * Récupère un formulaire avec tous ses champs
   * @param {string} formId - L'ID du formulaire à récupérer
   * @returns {Promise<Object>} Le formulaire avec ses champs
   */
    async getFormWithFields(formId) {
        try {
            const form = await prisma.form.findUnique({
                where: { id: formId },
                include: {
                    fields: {
                        orderBy: { order: 'asc' }
                    }
                }
            });

            if (!form) {
                throw new Error('Formulaire non trouvé');
            }

            // Parser les options JSON pour chaque champ
            const fieldsWithParsedOptions = form.fields.map(field => ({
                ...field,
                options: JSON.parse(field.options)
            }));

            // Ajouter l'information si le formulaire peut être modifié
            const canModify = await this.canModifyForm(formId);
            return {
                ...form,
                fields: fieldsWithParsedOptions,
                canModify
            };
        } catch (error) {
            console.error('Erreur lors de la récupération du formulaire:', error);
            throw error;
        }
    }

    async getActiveForms() {
        try {
            const forms = await prisma.form.findMany({
                where: { isActive: true },
                include: {
                    fields: {
                        orderBy: { order: 'asc' }
                    }
                }
            });

            // Parser les options JSON pour chaque champ de chaque formulaire
            return forms.map(form => ({
                ...form,
                fields: form.fields.map(field => ({
                    ...field,
                    options: JSON.parse(field.options)
                }))
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération du formulaire:', error);
            throw error;
        }
    }

    async getAllForms() {
        try {
            const forms = await prisma.form.findMany({
                include: {
                    fields: {
                        orderBy: { order: 'asc' }
                    }
                }
            });

            // Parser les options JSON pour chaque champ de chaque formulaire
            return forms.map(form => ({
                ...form,
                fields: form.fields.map(field => ({
                    ...field,
                    options: JSON.parse(field.options)
                }))
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération du formulaire:', error);
            throw error;
        }
    }

    /**
     * Met à jour les informations générales d'un formulaire
     * @param {string} formId - L'ID du formulaire à mettre à jour
     * @param {Object} formData - Les nouvelles données du formulaire
     * @returns {Promise<Object>} Le formulaire mis à jour
     */
    async updateFormInfo(formId, formData) {
        try {
            // Vérifier si le formulaire existe
            const form = await prisma.form.findUnique({
                where: { id: formId }
            });

            if (!form) {
                throw new Error('Formulaire non trouvé');
            }

            // Vérifier si le formulaire peut être modifié
            const canModify = await this.canModifyForm(formId);
            if (!canModify) {
                throw new Error('Ce formulaire ne peut pas être modifié car il contient déjà des réponses');
            }

            // Mettre à jour les informations du formulaire
            const updatedForm = await prisma.form.update({
                where: { id: formId },
                data: {
                    title: formData.title,
                    description: formData.description,
                    isActive: formData.isActive !== undefined ? formData.isActive : form.isActive,
                    beginDate: formData.beginDate ? new Date(formData.beginDate) : form.beginDate,
                    endDate: formData.endDate ? new Date(formData.endDate) : form.endDate,
                    updatedAt: new Date()
                }
            });

            return updatedForm;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du formulaire:', error);
            throw error;
        }
    }
}

module.exports = new FormService();