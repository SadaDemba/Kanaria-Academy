import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaStar } from 'react-icons/fa';
import ShopService from '../../services/ShopService';
import './Modal.css';

const AddEditProductModal = ({ isEditing, product, categories, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        stock: '0',
        isActive: true
    });

    const [images, setImages] = useState([]);
    const [imagesToUpload, setImagesToUpload] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const shopService = new ShopService();

    // Initialiser les données du formulaire si on est en mode édition
    useEffect(() => {
        if (isEditing && product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price ? product.price.toString() : '',
                categoryId: product.categoryId || '',
                stock: product.stock ? product.stock.toString() : '0',
                isActive: product.isActive !== undefined ? product.isActive : true
            });

            if (product.images && product.images.length) {
                setImages(product.images);
            }
        }
    }, [isEditing, product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Effacer l'erreur pour ce champ
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Créer des URL pour les aperçus
        const newPreviewUrls = [...imagePreviewUrls];
        const newImagesToUpload = [...imagesToUpload];

        files.forEach(file => {
            newImagesToUpload.push(file);
            newPreviewUrls.push({
                url: URL.createObjectURL(file),
                file: file,
                isNew: true
            });
        });

        setImagePreviewUrls(newPreviewUrls);
        setImagesToUpload(newImagesToUpload);

        // Reset l'input file
        e.target.value = null;
    };

    const handleRemoveImage = (index, isExisting) => {
        if (isExisting) {
            // Image existante
            const imageToRemove = images[index];
            setImagesToDelete(prev => [...prev, imageToRemove.id]);
            setImages(prev => prev.filter((_, i) => i !== index));
        } else {
            // Nouvelle image
            const newUrls = [...imagePreviewUrls];
            const newImagesToUpload = [...imagesToUpload];

            // Libérer l'URL de l'aperçu
            URL.revokeObjectURL(newUrls[index].url);

            newUrls.splice(index, 1);
            newImagesToUpload.splice(index, 1);

            setImagePreviewUrls(newUrls);
            setImagesToUpload(newImagesToUpload);
        }
    };

    const handleSetPrimaryImage = (index, isExisting) => {
        if (isExisting) {
            // Image existante
            setImages(prev => prev.map((img, i) => ({
                ...img,
                isPrimary: i === index
            })));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Le nom du produit est requis";
        }

        if (!formData.description.trim()) {
            newErrors.description = "La description est requise";
        }

        if (!formData.price.trim()) {
            newErrors.price = "Le prix est requis";
        } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            newErrors.price = "Le prix doit être un nombre positif";
        }

        if (!formData.categoryId) {
            newErrors.categoryId = "La catégorie est requise";
        }

        if (formData.stock.trim() && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
            newErrors.stock = "Le stock doit être un nombre positif ou zéro";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setApiError(null);

            // Préparer les données
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock || '0')
            };

            if (isEditing) {
                // Mise à jour du produit
                await shopService.updateProduct(product.id, productData);

                // Traiter les suppressions d'images
                for (const imageId of imagesToDelete) {
                    await shopService.deleteProductImage(imageId);
                }

                // Uploader les nouvelles images
                if (imagesToUpload.length > 0) {
                    await shopService.uploadProductImages(product.id, imagesToUpload);
                }

                // Mettre à jour l'image principale si nécessaire
                const primaryImage = images.find(img => img.isPrimary);
                if (primaryImage) {
                    await shopService.setMainProductImage(primaryImage.id);
                }
            } else {
                // Création d'un nouveau produit
                productData.images = imagesToUpload;
                await shopService.createProduct(productData);
            }

            onSave();
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du produit:', error);
            setApiError(
                error.response?.data?.error ||
                "Une erreur est survenue lors de l'enregistrement du produit"
            );
        } finally {
            setLoading(false);
        }
    };

    // Fonction helper pour obtenir l'URL d'image correcte
    const getImageUrl = (imageUrl) => {
        return shopService.getDisplayImageUrl(imageUrl);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container large-modal">
                <div className="modal-header">
                    <h2>{isEditing ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {apiError && (
                        <div className="form-error">{apiError}</div>
                    )}

                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="name">Nom du produit *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <div className="field-error">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="categoryId">Catégorie *</label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className={errors.categoryId ? 'error' : ''}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && <div className="field-error">{errors.categoryId}</div>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="price">Prix (€) *</label>
                                    <input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={errors.price ? 'error' : ''}
                                        placeholder="0.00"
                                    />
                                    {errors.price && <div className="field-error">{errors.price}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stock">Stock</label>
                                    <input
                                        type="text"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className={errors.stock ? 'error' : ''}
                                        placeholder="0"
                                    />
                                    {errors.stock && <div className="field-error">{errors.stock}</div>}
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label htmlFor="isActive">Produit actif</label>
                                <div className="checkbox-help">
                                    Désactivez cette option pour masquer le produit dans la boutique.
                                </div>
                            </div>
                        </div>

                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={errors.description ? 'error' : ''}
                                    rows="8"
                                ></textarea>
                                {errors.description && <div className="field-error">{errors.description}</div>}
                            </div>

                            <div className="form-group">
                                <label>Images</label>
                                <div className="image-upload-container">
                                    <label htmlFor="image-upload" className="image-upload-btn">
                                        <FaUpload /> Ajouter des images
                                    </label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="upload-help">
                                        Formats acceptés: JPG, PNG. Taille max: 5MB.
                                    </div>
                                </div>

                                <div className="image-previews">
                                    {/* Images existantes */}
                                    {images.map((image, index) => (
                                        <div key={`existing-${index}`} className="image-preview">
                                            <img 
                                                src={getImageUrl(image.imageUrl)} 
                                                alt="Aperçu" 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-image.png'; // Image placeholder en cas d'erreur
                                                }}
                                            />
                                            <div className="image-preview-actions">
                                                <button
                                                    type="button"
                                                    className={`set-primary-btn ${image.isPrimary ? 'active' : ''}`}
                                                    onClick={() => handleSetPrimaryImage(index, true)}
                                                    title={image.isPrimary ? 'Image principale' : 'Définir comme principale'}
                                                >
                                                    <FaStar />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => handleRemoveImage(index, true)}
                                                    title="Supprimer l'image"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Nouvelles images */}
                                    {imagePreviewUrls.map((preview, index) => (
                                        <div key={`new-${index}`} className="image-preview">
                                            <img src={preview.url} alt="Aperçu" />
                                            <div className="image-preview-actions">
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => handleRemoveImage(index, false)}
                                                    title="Supprimer l'image"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditProductModal;