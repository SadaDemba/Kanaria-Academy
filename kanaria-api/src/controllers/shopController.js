const shopService = require('../services/shopServices');
const { uploadToAzureBlob, getImageUrl } = require('../config/storage');
const prisma = require('../config/prisma');
const fs = require('fs').promises;
const path = require('path');
const ENV = require('../config/env');

class ShopController {
    // Catégories
    async createCategory(req, res) {
        try {
            const category = await shopService.createCategory(req.body);
            res.status(201).json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await shopService.updateCategory(id, req.body);
            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await shopService.deleteCategory(id);
            res.json({
                success: true,
                message: 'Catégorie supprimée avec succès'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await shopService.getAllCategories();
            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await shopService.getCategoryById(id);

            if (!category) {
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }

            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Produits
    async createProduct(req, res) {
        try {
            const data = req.body;
            const files = req.files || [];

            // Création initiale du produit
            const product = await prisma.product.create({
                data: {
                    name: data.name,
                    description: data.description,
                    price: parseFloat(data.price),
                    stock: parseInt(data.stock || 0),
                    isActive: data.isActive === 'true',
                    categoryId: data.categoryId
                }
            });

            // Traitement des images
            const imagePromises = files.map(async (file, index) => {
                if (ENV.AZURE_STORAGE_CONNECTION_STRING) {
                    // Upload vers Azure Blob Storage
                    const imageUrl = await uploadToAzureBlob(file, product.id);
                    return prisma.productImage.create({
                        data: {
                            productId: product.id,
                            imageUrl: imageUrl,
                            isPrimary: index === 0, // Première image = image principale
                            altText: data.name,
                            displayOrder: index
                        }
                    });
                } else {
                    // Stockage local (fallback)
                    const imageUrl = getImageUrl(path.basename(file.path));
                    return prisma.productImage.create({
                        data: {
                            productId: product.id,
                            imageUrl: imageUrl,
                            isPrimary: index === 0,
                            altText: data.name,
                            displayOrder: index
                        }
                    });
                }
            });

            // Attendre que toutes les images soient traitées
            if (imagePromises.length > 0) {
                await Promise.all(imagePromises);
            }

            // Récupérer le produit complet avec ses images
            const createdProduct = await shopService.getProductById(product.id);

            res.status(201).json({
                success: true,
                data: createdProduct
            });
        } catch (error) {
            // En cas d'erreur, supprimer les fichiers uploadés
            if (req.files && req.files.length) {
                req.files.forEach(async file => {
                    try {
                        await fs.unlink(file.path);
                    } catch (e) {
                        console.error('Erreur lors de la suppression du fichier:', e);
                    }
                });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await shopService.updateProduct(id, req.body);
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            // Récupérer les images à supprimer
            const product = await shopService.getProductById(id);
            if (product && product.images && product.images.length > 0) {
                for (const image of product.images) {
                    try {
                        if (ENV.AZURE_STORAGE_CONNECTION_STRING) {
                            // Supprimer de Azure Blob Storage
                            await deleteImage(image.imageUrl);
                        } else {
                            // Supprimer du stockage local
                            const filename = image.imageUrl.split('/').pop();
                            const filePath = path.join(__dirname, '../../public/uploads/products', filename);
                            await fs.unlink(filePath);
                        }
                    } catch (e) {
                        console.error('Erreur lors de la suppression du fichier:', e);
                    }
                }
            }

            await shopService.deleteProduct(id);
            res.json({
                success: true,
                message: 'Produit supprimé avec succès'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const { categoryId, search } = req.query;
            const products = await shopService.getAllProducts({ categoryId, search });
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await shopService.getProductById(id);

            if (!product) {
                return res.status(404).json({ error: 'Produit non trouvé' });
            }

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Images
    async uploadProductImages(req, res) {
        try {
            const { id } = req.params;
            const files = req.files || [];

            if (!files.length) {
                return res.status(400).json({ error: 'Aucune image fournie' });
            }

            const product = await shopService.getProductById(id);
            if (!product) {
                return res.status(404).json({ error: 'Produit non trouvé' });
            }

            const imagePromises = files.map(async (file, index) => {
                let imageUrl;
                if (ENV.AZURE_STORAGE_CONNECTION_STRING) {
                    // Upload vers Azure Blob Storage
                    imageUrl = await uploadToAzureBlob(file, id);
                } else {
                    // Stockage local
                    imageUrl = getImageUrl(path.basename(file.path));
                }

                // Si c'est la première image et qu'il n'y a pas d'autres images, la définir comme principale
                const isPrimary = index === 0 && product.images.length === 0;
                return shopService.addProductImage(id, imageUrl, isPrimary);
            });

            const images = await Promise.all(imagePromises);

            res.status(201).json({
                success: true,
                data: images
            });
        } catch (error) {
            // Nettoyer les fichiers temporaires en cas d'erreur
            if (req.files && req.files.length) {
                req.files.forEach(async file => {
                    try {
                        await fs.unlink(file.path);
                    } catch (e) {
                        console.error('Erreur lors de la suppression du fichier temporaire:', e);
                    }
                });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProductImage(req, res) {
        try {
            const { imageId } = req.params;

            // Récupérer l'image pour trouver le fichier à supprimer
            const image = await prisma.productImage.findUnique({
                where: { id: imageId }
            });

            if (!image) {
                return res.status(404).json({ error: 'Image non trouvée' });
            }

            // Supprimer le fichier
            try {
                if (ENV.AZURE_STORAGE_CONNECTION_STRING) {
                    // Supprimer de Azure Blob Storage
                    await deleteImage(image.imageUrl);
                } else {
                    // Supprimer du stockage local
                    const filename = image.imageUrl.split('/').pop();
                    const filePath = path.join(__dirname, '../../public/uploads/products', filename);
                    await fs.unlink(filePath);
                }
            } catch (e) {
                console.error('Erreur lors de la suppression du fichier:', e);
            }

            await shopService.deleteProductImage(imageId);

            res.json({
                success: true,
                message: 'Image supprimée avec succès'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async setMainProductImage(req, res) {
        try {
            const { imageId } = req.params;
            const image = await shopService.setMainProductImage(imageId);

            res.json({
                success: true,
                data: image,
                message: 'Image définie comme principale'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ShopController();