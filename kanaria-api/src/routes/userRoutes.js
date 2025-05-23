const { Router } = require('express');
const { validate, userSchema, loginUserSchema, updateUserSchema, changePasswordSchema } = require('../validators/schemas');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const { Role } = require('../utils/enums');
const UserController = require('../controllers/userController');

const router = Router();
const userController = new UserController()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdits
 */
router.get('/', authenticate, authorize(Role.SUPER_ADMIN), userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère les détails d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', authenticate, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour les informations d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, SUPER_ADMIN]
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', authenticate, validate(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /users/{id}/change-password:
 *   put:
 *     summary: Change le mot de passe d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', authenticate, authorize(Role.SUPER_ADMIN), userController.deleteUser);

/**
 * @swagger
 * /users/{id}/toggle-active:
 *   put:
 *     summary: Active ou désactive un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Statut d'activation modifié avec succès
 *       400:
 *         description: Données invalides ou tentative de désactivation de son propre compte
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id/toggle-active', authenticate, authorize(Role.SUPER_ADMIN), userController.toggleUserActive);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   put:
 *     summary: Réinitialise le mot de passe d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id/reset-password', authenticate, authorize(Role.SUPER_ADMIN), userController.resetPassword);

module.exports = router;