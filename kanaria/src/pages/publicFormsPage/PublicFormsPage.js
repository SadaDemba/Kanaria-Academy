// src/pages/publicForms/PublicFormsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FormsService from '../../services/FormsService';
import { FaClipboardList, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './PublicFormsPage.css';
import { formatLong } from '../../utils/DateUtils';
import { truncateText } from '../../utils/TextUtils';

const PublicFormsPage = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const formsService = new FormsService();

    useEffect(() => {
        const fetchActiveForms = async () => {
            try {
                setLoading(true);
                const response = await formsService.getActiveForms();

                // Filtrer les formulaires qui sont dans leur période d'activité
                const now = new Date();
                const activeFormsInTimeframe = response.data.filter(form => {
                    // Vérifier si le formulaire est actif
                    if (!form.isActive) return false;

                    // Vérifier les dates de début et de fin si elles existent
                    const beginDate = form.beginDate ? new Date(form.beginDate) : null;
                    const endDate = form.endDate ? new Date(form.endDate) : null;

                    // Si pas de date de début ou la date actuelle est après la date de début
                    const afterBeginDate = !beginDate || now >= beginDate;

                    // Si pas de date de fin ou la date actuelle est avant la date de fin
                    const beforeEndDate = !endDate || now <= endDate;

                    return afterBeginDate && beforeEndDate;
                });

                setForms(activeFormsInTimeframe);
                setError(null);
            } catch (err) {
                console.error('Erreur lors de la récupération des formulaires:', err);
                setError('Une erreur est survenue lors du chargement des formulaires. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        };

        fetchActiveForms();
    }, []);


    // Calculer la date limite (échéance) à afficher
    const getDeadlineInfo = (form) => {
        if (!form.endDate) return null;

        const now = new Date();
        const endDate = new Date(form.endDate);
        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return { text: 'Expire aujourd\'hui', urgent: true };
        if (diffDays === 1) return { text: 'Expire demain', urgent: true };
        if (diffDays <= 7) return { text: `Expire dans ${diffDays} jours`, urgent: true };

        return { text: `Expire le ${formatLong(form.endDate)}`, urgent: false };
    };

    return (
        <div className="public-forms-page">
            <div className="page-header">
                <h1>Formulaires disponibles</h1>
                <p className="header-description">
                    Tous les formulaires disponibles actuellement pour la communauté Kanaria.
                </p>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement des formulaires...</p>
                </div>
            ) : error ? (
                <div className="error-state">
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Réessayer
                    </button>
                </div>
            ) : forms.length === 0 ? (
                <div className="empty-state">
                    <FaClipboardList className="empty-icon" />
                    <h2>Aucun formulaire disponible</h2>
                    <p>Il n'y a actuellement aucun formulaire accessible.</p>
                </div>
            ) : (
                <div className="forms-grid">
                    {forms.map((form) => {
                        const deadlineInfo = getDeadlineInfo(form);

                        return (
                            <div key={form.id} className="form-card">
                                <div className="form-card-header">
                                    {/* Titre centré sur toute la largeur */}
                                    <h2 className="form-title">{form.title}</h2>

                                    {/* Badge d'expiration sur une ligne séparée, aligné à gauche */}
                                    {deadlineInfo && (
                                        <div className={`deadline-badge ${deadlineInfo.urgent ? 'urgent' : ''}`}>
                                            <FaClock /> {deadlineInfo.text}
                                        </div>
                                    )}
                                </div>

                                <div className="form-card-content">
                                    <p className="form-description">
                                        {truncateText(form.description) || 'Aucune description fournie.'}
                                    </p>

                                    <div className="form-metadata">
                                        {form.beginDate && (
                                            <div className="form-date">
                                                <FaCalendarAlt /> Début: {formatLong(form.beginDate)}
                                            </div>
                                        )}

                                        {form.endDate && (
                                            <div className="form-date">
                                                <FaCalendarAlt /> Fin: {formatLong(form.endDate)}
                                            </div>
                                        )}

                                        <div className="form-fields-count">
                                            <FaClipboardList /> {form.fields ? form.fields.length : 0} champs
                                        </div>
                                    </div>
                                </div>

                                <div className="form-card-footer">
                                    <Link to={`/forms/${form.id}`} className="btn btn-primary">
                                        Remplir le formulaire
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PublicFormsPage;