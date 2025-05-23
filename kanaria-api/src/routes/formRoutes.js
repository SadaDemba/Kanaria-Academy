const express = require('express');
const router = express.Router();
const FormController = require('../controllers/formController');
const authenticate = require('../middlewares/authMiddleware')

const formController = new FormController();

/**
 * @swagger
 * /forms/add:
 *   post:
 *     summary: Crée un nouveau formulaire
 *     description: Crée un formulaire avec les données fournies
 *     tags: [Forms]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Formulaire créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/add', authenticate, formController.createForm);

/**
 * @swagger
 * /forms/check/{formId}/can-modify:
 *   get:
 *     summary: Vérifie si un formulaire peut être modifié
 *     description: Retourne si l'utilisateur a le droit de modifier le formulaire spécifié
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retourne un booléen indiquant si la modification est possible
 *       404:
 *         description: Formulaire non trouvé
 */
router.get('/check/:formId/can-modify', formController.canModifyForm);

/**
 * @swagger
 * /forms/edit/{formId}/fields:
 *   put:
 *     summary: Remplace les champs d'un formulaire
 *     description: Met à jour les champs d'un formulaire spécifique
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *     responses:
 *       200:
 *         description: Champs mis à jour avec succès
 *       400:
 *         description: Erreur de validation
 */
router.put('/edit/:formId/fields', authenticate, formController.replaceFormFields);

/**
 * @swagger
 * /forms/get-by-id/{formId}:
 *   get:
 *     summary: Récupère un formulaire avec ses champs
 *     description: Retourne les détails d'un formulaire avec ses champs associés
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retourne les détails du formulaire
 *       404:
 *         description: Formulaire non trouvé
 */
router.get('/get-by-id/:formId', formController.getFormWithFields);

/**
 * @swagger
 * /forms/get-actives:
 *   get:
 *     summary: Récupère tous les formulaires actifs
 *     description: Retourne une liste de tous les formulaires actuellement actifs
 *     tags: [Forms]
 *     responses:
 *       200:
 *         description: Retourne la liste des formulaires actifs
 */
router.get('/get-actives', formController.getActiveForms);

/**
 * @swagger
 * /forms/get-all:
 *   get:
 *     summary: Récupère tous les formulaires
 *     description: Retourne une liste de tous les formulaires
 *     tags: [Forms]
 *     responses:
 *       200:
 *         description: Retourne la liste des formulaires
 */
router.get('/get-all', formController.getAllForms);

/**
 * @swagger
 * /forms/edit/{formId}/info:
 *   put:
 *     summary: Met à jour les informations générales d'un formulaire
 *     description: Met à jour le titre, la description et les paramètres d'un formulaire spécifique
 *     tags: [Forms]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               beginDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Informations du formulaire mises à jour avec succès
 *       400:
 *         description: Erreur de validation
 *       403:
 *         description: Formulaire ne pouvant pas être modifié
 */
router.put('/edit/:formId/info', authenticate, formController.updateFormInfo);


module.exports = router;