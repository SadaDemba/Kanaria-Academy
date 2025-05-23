import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import ShopService from '../../../services/ShopService';
import './ProductsManagementPage.css';
import AddEditProductModal from '../../../components/shopPageModals/AddEditProductModal';
import DeleteProductModal from '../../../components/shopPageModals/DeleteProductModal';

const ProductsManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const shopService = new ShopService();

    // Charger les données
    const loadData = async () => {
        try {
            setLoading(true);

            // Charger les catégories
            const categoriesResponse = await shopService.getAllCategories();
            setCategories(categoriesResponse.data);
            const params = {};
            if (categoryFilter) params.categoryId = categoryFilter;
            if (searchTerm) params.search = searchTerm;

            const productsResponse = await shopService.getAllProducts(params);
            setProducts(productsResponse.data);

            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
            setError('Une erreur est survenue lors du chargement des données.');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData().then();
    }, [categoryFilter, searchTerm]);

    const handleAddProduct = () => {
        setIsEditing(false);
        setSelectedProduct(null);
        setShowAddEditModal(true);
    };

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setSelectedProduct(product);
        setShowAddEditModal(true);
    };

    const handleViewProduct = (productId) => {
        window.open(`/shop/product/${productId}`, '_blank');
    };

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // La recherche est déjà gérée par l'effet
    };

    // Actions après les opérations
    const handleProductSaved = () => {
        setShowAddEditModal(false);
        loadData();
    };

    const handleProductDeleted = () => {
        setShowDeleteModal(false);
        loadData();
    };

    const getImageUrl = (imageUrl) => {
        return shopService.getDisplayImageUrl(imageUrl);
    };

    return (
        <div className="products-management-page">
            <div className="management-header">
                <h1>Gestion des produits</h1>
                <button
                    className="add-button"
                    onClick={handleAddProduct}
                >
                    <FaPlus /> Ajouter un produit
                </button>
            </div>

            <div className="filters-container">
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-input-container">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <FaSearch />
                        </button>
                    </div>
                </form>

                <div className="category-filter">
                    <label htmlFor="category-select">Catégorie:</label>
                    <select
                        id="category-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="category-select"
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="error-message">{error}</div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement des produits...</p>
                </div>
            ) : (
                <div className="products-table-container">
                    {products.length === 0 ? (
                        <div className="no-products">
                            <p>Aucun produit trouvé.</p>
                            <button
                                className="add-first-product"
                                onClick={handleAddProduct}
                            >
                                Ajouter votre premier produit
                            </button>
                        </div>
                    ) : (
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th className="image-column">Image</th>
                                    <th>Nom</th>
                                    <th>Catégorie</th>
                                    <th>Prix</th>
                                    <th>Stock</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} >
                                        <td className="image-column">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={getImageUrl(product.images[0].imageUrl)}
                                                    alt={product.name}
                                                    className="product-thumbnail"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-image.png'; // Image placeholder en cas d'erreur
                                                    }}
                                                />
                                            ) : (
                                                <div className="no-thumbnail">Pas d'image</div>
                                            )}
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category.name}</td>
                                        <td>{product.price.toFixed(2)} €</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                                                {product.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="action-col">
                                            <button
                                                className="action-btn view-btn"
                                                onClick={() => handleViewProduct(product.id)}
                                                title="Voir le produit"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditProduct(product)}
                                                title="Modifier le produit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="action-btn del-btn"
                                                onClick={() => handleDeleteProduct(product)}
                                                title="Supprimer le produit"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Modales */}
            {showAddEditModal && (
                <AddEditProductModal
                    isEditing={isEditing}
                    product={selectedProduct}
                    categories={categories}
                    onClose={() => setShowAddEditModal(false)}
                    onSave={handleProductSaved}
                />
            )}

            {showDeleteModal && selectedProduct && (
                <DeleteProductModal
                    product={selectedProduct}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleProductDeleted}
                />
            )}
        </div>
    );
};

export default ProductsManagementPage;