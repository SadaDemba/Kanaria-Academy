import React, { useState } from 'react';
import UserService from '../../services/UserService';
import './Modal.css';

const ChangePasswordModal = ({ userId, onClose, onPasswordChanged }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Le mot de passe actuel est requis";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "Le nouveau mot de passe est requis";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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

            await userService.changePassword(userId, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            onPasswordChanged();
            onClose();
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            setApiError(
                error.response?.data?.error ||
                "Une erreur est survenue lors du changement de mot de passe"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Changer de mot de passe</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {apiError && (
                        <div className="form-error">{apiError}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="currentPassword">Mot de passe actuel *</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={errors.currentPassword ? 'error' : ''}
                        />
                        {errors.currentPassword && <div className="field-error">{errors.currentPassword}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Nouveau mot de passe *</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={errors.newPassword ? 'error' : ''}
                        />
                        {errors.newPassword && <div className="field-error">{errors.newPassword}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
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
                            {loading ? 'Changement en cours...' : 'Changer le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;