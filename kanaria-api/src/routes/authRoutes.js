const { Router } = require('express');
const { validate, userSchema, loginUserSchema, updateUserSchema, changePasswordSchema } = require('../validators/schemas');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const UserController = require('../controllers/userController');
const { Role } = require('../utils/enums');

const router = Router();
const userController = new UserController()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes d'authentification
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "SecureP@ssw0rd"
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/signup', validate(userSchema), authenticate, authorize(Role.SUPER_ADMIN), userController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie un token
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', validate(loginUserSchema), userController.login);


module.exports = router;