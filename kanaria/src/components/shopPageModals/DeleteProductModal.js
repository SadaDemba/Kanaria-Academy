import React, { useState } from 'react';
import ShopService from '../../services/ShopService';
import './Modal.css';

const DeleteProductModal = ({ product, onClose, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const shopService = new ShopService();

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError(null);

            await shopService.deleteProduct(product.id);
            onDelete();
        } catch (err) {
            console.error('Erreur lors de la suppression du produit:', err);
            setError(
                err.response?.data?.error ||
                "Une erreur est survenue lors de la suppression du produit"
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
                        Êtes-vous sûr de vouloir supprimer le produit <strong>{product.name}</strong> ?
                    </p>
                    <p className="delete-info">
                        Cette action est irréversible et supprimera définitivement ce produit et toutes ses images.
                    </p>

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
                        disabled={loading}
                    >
                        {loading ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProductModal;