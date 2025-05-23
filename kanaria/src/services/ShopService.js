import BaseService from './BaseService';

class ShopService extends BaseService {
    constructor() {
        super();
        this.basePath = '/shop';
    }

    async getAllCategories() {
        return this.get(`${this.basePath}/categories`);
    }

    async getCategoryById(id) {
        return this.get(`${this.basePath}/categories/${id}`);
    }

    async createCategory(data) {
        return this.post(`${this.basePath}/categories`, data);
    }

    async updateCategory(id, data) {
        return this.put(`${this.basePath}/categories/${id}`, data);
    }

    async deleteCategory(id) {
        return this.delete(`${this.basePath}/categories/${id}`);
    }

    // Produits
    async getAllProducts(params = {}) {
        return this.get(`${this.basePath}/products`, { params });
    }

    async getProductById(id) {
        return this.get(`${this.basePath}/products/${id}`);
    }

    async createProduct(data) {
        // Utiliser FormData pour gérer les fichiers
        const formData = new FormData();

        // Ajouter les données textuelles
        for (const key in data) {
            if (key !== 'images') {
                formData.append(key, data[key]);
            }
        }

        // Ajouter les images
        if (data.images && data.images.length) {
            data.images.forEach(image => {
                formData.append('images', image);
            });
        }

        return this.post(`${this.basePath}/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async updateProduct(id, data) {
        return this.put(`${this.basePath}/products/${id}`, data);
    }

    async deleteProduct(id) {
        return this.delete(`${this.basePath}/products/${id}`);
    }

    // Images
    async uploadProductImages(productId, images) {
        const formData = new FormData();

        images.forEach(image => {
            formData.append('images', image);
        });

        return this.post(`${this.basePath}/products/${productId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async deleteProductImage(imageId) {
        return this.delete(`${this.basePath}/images/${imageId}`);
    }

    async setMainProductImage(imageId) {
        return this.put(`${this.basePath}/images/${imageId}/primary`);
    }

    // Utilitaire pour vérifier si une URL est une URL Azure Blob
    isAzureBlobUrl(url) {
        return url && (
            url.includes('blob.core.windows.net') || 
            url.startsWith('https://kanaria2025sa')
        );
    }

    // Obtenir l'URL optimisée pour affichage
    getDisplayImageUrl(imageUrl) {
        if (!imageUrl) return null;
        
        // Si c'est déjà une URL Azure Blob, la retourner telle quelle
        if (this.isAzureBlobUrl(imageUrl)) {
            return imageUrl;
        }
        
        // Pour les URLs locales, préfixer avec l'URL de base de l'API si nécessaire
        if (imageUrl.startsWith('/uploads/')) {
            return `${process.env.REACT_APP_API_URL || ''}${imageUrl}`;
        }
        
        // Sinon, retourner l'URL telle quelle
        return imageUrl;
    }
}

export default ShopService;