import React, { useState } from 'react';
import { Role } from '../../models/enums';
import './Modal.css';
import AuthService from '../../services/AuthService';

const AddUserModal = ({ onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        role: Role.ADMIN
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const authService = new AuthService()

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

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "L'email n'est pas valide";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est requis";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Le mot de passe doit contenir au moins une lettre majuscule";
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = "Le mot de passe doit contenir au moins une lettre minuscule";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
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

            await authService.signUp(formData);
            onUserAdded();
            onClose();
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            setApiError(
                error.response?.data?.error ||
                "Une erreur est survenue lors de la création de l'utilisateur"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Ajouter un utilisateur</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {apiError && (
                        <div className="form-error">{apiError}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <div className="field-error">{errors.email}</div>}
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
                        <label htmlFor="password">Mot de passe *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <div className="field-error">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Rôle</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value={Role.ADMIN}>Admin</option>
                            <option value={Role.SUPER_ADMIN}>Super Admin</option>
                        </select>
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
                            {loading ? 'Création en cours...' : 'Créer l\'utilisateur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;