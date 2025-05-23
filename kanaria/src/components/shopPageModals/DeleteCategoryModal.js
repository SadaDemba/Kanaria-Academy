import React, { useState } from 'react';
import ShopService from '../../services/ShopService';
import './Modal.css';


const DeleteCategoryModal = ({ category, onClose, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const shopService = new ShopService();

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError(null);

            if (category._count && category._count.products > 0) {
                setError("Impossible de supprimer cette catégorie car elle contient des produits.");
                setLoading(false);
                return;
            }

            await shopService.deleteCategory(category.id);
            onDelete();
        } catch (err) {
            console.error('Erreur lors de la suppression de la catégorie:', err);
            setError(
                err.response?.data?.error ||
                "Une erreur est survenue lors de la suppression de la catégorie"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container delete-modal">
                <div className="modal-header">
                    <h2>Confirmer la suppression</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <p className="delete-warning">
                        Êtes-vous sûr de vouloir supprimer la catégorie <strong>{category.name}</strong> ?
                    </p>

                    {category._count && category._count.products > 0 ? (
                        <div className="form-error">
                            Cette catégorie contient {category._count.products} produit{category._count.products !== 1 ? 's' : ''}.
                            Vous devez d'abord supprimer ou déplacer ces produits.
                        </div>
                    ) : (
                        <p className="delete-info">
                            Cette action est irréversible et supprimera définitivement cette catégorie.
                        </p>
                    )}

                    {error && (
                        <div className="form-error">{error}</div>
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annuler
                    </button>
                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={loading || (category._count && category._count.products > 0)}
                    >
                        {loading ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;