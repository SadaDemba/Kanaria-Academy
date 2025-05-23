const express = require('express');
const ParticipantController = require('../controllers/participantController');
const { validate, participantSchemas, statusSchema } = require('../validators/schemas');
const authenticate = require('../middlewares/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Participants
 *   description: Gestion des participants
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Participant:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "johndoe@example.com"
 *         status:
 *           type: string
 *           enum: [read, unread]
 *           example: "unread"
 * 
 *     StatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [read, unread]
 *           example: "read"
 */

/**
 * @swagger
 * /participants/create:
 *   post:
 *     summary: Inscrire un nouveau participant
 *     tags: [Participants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participant'
 *     responses:
 *       201:
 *         description: Participant inscrit avec succès
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /participants/update-status/admin/{id}:
 *   put:
 *     summary: Mettre à jour le statut d'un participant (Admin uniquement)
 *     tags: [Participants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du participant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Participant non trouvé
 */

/**
 * @swagger
 * /participants/admin/{id}:
 *   get:
 *     summary: Récupérer un participant par ID (Admin uniquement)
 *     tags: [Participants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du participant
 *     responses:
 *       200:
 *         description: Détails du participant
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Participant non trouvé
 */

/**
 * @swagger
 * /participants/admin/email/{email}:
 *   get:
 *     summary: Récupérer un participant par email (Admin uniquement)
 *     tags: [Participants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email du participant
 *     responses:
 *       200:
 *         description: Détails du participant
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Participant non trouvé
 */

/**
 * @swagger
 * /participants/admin/:
 *   get:
 *     summary: Récupérer tous les participants (Admin uniquement)
 *     tags: [Participants]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des participants
 *       403:
 *         description: Accès non autorisé
 */

/**
 * @swagger
 * /participants/admin/{id}:
 *   delete:
 *     summary: Supprimer un participant (Admin uniquement)
 *     tags: [Participants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du participant
 *     responses:
 *       200:
 *         description: Participant supprimé avec succès
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Participant non trouvé
 */

const router = express.Router();

router.post('/create', validate(participantSchemas), ParticipantController.registerParticipant);

router.put('/update-status/admin/:id', validate(statusSchema), authenticate, ParticipantController.updateStatus);

router.get('/admin/:id', authenticate, ParticipantController.getParticipantById);

router.get('/admin/email/:email', authenticate, ParticipantController.getParticipantByEmail);

router.get('/admin/', authenticate, ParticipantController.getAllParticipants);

router.delete('/admin/:id', authenticate, ParticipantController.deleteParticipant);

module.exports = router;
