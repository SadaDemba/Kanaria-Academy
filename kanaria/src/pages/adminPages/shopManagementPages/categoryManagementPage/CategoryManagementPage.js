import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ShopService from '../../../../services/ShopService';
import './CategoriesManagementPage.css';

// Modales
import CategoryModal from '../../../../components/shopPageModals/CategoryModal';
import DeleteCategoryModal from '../../../../components/shopPageModals/DeleteCategoryModal';

const CategoriesManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // États pour les modales
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const shopService = new ShopService();

    // Charger les catégories
    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await shopService.getAllCategories();
            setCategories(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des catégories:', err);
            setError('Une erreur est survenue lors du chargement des catégories.');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Gestion des modales
    const handleAddCategory = () => {
        setIsEditing(false);
        setSelectedCategory(null);
        setShowAddEditModal(true);
    };

    const handleEditCategory = (category) => {
        setIsEditing(true);
        setSelectedCategory(category);
        setShowAddEditModal(true);
    };

    const handleDeleteCategory = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    // Actions après les opérations
    const handleCategorySaved = () => {
        setShowAddEditModal(false);
        loadCategories();
    };

    const handleCategoryDeleted = () => {
        setShowDeleteModal(false);
        loadCategories();
    };

    return (
        <div className="categories-management-page">
            <div className="management-header">
                <h1>Gestion des catégories</h1>
                <button
                    className="add-button"
                    onClick={handleAddCategory}
                >
                    <FaPlus /> Ajouter une catégorie
                </button>
            </div>

            {error && (
                <div className="error-message">{error}</div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement des catégories...</p>
                </div>
            ) : (
                <div className="categories-container">
                    {categories.length === 0 ? (
                        <div className="no-categories">
                            <p>Aucune catégorie trouvée.</p>
                            <button
                                className="add-first-category"
                                onClick={handleAddCategory}
                            >
                                Ajouter votre première catégorie
                            </button>
                        </div>
                    ) : (
                        <div className="categories-grid">
                            {categories.map(category => (
                                <div key={category.id} className="category-card">
                                    <div className="category-info">
                                        <h2 className="category-name">{category.name}</h2>
                                        <p className="product-count">
                                            {category._count.products} produit{category._count.products !== 1 ? 's' : ''}
                                        </p>
                                        {category.description && (
                                            <p className="category-description">{category.description}</p>
                                        )}
                                    </div>
                                    <div className="category-actions">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => handleEditCategory(category)}
                                            title="Modifier la catégorie"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="action-btn del-btn"
                                            onClick={() => handleDeleteCategory(category)}
                                            title="Supprimer la catégorie"
                                            disabled={category._count.products > 0}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modales */}
            {showAddEditModal && (
                <CategoryModal
                    isEditing={isEditing}
                    category={selectedCategory}
                    onClose={() => setShowAddEditModal(false)}
                    onSave={handleCategorySaved}
                />
            )}

            {showDeleteModal && selectedCategory && (
                <DeleteCategoryModal
                    category={selectedCategory}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleCategoryDeleted}
                />
            )}
        </div>
    );
};

export default CategoriesManagementPage;