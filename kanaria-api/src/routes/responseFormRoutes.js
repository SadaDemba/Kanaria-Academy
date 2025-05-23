const express = require('express');
const router = express.Router();
const ResponseFormController = require('../controllers/responseFormController');
const authenticate = require('../middlewares/authMiddleware');

const { getResponses, submitForm, toggleReadStatus, getResponsesStats } = require('../controllers/responseFormController')

/**
 * @swagger
 * tags:
 *   name: FormResponses
 *   description: Gestion des réponses aux formulaires
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FormResponse:
 *       type: object
 *       properties:
 *         formId:
 *           type: string
 *           description: ID du formulaire
 *         email:
 *           type: string
 *           format: email
 *           description: Email de la personne qui soumet le formulaire
 *         fieldResponses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fieldId:
 *                 type: string
 *                 description: ID du champ
 *               value:
 *                 type: string
 *                 description: Valeur de réponse
 */

/**
 * @swagger
 * /form-responses/submit:
 *   post:
 *     summary: Soumet une réponse complète à un formulaire
 *     tags: [FormResponses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormResponse'
 *     responses:
 *       201:
 *         description: Formulaire soumis avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/submit", submitForm);

/**
 * @swagger
 * /form-responses/{formId}/responses:
 *   get:
 *     summary: Récupère les réponses d'un formulaire spécifique
 *     tags: [FormResponses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du formulaire
 *     responses:
 *       200:
 *         description: Liste des réponses
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:formId/responses", authenticate, getResponses);

/**
 * @swagger
 * /form-responses/toggle-read-status/{responseId}:
 *   put:
 *     summary: Bascule le statut de lecture d'une réponse (lue/non lue)
 *     tags: [FormResponses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réponse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isRead:
 *                 type: boolean
 *                 description: Nouveau statut de lecture
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Paramètre manquant
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.put("/toggle-read-status/:responseId", authenticate, toggleReadStatus);

/**
 * @swagger
 * /form-responses/{formId}/stats:
 *   get:
 *     summary: Récupère les statistiques des réponses pour un formulaire
 *     tags: [FormResponses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du formulaire
 *     responses:
 *       200:
 *         description: Statistiques des réponses
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:formId/stats", authenticate, getResponsesStats);

module.exports = router;