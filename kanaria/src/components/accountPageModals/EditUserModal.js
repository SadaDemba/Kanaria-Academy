import React, { useState } from 'react';
import UserService from '../../services/UserService';
import { Role } from '../../models/enums';
import './Modal.css';

const EditUserModal = ({ user, onClose, onUserUpdated, isSuperAdmin }) => {
    const [formData, setFormData] = useState({
        username: user.username || '',
        role: user.role || Role.ADMIN
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const userService = new UserService();

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

        if (!formData.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est requis";
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

            // Créer un objet avec seulement les champs modifiés
            const updateData = {};
            if (formData.username !== user.username) {
                updateData.username = formData.username;
            }

            if (isSuperAdmin && formData.role !== user.role) {
                updateData.role = formData.role;
            }

            // Ne pas envoyer de requête si rien n'a changé
            if (Object.keys(updateData).length === 0) {
                onClose();
                return;
            }

            await userService.updateUser(user.id, updateData);
            onUserUpdated();
            onClose();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            setApiError(
                error.response?.data?.error ||
                "Une erreur est survenue lors de la mise à jour de l'utilisateur"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Modifier l'utilisateur</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {apiError && (
                        <div className="form-error">{apiError}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            disabled
                            className="disabled"
                        />
                        <small className="field-help">L'email ne peut pas être modifié</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error' : ''}
                        />
                        {errors.username && <div className="field-error">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Rôle</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={!isSuperAdmin}
                            className={!isSuperAdmin ? 'disabled' : ''}
                        >
                            <option value={Role.ADMIN}>Admin</option>
                            <option value={Role.SUPER_ADMIN}>Super Admin</option>
                        </select>
                        {!isSuperAdmin && (
                            <small className="field-help">Seul un super admin peut modifier le rôle</small>
                        )}
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
                            {loading ? 'Mise à jour...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;