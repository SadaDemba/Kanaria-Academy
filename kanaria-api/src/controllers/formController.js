const FormService = require('../services/formServices');

class FormController {
    /**
     * Crée un nouveau formulaire
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    async createForm(req, res) {
        try {
            const formData = req.body;
            const userId = req.user.id;

            const newForm = await FormService.createForm(formData, userId);

            return res.status(201).json({
                success: true,
                message: 'Formulaire créé avec succès',
                data: newForm
            });
        } catch (error) {
            console.error('Erreur lors de la création du formulaire:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la création du formulaire'
            });
        }
    }

    /**
     * Vérifie si un formulaire peut être modifié
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    async canModifyForm(req, res) {
        try {
            const { formId } = req.params;

            const canModify = await FormService.canModifyForm(formId);

            return res.status(200).json({
                success: true,
                data: { canModify }
            });
        } catch (error) {
            console.error('Erreur lors de la vérification de la possibilité de modification:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la vérification'
            });
        }
    }

    /**
     * Remplace tous les champs d'un formulaire
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    async replaceFormFields(req, res) {
        try {
            const { formId } = req.params;
            const { fields } = req.body;

            // Vérifier si le formulaire peut être modifié
            const canModify = await FormService.canModifyForm(formId);
            if (!canModify) {
                return res.status(403).json({
                    success: false,
                    message: 'Ce formulaire ne peut plus être modifié car il a déjà des réponses'
                });
            }

            const updatedFields = await FormService.replaceFormFields(formId, fields);

            return res.status(200).json({
                success: true,
                message: 'Champs du formulaire mis à jour avec succès',
                data: updatedFields
            });
        } catch (error) {
            console.error('Erreur lors du remplacement des champs:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la mise à jour des champs'
            });
        }
    }

    /**
     * Récupère un formulaire avec tous ses champs
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    async getFormWithFields(req, res) {
        try {
            const { formId } = req.params;

            const form = await FormService.getFormWithFields(formId);

            return res.status(200).json({
                success: true,
                data: form
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du formulaire:', error);
            return res.status(404).json({
                success: false,
                message: error.message || 'Formulaire non trouvé'
            });
        }
    }

    /**
     * Récupère tous les formulaires actifs avec leurs champs
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    async getActiveForms(req, res) {
        try {
            const forms = await FormService.getActiveForms();

            return res.status(200).json({
                success: true,
                data: forms
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des formulaires actifs:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la récupération des formulaires'
            });
        }
    }

    /**
     * Récupère tous les formulaires avec leurs champs
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    async getAllForms(req, res) {
        try {
            const forms = await FormService.getAllForms();

            return res.status(200).json({
                success: true,
                data: forms
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des formulaires:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la récupération des formulaires'
            });
        }
    }

    /**
     * Met à jour les informations générales d'un formulaire
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    async updateFormInfo(req, res) {
        try {
            const { formId } = req.params;
            const formData = req.body;

            // Vérifier si le formulaire peut être modifié
            const canModify = await FormService.canModifyForm(formId);
            if (!canModify) {
                return res.status(403).json({
                    success: false,
                    message: 'Ce formulaire ne peut plus être modifié car il a déjà des réponses'
                });
            }

            const updatedForm = await FormService.updateFormInfo(formId, formData);

            return res.status(200).json({
                success: true,
                message: 'Informations du formulaire mises à jour avec succès',
                data: updatedForm
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du formulaire:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la mise à jour du formulaire'
            });
        }
    }

}

module.exports = FormController;