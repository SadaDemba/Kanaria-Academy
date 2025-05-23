const FormResponseService = require('../services/responseServices')
class ResponseFormController {
    static async submitForm(req, res) {
        try {
            const { formId, email, fieldResponses } = req.body;
            if (!formId || !email || !Array.isArray(fieldResponses)) {
                return res.status(400).json({ error: "Données invalides" });
            }

            const response = await FormResponseService.submitFormResponse(formId, email, fieldResponses);
            res.status(201).json({
                success: true,
                message: 'Formulaire renseigné avec succès',
                data: response
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getResponses(req, res) {
        try {
            const { formId } = req.params;
            const responses = await FormResponseService.getFormResponses(formId);
            res.status(200).json({
                success: true,
                data: responses
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
 * Met à jour le statut de lecture d'une réponse
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
    static async toggleReadStatus(req, res) {
        try {
            const { responseId } = req.params;
            const { isRead } = req.body;

            if (isRead === undefined) {
                return res.status(400).json({ error: "Le paramètre isRead est requis" });
            }

            const updatedResponse = await FormResponseService.toggleResponseReadStatus(responseId, isRead);

            res.status(200).json({
                success: true,
                message: `Réponse marquée comme ${isRead ? 'lue' : 'non lue'}`,
                data: updatedResponse
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Récupère les statistiques des réponses pour un formulaire
     * @param {Object} req - Requête HTTP
     * @param {Object} res - Réponse HTTP
     */
    static async getResponsesStats(req, res) {
        try {
            const { formId } = req.params;
            const stats = await FormResponseService.getFormResponsesStats(formId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = ResponseFormController;