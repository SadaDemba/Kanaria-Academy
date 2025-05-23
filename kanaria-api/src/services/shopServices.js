const prisma = require('../config/prisma');
const { getImageUrl } = require('../config/storage');

class ShopService {
    async createCategory(data) {
        return prisma.shopCategory.create({
            data
        });
    }

    async updateCategory(id, data) {
        return prisma.shopCategory.update({
            where: { id },
            data
        });
    }

    async deleteCategory(id) {
        return prisma.shopCategory.delete({
            where: { id }
        });
    }

    async getAllCategories() {
        return prisma.shopCategory.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
    }

    async getCategoryById(id) {
        return prisma.shopCategory.findUnique({
            where: { id },
            include: {
                products: {
                    where: { isActive: true },
                    include: {
                        images: {
                            orderBy: {
                                isPrimary: 'desc'
                            },
                            take: 1
                        }
                    }
                }
            }
        });
    }

    // Produits
    async createProduct(data, images = []) {
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

        // Traiter les images si présentes
        if (images && images.length) {
            const imagePromises = images.map((image, index) => {
                return prisma.productImage.create({
                    data: {
                        productId: product.id,
                        imageUrl: image.path, // Stocké localement pour le développement
                        isPrimary: index === 0, // Première image = image principale
                        altText: data.name,
                        displayOrder: index
                    }
                });
            });

            await Promise.all(imagePromises);
        }

        return this.getProductById(product.id);
    }

    async updateProduct(id, data) {
        return prisma.product.update({
            where: { id },
            data: {
                ...data,
                price: data.price ? parseFloat(data.price) : undefined,
                stock: data.stock ? parseInt(data.stock) : undefined
            }
        });
    }

    async deleteProduct(id) {
        return prisma.product.delete({
            where: { id }
        });
    }

    async getAllProducts(filter = {}) {
        const where = { isActive: true };

        if (filter.categoryId) {
            where.categoryId = filter.categoryId;
        }

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { description: { contains: filter.search } }
            ];
        }

        return prisma.product.findMany({
            where,
            include: {
                category: true,
                images: {
                    orderBy: {
                        isPrimary: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getProductById(id) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: {
                    orderBy: [
                        { isPrimary: 'desc' },
                        { displayOrder: 'asc' }
                    ]
                }
            }
        });
    }


    async addProductImage(productId, imageUrl, isPrimary = false) {

        if (isPrimary) {
            await prisma.productImage.updateMany({
                where: { productId },
                data: { isPrimary: false }
            });
        }

        return prisma.productImage.create({
            data: {
                productId,
                imageUrl,
                isPrimary,
                displayOrder: await this.getNextImageOrder(productId)
            }
        });
    }

    async deleteProductImage(id) {
        return prisma.productImage.delete({
            where: { id }
        });
    }

    async getNextImageOrder(productId) {
        const maxOrder = await prisma.productImage.findFirst({
            where: { productId },
            orderBy: { displayOrder: 'desc' },
            select: { displayOrder: true }
        });

        return maxOrder ? maxOrder.displayOrder + 1 : 0;
    }

    async setMainProductImage(id) {
        const image = await prisma.productImage.findUnique({
            where: { id },
            select: { productId: true }
        });

        if (!image) throw new Error("Image non trouvée");

        await prisma.productImage.updateMany({
            where: { productId: image.productId },
            data: { isPrimary: false }
        });

        return prisma.productImage.update({
            where: { id },
            data: { isPrimary: true }
        });
    }
}

module.exports = new ShopService();