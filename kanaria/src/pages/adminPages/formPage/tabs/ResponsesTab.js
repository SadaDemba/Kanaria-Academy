import React, { useState, useEffect } from 'react';
import {
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaEnvelope,
    FaEnvelopeOpen,
    FaChevronDown,
    FaChevronUp,
    FaCheckCircle,
    FaRegCircle,
    FaExchangeAlt
} from 'react-icons/fa';
import FormResponseService from '../../../../services/FormResponseService';
import Notification from '../../../../composables/notification/Notification';
import { getFieldLabel } from '../../../../utils/FieldTypesUtils';
import { Status } from '../../../../models/enums';
import { formatLong } from '../../../../utils/DateUtils';

const ResponsesTab = ({ formId, refreshStats }) => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [expandedResponses, setExpandedResponses] = useState({});

    // Instance du service de réponses
    const formResponseService = new FormResponseService();

    useEffect(() => {
        if (formId) {
            Promise.all([
                fetchResponses()
            ]);
        }
    }, [formId]);

    const fetchResponses = async () => {
        try {
            setLoading(true);
            const result = await formResponseService.getFormResponses(formId);
            let responseData = [];
            if (result && result.data) {
                responseData = result.data;
            } else {
                responseData = result || [];
            }

            setResponses(responseData);

            const firstUnreadResponse = responseData.find(r => r.status === Status.UNREAD);
            if (firstUnreadResponse) {
                setExpandedResponses({ [firstUnreadResponse.id]: true });
            }

            setError(null);
        } catch (err) {
            console.error("Erreur lors de la récupération des réponses:", err);
            setError('Erreur lors du chargement des réponses');
            Notification.error('Impossible de charger les réponses au formulaire');
        } finally {
            setLoading(false);
        }
    };

    // Filtrage et tri des réponses
    const filteredResponses = responses
        .filter(response => {
            // Filtre par recherche (email)
            const matchesSearch = response.email.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtre par statut
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'read' && response.status === Status.READ) ||
                (statusFilter === 'unread' && response.status === Status.UNREAD);

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            return 0;
        });

    const handleToggleReadStatus = async (responseId, isRead, event) => {
        if (event) {
            event.stopPropagation();
        }

        try {
            await formResponseService.toggleResponseReadStatus(responseId, isRead);

            // Mettre à jour localement
            setResponses(responses.map(response =>
                response.id === responseId ? { ...response, status: isRead ? Status.READ : Status.UNREAD } : response
            ));

            // Mettre à jour les statistiques
            if (refreshStats) {
                refreshStats();
            }

            Notification.success(`Réponse marquée comme ${isRead ? 'lue' : 'non lue'}`);
        } catch (err) {
            console.error("Erreur lors de la modification du statut de lecture:", err);
            Notification.error('Impossible de modifier le statut de lecture');
        }
    };

    const toggleResponseExpand = (responseId) => {
        setExpandedResponses(prev => ({
            ...prev,
            [responseId]: !prev[responseId]
        }));

        const response = responses.find(r => r.id === responseId);
        if (response && response.status === Status.UNREAD && !expandedResponses[responseId]) {
            handleToggleReadStatus(responseId, true);
        }
    };

    if (loading) {
        return (
            <div className="responses-loading">
                <div className="spinner"></div>
                <p>Chargement des réponses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="responses-error">
                <p>{error}</p>
                <button className="btn btn-primary" onClick={fetchResponses}>
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="responses-tab">


            <div className="filter-bar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher par email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">
                        <FaFilter /> Statut:
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tous</option>
                            <option value="read">Lus</option>
                            <option value="unread">Non lus</option>
                        </select>
                    </label>

                    <label className="filter-label">
                        <FaSortAmountDown /> Trier par:
                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Plus récents</option>
                            <option value="oldest">Plus anciens</option>
                        </select>
                    </label>
                </div>
            </div>

            {filteredResponses.length === 0 ? (
                <div className="empty-responses">
                    <p>Aucune réponse trouvée</p>
                </div>
            ) : (
                <div className="responses-list">
                    {filteredResponses.map((response) => (
                        <div
                            key={response.id}
                            className={`response-card ${response.status === Status.UNREAD ? 'unread' : ''}`}
                        >
                            <div
                                className="response-header"
                                onClick={() => toggleResponseExpand(response.id)}
                            >
                                <div className="response-header-left">
                                    {expandedResponses[response.id] ?
                                        <FaChevronUp className="expand-icon" /> :
                                        <FaChevronDown className="expand-icon" />
                                    }
                                    <div className="response-email">
                                        {response.status === Status.UNREAD ? (
                                            <FaEnvelope className="status-icon unread" />
                                        ) : (
                                            <FaEnvelopeOpen className="status-icon read" />
                                        )}
                                        {response.email}
                                    </div>
                                </div>

                                <div className="response-header-right">
                                    <div className="response-status-badge">
                                        {response.status === Status.UNREAD ? (
                                            <span className="status-badge unread">
                                                <FaRegCircle /> Non lu
                                            </span>
                                        ) : (
                                            <span className="status-badge read">
                                                <FaCheckCircle /> Lu
                                            </span>
                                        )}
                                    </div>
                                    <div className="response-date">
                                        {formatLong(response.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {expandedResponses[response.id] && (
                                <>
                                    <div className="response-content">
                                        {response.responses && response.responses.map((fieldResponse, index) => (
                                            <div key={index} className="response-field">
                                                <div className="field-label">
                                                    {fieldResponse.field.title}
                                                    <span className="field-type-badge">
                                                        {getFieldLabel(fieldResponse.field.type)}
                                                    </span>
                                                </div>
                                                <div className="field-value">
                                                    {fieldResponse.value || <span className="empty-value">Non renseigné</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="response-actions">
                                        <button
                                            className="btn btn-sm btn-toggle-status"
                                            onClick={(e) => handleToggleReadStatus(response.id, response.status === Status.UNREAD, e)}
                                        >
                                            <FaExchangeAlt /> Marquer comme {response.status === Status.UNREAD ? 'lu' : 'non lu'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResponsesTab;