const path = require('path');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const ENV = require('./env');

// Configuration temporaire du stockage pour multer
const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Stockage temporaire en mémoire ou dans un dossier temp
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `temp-${uniqueSuffix}${ext}`);
    }
});

// Configuration multer pour le stockage temporaire
const upload = multer({
    storage: tempStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        // Vérifier les types de fichiers acceptés
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont acceptées'), false);
        }
    }
});

// Fonction de gestion d'URL d'image selon l'environnement
const getImageUrl = (filename) => {
    if (ENV.NODE_ENV === 'production' || ENV.AZURE_STORAGE_CONNECTION_STRING) {
        // Dans ce cas, l'URL complète sera fournie directement par Azure Blob Storage
        // Retourne juste le nom du fichier, qui sera utilisé pour créer le blob
        return filename;
    } else {
        // URL locale en développement sans Azure
        return `/uploads/products/${filename}`;
    }
};

// Fonction pour initialiser le container Azure si nécessaire
const initAzureBlobContainer = async () => {
    try {
        if (!ENV.AZURE_STORAGE_CONNECTION_STRING) {
            console.warn("Azure Storage connection string non définie. Les uploads iront uniquement en local.");
            return;
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(
            ENV.AZURE_STORAGE_CONNECTION_STRING
        );
        const containerName = ENV.AZURE_STORAGE_CONTAINER_NAME;
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Créer le conteneur s'il n'existe pas
        const exists = await containerClient.exists();
        if (!exists) {
            console.log(`Création du container Azure Blob '${containerName}'...`);
            await containerClient.create({ access: 'blob' }); // 'blob' permet un accès public en lecture
            console.log(`Container '${containerName}' créé avec succès.`);
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation du container Azure Blob:", error);
    }
};

// Fonction pour uploader vers Azure Blob Storage
const uploadToAzureBlob = async (file, productId) => {
    try {
        if (!ENV.AZURE_STORAGE_CONNECTION_STRING) {
            throw new Error("La chaîne de connexion Azure Storage n'est pas définie");
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(
            ENV.AZURE_STORAGE_CONNECTION_STRING
        );
        const containerClient = blobServiceClient.getContainerClient(ENV.AZURE_STORAGE_CONTAINER_NAME);

        // Créer un nom unique pour le fichier
        const blobName = `product-${productId}-${Date.now()}${path.extname(file.originalname)}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload du fichier
        await blockBlobClient.uploadFile(file.path);

        // Nettoyer le fichier temporaire
        fs.unlinkSync(file.path);

        // Retourner l'URL de l'image
        return blockBlobClient.url;
    } catch (error) {
        console.error("Erreur lors de l'upload vers Azure Blob:", error);
        throw error;
    }
};

// Fonction pour récupérer les images
const getProductImages = async (productId) => {
    try {
        if (!ENV.AZURE_STORAGE_CONNECTION_STRING) {
            throw new Error("La chaîne de connexion Azure Storage n'est pas définie");
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(
            ENV.AZURE_STORAGE_CONNECTION_STRING
        );
        const containerClient = blobServiceClient.getContainerClient(ENV.AZURE_STORAGE_CONTAINER_NAME);

        // Récupérer toutes les images du produit
        const blobs = [];
        const prefix = `product-${productId}`;

        // Lister tous les blobs qui commencent par le prefix
        for await (const blob of containerClient.listBlobsFlat({ prefix })) {
            blobs.push({
                name: blob.name,
                url: `${containerClient.url}/${blob.name}`
            });
        }

        return blobs;
    } catch (error) {
        console.error("Erreur lors de la récupération des images depuis Azure Blob:", error);
        throw error;
    }
};

// Fonction pour supprimer une image
const deleteImage = async (blobUrl) => {
    try {
        if (!ENV.AZURE_STORAGE_CONNECTION_STRING) {
            throw new Error("La chaîne de connexion Azure Storage n'est pas définie");
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(
            ENV.AZURE_STORAGE_CONNECTION_STRING
        );
        const containerClient = blobServiceClient.getContainerClient(ENV.AZURE_STORAGE_CONTAINER_NAME);

        // Extraire le nom du blob de l'URL
        const blobName = blobUrl.split('/').pop();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Supprimer le blob
        await blockBlobClient.delete();
        console.log(`Blob ${blobName} supprimé avec succès.`);

        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
        throw error;
    }
};

module.exports = {
    upload,
    uploadToAzureBlob,
    getProductImages,
    deleteImage,
    initAzureBlobContainer,
    getImageUrl
};