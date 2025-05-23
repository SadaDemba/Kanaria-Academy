// src/pages/admin/formPage/formPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormsService from '../../../services/FormsService';
import FormResponseService from '../../../services/FormResponseService';
import Notification from '../../../composables/notification/Notification';
import Breadcrumb from '../../../composables/breadcrumb';
import TabSystem from '../../../composables/tabs/TabSystem';
import FormTab from './tabs/FormTab';
import ResponsesTab from './tabs/ResponsesTab';
import { FaClipboardCheck, FaComments } from 'react-icons/fa';
import './formpage.css';

export default function SingleForm() {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseStats, setResponseStats] = useState({ total: 0, read: 0, unread: 0 });
    const { id } = useParams();
    const navigate = useNavigate();
    const formsService = new FormsService();
    const formResponseService = new FormResponseService();

    useEffect(() => {
        if (id) {
            Promise.all([
                fetchFormDetails(),
                fetchResponseStats()
            ]).then();
        } else {
            // Si pas d'ID, création d'un nouveau formulaire
            setForm({
                title: 'Nouveau formulaire',
                description: '',
                active: true,
                fields: [],
                createdAt: new Date()
            });
            setLoading(false);
        }
    }, [id]);

    const fetchFormDetails = async () => {
        try {
            setLoading(true);
            const response = await formsService.getFormWithFields(id);
            setForm(response.data);
            setError(null);
            return true;
        } catch (err) {
            setError('Erreur lors du chargement du formulaire');
            Notification.error('Impossible de charger les détails du formulaire');
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchResponseStats = async () => {
        try {
            const result = await formResponseService.getFormResponsesStats(id);

            if (result && result.data) {
                setResponseStats(result.data);
            }
            return true;
        } catch (err) {
            console.error("Erreur lors du chargement des statistiques des réponses:", err);
            return false;
        }
    };

    // Retour à la liste
    const handleBack = () => {
        navigate('/admin/forms-list');
    };

    // Fonction pour rafraîchir les données du formulaire et des statistiques
    const refreshData = async () => {
        await Promise.all([
            fetchFormDetails(),
            fetchResponseStats()
        ]);
    };

    if (loading) {
        return (
            <div className="form-details-loading">
                <div className="spinner"></div>
                <p>Chargement du formulaire...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-details-error">
                <p>{error}</p>
                <button className="btn btn-primary" onClick={fetchFormDetails}>
                    Réessayer
                </button>
                <button className="btn btn-secondary" onClick={handleBack}>
                    Retour à la liste
                </button>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="form-details-error">
                <p>Formulaire non trouvé</p>
                <button className="btn btn-secondary" onClick={handleBack}>
                    Retour à la liste
                </button>
            </div>
        );
    }

    // Définir les onglets
    const tabs = [
        {
            label: 'Formulaire',
            icon: <FaClipboardCheck />,
            content: <FormTab form={form} refreshForm={refreshData} />
        },
        {
            label: 'Réponses',
            icon: <FaComments />,
            badge: responseStats.unread > 0 ? responseStats.unread : null,
            content: <ResponsesTab formId={id} refreshStats={fetchResponseStats} />
        }
    ];

    return (
        <div className="form-details-container">
            <div className="form-details-header">
                <Breadcrumb
                    items={[
                        {
                            label: 'Formulaires',
                            url: '/admin/forms-list'
                        },
                        {
                            label: form.title
                        }
                    ]}
                    showHome={false}
                />
                <div className="responses-header">
                    <div className="responses-summary">
                        <h3>Toutes les réponses ({responseStats.total})</h3>
                        <div className="responses-stats">
                            <div className="stat-item">
                                <span className="stat-label">Lues:</span>
                                <span className="stat-value read">{responseStats.read}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Non lues:</span>
                                <span className="stat-value unread">{responseStats.unread}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-details-content">
                <TabSystem tabs={tabs} />
            </div>
        </div>
    );
}