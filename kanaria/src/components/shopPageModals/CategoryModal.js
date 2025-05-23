import React, { useState, useEffect } from 'react';
import ShopService from '../../services/ShopService';
import './Modal.css';

const CategoryModal = ({ isEditing, category, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const shopService = new ShopService();

    // Initialiser les données du formulaire si on est en mode édition
    useEffect(() => {
        if (isEditing && category) {
            setFormData({
                name: category.name || '',
                description: category.description || ''
            });
        }
    }, [isEditing, category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Effacer l'erreur pour ce champ
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Le nom de la catégorie est requis";
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

            if (isEditing) {
                await shopService.updateCategory(category.id, formData);
            } else {
                await shopService.createCategory(formData);
            }

            onSave();
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la catégorie:', error);
            setApiError(
                error.response?.data?.error ||
                "Une erreur est survenue lors de l'enregistrement de la catégorie"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {apiError && (
                        <div className="form-error">{apiError}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Nom de la catégorie *</label>
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
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        ></textarea>
                        <div className="field-help">Une brève description de cette catégorie de produits (optionnel).</div>
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

export default CategoryModal;