const { Router } = require('express');
const ShopController = require('../controllers/shopController');
const { upload } = require('../config/storage');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const { Role } = require('../utils/enums');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Gestion de la boutique
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         categoryId:
 *           type: string
 *         stock:
 *           type: integer
 *         isActive:
 *           type: boolean
 */

// Routes Catégories
/**
 * @swagger
 * /shop/categories:
 *   get:
 *     summary: Récupère toutes les catégories
 *     tags: [Shop]
 *     responses:
 *       200:
 *         description: Liste des catégories
 */
router.get('/categories', ShopController.getAllCategories);

/**
 * @swagger
 * /shop/categories/{id}:
 *   get:
 *     summary: Récupère une catégorie par son ID
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *       404:
 *         description: Catégorie non trouvée
 */
router.get('/categories/:id', ShopController.getCategoryById);

/**
 * @swagger
 * /shop/categories:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 */
router.post('/categories', authenticate, authorize(Role.SUPER_ADMIN), ShopController.createCategory);

/**
 * @swagger
 * /shop/categories/{id}:
 *   put:
 *     summary: Met à jour une catégorie
 *     tags: [Shop]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 */
router.put('/categories/:id', authenticate, authorize(Role.SUPER_ADMIN), ShopController.updateCategory);

/**
 * @swagger
 * /shop/categories/{id}:
 *   delete:
 *     summary: Supprime une catégorie
 *     tags: [Shop]
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
 *         description: Catégorie supprimée avec succès
 */
router.delete('/categories/:id', authenticate, authorize(Role.SUPER_ADMIN), ShopController.deleteCategory);

// Routes Produits
/**
 * @swagger
 * /shop/products:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Shop]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get('/products', ShopController.getAllProducts);

/**
 * @swagger
 * /shop/products/{id}:
 *   get:
 *     summary: Récupère un produit par son ID
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du produit
 *       404:
 *         description: Produit non trouvé
 */
router.get('/products/:id', ShopController.getProductById);

/**
 * @swagger
 * /shop/products:
 *   post:
 *     summary: Crée un nouveau produit
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               stock:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 */
router.post('/products', authenticate, authorize(Role.SUPER_ADMIN), upload.array('images', 5), ShopController.createProduct);

/**
 * @swagger
 * /shop/products/{id}:
 *   put:
 *     summary: Met à jour un produit
 *     tags: [Shop]
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 */
router.put('/products/:id', authenticate, authorize(Role.SUPER_ADMIN), ShopController.updateProduct);

/**
 * @swagger
 * /shop/products/{id}:
 *   delete:
 *     summary: Supprime un produit
 *     tags: [Shop]
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
 *         description: Produit supprimé avec succès
 */
router.delete('/products/:id', authenticate, authorize(Role.SUPER_ADMIN), ShopController.deleteProduct);

// Routes Images
/**
 * @swagger
 * /shop/products/{id}/images:
 *   post:
 *     summary: Ajoute des images à un produit
 *     tags: [Shop]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images ajoutées avec succès
 */
router.post('/products/:id/images', authenticate, authorize(Role.SUPER_ADMIN), upload.array('images', 5), ShopController.uploadProductImages);

/**
 * @swagger
 * /shop/images/{imageId}:
 *   delete:
 *     summary: Supprime une image de produit
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image supprimée avec succès
 */
router.delete('/images/:imageId', authenticate, authorize(Role.SUPER_ADMIN), ShopController.deleteProductImage);

/**
 * @swagger
 * /shop/images/{imageId}/primary:
 *   put:
 *     summary: Définit une image comme principale pour un produit
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image définie comme principale
 */
router.put('/images/:imageId/primary', authenticate, authorize(Role.SUPER_ADMIN), ShopController.setMainProductImage);

module.exports = router;