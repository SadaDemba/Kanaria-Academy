import React, { useState } from 'react';
import UserService from '../../services/UserService';
import './Modal.css';

const DeleteUserModal = ({ user, onClose, onUserDeleted }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userService = new UserService();

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError(null);

            await userService.deleteUser(user.id);
            onUserDeleted();
            onClose();
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', err);
            setError(
                err.response?.data?.error ||
                "Une erreur est survenue lors de la suppression de l'utilisateur"
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
                        Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.username}</strong> ({user.email}) ?
                    </p>
                    <p className="delete-info">
                        Cette action est irréversible et supprimera définitivement cet utilisateur.
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

export default DeleteUserModal;