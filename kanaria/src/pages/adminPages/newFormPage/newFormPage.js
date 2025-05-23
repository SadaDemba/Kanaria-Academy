// src/pages/admin/newFormPage/newFormPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaInfoCircle } from 'react-icons/fa';
import FormsService from '../../../services/FormsService';
import Notification from '../../../composables/notification/Notification';
import Breadcrumb from '../../../composables/breadcrumb';
import ToggleSwitch from '../../../composables/toggleSwitch/ToggleSwitch';
import './newFormPage.css';

export default function NewFormPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isActive: true,
        beginDate: null,
        endDate: null
    });
    const [loading, setLoading] = useState(false);
    const [showInfoCard, setShowInfoCard] = useState(false);
    const navigate = useNavigate();
    const formsService = new FormsService();

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Gérer les changements de date
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value ? value : null
        });
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation de base
        if (!formData.title.trim()) {
            Notification.warning('Le titre du formulaire est obligatoire');
            return;
        }

        try {
            setLoading(true);
            const response = await formsService.createForm(formData);
            Notification.success('Formulaire créé avec succès');

            // Rediriger vers la page du formulaire pour ajouter les champs
            navigate(`/admin/form/${response.data.id}`);
        } catch (error) {
            console.error('Erreur lors de la création du formulaire:', error);
            Notification.error('Erreur lors de la création du formulaire');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler ? Les données non enregistrées seront perdues.')) {
            navigate('/admin/forms-list');
        }
    };

    const activeFormTooltip = "Un formulaire actif est visible et peut être rempli par les utilisateurs en fonction de la période remplissage. Un formulaire inactif est masqué du public.";

    return (
        <div className="new-form-container">
            <div className="new-form-header">
                <Breadcrumb
                    items={[
                        {
                            label: 'Formulaires',
                            url: '/admin/forms-list'
                        },
                        {
                            label: "Création d'un formulaire"
                        }
                    ]}
                    showHome={false}
                />

                <button
                    className="btn-info-card"
                    onClick={() => setShowInfoCard(!showInfoCard)}
                    aria-label="Afficher/masquer les informations"
                >
                    <FaInfoCircle />
                </button>
            </div>

            {showInfoCard && (
                <div className="info-card info-card-header">
                    <h3>Comment ça marche ?</h3>
                    <p>La création d'un formulaire se fait en deux étapes :</p>
                    <ol>
                        <li>
                            <strong>Étape 1 :</strong> Création du formulaire avec ses informations de base
                            (titre, description, dates, etc.)
                        </li>
                        <li>
                            <strong>Étape 2 :</strong> Ajout des champs du formulaire
                            (texte, email, cases à cocher, etc.)
                        </li>
                    </ol>
                    <p className="info-note">
                        Après la création de ce formulaire, vous serez redirigé vers la page
                        d'édition pour ajouter les champs nécessaires.
                    </p>
                </div>
            )}

            <div className="new-form-content">
                <form onSubmit={handleSubmit} className="form-creator">
                    <div className="form-group">
                        <label htmlFor="title">Titre du formulaire *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Entrez le titre du formulaire"
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Décrivez l'objectif de ce formulaire"
                            className="form-control"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <ToggleSwitch
                            checked={formData.isActive}
                            onChange={handleChange}
                            name="isActive"
                            label="Formulaire actif"
                            tooltip={activeFormTooltip}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="beginDate">Date de début (optionnelle)</label>
                            <input
                                type="datetime-local"
                                id="beginDate"
                                name="beginDate"
                                value={formData.beginDate || ''}
                                onChange={handleDateChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">Date de fin (optionnelle)</label>
                            <input
                                type="datetime-local"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate || ''}
                                onChange={handleDateChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <p className="note">* Champs obligatoires</p>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn btn-create"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span> Création en cours...
                                </>
                            ) : (
                                <>
                                    <FaSave /> Créer et continuer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}