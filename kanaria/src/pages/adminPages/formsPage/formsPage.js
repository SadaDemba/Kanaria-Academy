import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormsService from '../../../services/FormsService';
import Notification from '../../../composables/notification/Notification';
import './formsPage.css';

// Importation des icônes
import {
    FaPlus, FaSearch, FaChevronLeft,
    FaFileAlt, FaFilter, FaSortAmountDown,
    FaChevronRight, FaEllipsisV
} from 'react-icons/fa';
import { truncateText } from '../../../utils/TextUtils';

export default function FormsList() {
    // États
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [formsPerPage] = useState(10);
    const [activeMenu, setActiveMenu] = useState(null);
    const formsService = new FormsService();
    const navigate = useNavigate();

    useEffect(() => {
        function handleDocumentClick(event) {

            const isClickOutside = !event.target.closest('.dropdown-container');
            if (activeMenu !== null && isClickOutside) {
                setActiveMenu(null);
            }
        }
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [activeMenu]);

    useEffect(() => {
        fetchForms();
    }, []);

    // Fonction pour récupérer les formulaires
    const fetchForms = async () => {
        try {
            setLoading(true);
            const response = await formsService.getAllForms();
            console.log(response)
            setForms(response.data || []);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des formulaires');
            Notification.error('Impossible de charger les formulaires. Veuillez réessayer.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer un formulaire
    const handleDeleteForm = async (formId, event) => {
        event.stopPropagation(); // Empêcher la navigation vers la page de détails

        try {
            // Vérifier si le formulaire peut être supprimé
            const canDelete = await formsService.canModifyForm(formId);

            if (!canDelete) {
                Notification.warning('Ce formulaire ne peut pas être supprimé car il contient des réponses.');
                return;
            }

            // Confirmation utilisateur
            if (window.confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) {
                // Appel à une méthode à créer dans votre service
                // await formsService.deleteForm(formId);

                // Mise à jour de la liste après suppression
                setForms(forms.filter(form => form._id !== formId || form.id !== formId));
                Notification.success('Formulaire supprimé avec succès');
            }
        } catch (err) {
            Notification.error('Erreur lors de la suppression du formulaire');
            console.error(err);
        } finally {
            setActiveMenu(null);
        }
    };

    // Fonction pour modifier le statut d'un formulaire
    const handleToggleStatus = async (formId, currentStatus, event) => {
        event.stopPropagation(); // Empêcher la navigation vers la page de détails

        try {
            // Appel à une méthode à créer dans votre service
            // await formsService.updateFormStatus(formId, !currentStatus);

            // Mise à jour locale 
            setForms(forms.map(form => {
                if ((form._id === formId) || (form.id === formId)) {
                    return { ...form, active: !currentStatus };
                }
                return form;
            }));

            Notification.success(`Formulaire ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
        } catch (err) {
            Notification.error('Erreur lors de la modification du statut');
            console.error(err);
        } finally {
            setActiveMenu(null);
        }
    };

    // Ouvrir le menu des actions
    const toggleMenu = (formId, event) => {
        event.stopPropagation(); // Empêcher la navigation vers la page de détails
        setActiveMenu(activeMenu === formId ? null : formId);
    };

    const navigateToDetails = (formId, formObject) => {
        navigate(`/admin/form/${formId}`, { state: { form: formObject } });
    };

    const navigateToEdit = (formId, event) => {
        event.stopPropagation();
        navigate(`/admin/form/${formId}/edit`);
        setActiveMenu(null);
    };

    // Filtrage des formulaires
    const filteredForms = forms.filter(form => {
        // Filtre par terme de recherche
        const matchesSearch =
            form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre par statut
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && form.active) ||
            (statusFilter === 'inactive' && !form.active);

        return matchesSearch && matchesStatus;
    })
        .sort((a, b) => {
            // Tri
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'alphabetical') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

    // Pagination
    const indexOfLastForm = currentPage * formsPerPage;
    const indexOfFirstForm = indexOfLastForm - formsPerPage;
    const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
    const totalPages = Math.ceil(filteredForms.length / formsPerPage);

    // Changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Formatage de la date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="forms-dashboard">
            {/* En-tête du tableau de bord */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">Gestion des formulaires</h1>
                <div className="dashboard-actions">
                    <Link to="/admin/form/create" className="btn btn-primary">
                        <FaPlus /> Nouveau formulaire
                    </Link>
                </div>
            </div>

            {/* Barre de filtres et recherche */}
            <div className="filter-bar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher un formulaire..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">
                        <FaFilter /> Filtrer par statut
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="active">Actifs</option>
                            <option value="inactive">Inactifs</option>
                        </select>
                    </label>

                    <label className="filter-label">
                        <FaSortAmountDown /> Trier par
                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Plus récents</option>
                            <option value="oldest">Plus anciens</option>
                            <option value="alphabetical">Alphabétique</option>
                        </select>
                    </label>
                </div>
            </div>

            {/* Tableau des formulaires */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement des formulaires...</p>
                </div>
            ) : error ? (
                <div className="error-state">
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchForms}>
                        Réessayer
                    </button>
                </div>
            ) : currentForms.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FaFileAlt />
                    </div>
                    <h3 className="empty-state-text">
                        {filteredForms.length === 0 && forms.length > 0
                            ? "Aucun formulaire ne correspond à votre recherche"
                            : "Aucun formulaire disponible"}
                    </h3>
                    <Link to="/admin/form/create" className="btn btn-primary">
                        <FaPlus /> Créer votre premier formulaire
                    </Link>
                </div>
            ) : (
                <div className="forms-table-container">
                    <table className="forms-table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>Statut</th>
                                <th>Date de création</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentForms.map((form) => (
                                <tr
                                    key={form._id || form.id}
                                    onClick={() => navigateToDetails(form._id || form.id, form)}
                                    className="clickable-row"
                                >
                                    <td>{form.title}</td>
                                    <td>
                                        {form.description ?
                                            truncateText(form.description, 35)
                                            : 'Aucune description'}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${form.isActive ? 'status-active' : 'status-inactive'}`}>
                                            {form.isActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td>{formatDate(form.createdAt)}</td>
                                    <td className="actions-cell">
                                        <div className="dropdown-container">
                                            <button
                                                className="dropdown-toggle"
                                                onClick={(e) => toggleMenu(form._id || form.id, e)}
                                                aria-label="Actions"
                                            >
                                                <FaEllipsisV />
                                            </button>

                                            {activeMenu === (form._id || form.id) && (
                                                <div className="dropdown-menu">
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigateToDetails(form._id || form.id, form);
                                                        }}
                                                    >
                                                        Voir les détails
                                                    </button>

                                                    <button
                                                        className="dropdown-item"
                                                        onClick={(e) => navigateToEdit(form._id || form.id, e)}
                                                    >
                                                        Modifier
                                                    </button>

                                                    <button
                                                        className="dropdown-item"
                                                        onClick={(e) => handleToggleStatus(form._id || form.id, form.active, e)}
                                                    >
                                                        {form.active ? 'Désactiver' : 'Activer'}
                                                    </button>

                                                    <button
                                                        className="dropdown-item delete-item"
                                                        onClick={(e) => handleDeleteForm(form._id || form.id, e)}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredForms.length > formsPerPage && (
                <div className="pagination">
                    <div
                        className="page-item"
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    >
                        <FaChevronLeft />
                    </div>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(num =>
                            num === 1 ||
                            num === totalPages ||
                            (num >= currentPage - 1 && num <= currentPage + 1)
                        )
                        .map((number, index, array) => {
                            // Ajouter des points de suspension
                            if (index > 0 && array[index - 1] !== number - 1) {
                                return (
                                    <React.Fragment key={`ellipsis-${number}`}>
                                        <div className="page-item ellipsis">...</div>
                                        <div
                                            className={`page-item ${currentPage === number ? 'active' : ''}`}
                                            onClick={() => paginate(number)}
                                        >
                                            {number}
                                        </div>
                                    </React.Fragment>
                                );
                            }
                            return (
                                <div
                                    key={number}
                                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => paginate(number)}
                                >
                                    {number}
                                </div>
                            );
                        })}

                    <div
                        className="page-item"
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                    >
                        <FaChevronRight />
                    </div>
                </div>
            )}
        </div>
    );
}