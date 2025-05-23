import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShopService from '../../services/ShopService';
import { FaPhone, FaSearch } from 'react-icons/fa';
import './ShopPage.css';
import {ENV} from "../../services/config/env";

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    const shopService = new ShopService();

    // Numéro de téléphone pour les commandes
    const contactPhone = ENV.PHONE_NUMBER;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Charger les catégories
                const categoriesResponse = await shopService.getAllCategories();
                setCategories(categoriesResponse.data);

                // Charger les produits
                const params = {};
                if (categoryId) params.categoryId = categoryId;
                if (searchTerm) params.search = searchTerm;

                const productsResponse = await shopService.getAllProducts(params);
                setProducts(productsResponse.data);

                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement des données:', err);
                setError('Une erreur est survenue lors du chargement de la boutique.');
                setLoading(false);
            }
        };

        loadData();
    }, [categoryId, searchTerm]);

    const handleCategoryClick = (id) => {
        navigate(`/shop${id ? `?category=${id}` : ''}`);
    };

    const handleProductClick = (id) => {
        navigate(`/shop/product/${id}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // La recherche est déjà gérée par l'useEffect
    };

    // Fonction helper pour obtenir l'URL d'image correcte
    const getImageUrl = (imageUrl) => {
        return shopService.getDisplayImageUrl(imageUrl);
    };

    return (
        <div className="shop-page">
            <div className="shop-header">
                <h1>Notre Boutique</h1>
                <p className="shop-description">
                    Découvrez notre sélection d'articles pour les passionnés de gaming.
                </p>

                <form className="shop-search-form" onSubmit={handleSearch}>
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
            </div>

            <div className="shop-container">
                <div className="shop-sidebar">
                    <h2>Catégories</h2>
                    <ul className="category-list">
                        <li
                            className={!categoryId ? 'active' : ''}
                            onClick={() => handleCategoryClick(null)}
                        >
                            Tous les produits
                        </li>
                        {categories.map(category => (
                            <li
                                key={category.id}
                                className={categoryId === category.id ? 'active' : ''}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {category.name}
                                <span className="product-count">{category._count.products}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="shop-content">
                    {loading ? (
                        <div className="loading-spinner">Chargement des produits...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <>
                            <div className="products-header">
                                <h2>
                                    {categoryId
                                        ? categories.find(c => c.id === categoryId)?.name || 'Produits'
                                        : 'Tous les produits'}
                                </h2>
                                <span className="product-count">{products.length} produits</span>
                            </div>

                            {products.length === 0 ? (
                                <div className="no-products">
                                    <p>Aucun produit trouvé.</p>
                                </div>
                            ) : (
                                <div className="products-grid">
                                    {products.map(product => (
                                        <div
                                            key={product.id}
                                            className="product-card"
                                            onClick={() => handleProductClick(product.id)}
                                        >
                                            <div className="product-image">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={getImageUrl(product.images[0].imageUrl)}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/placeholder-image.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="no-image">Pas d'image</div>
                                                )}
                                            </div>
                                            <div className="product-info">
                                                <h3 className="product-name">{product.name}</h3>
                                                <p className="product-category">{product.category.name}</p>
                                                <p className="product-price">{product.price.toFixed(2)} €</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="shop-contact-banner">
                <div className="contact-info">
                    <h3>Pour commander un produit</h3>
                    <p>Appelez-nous directement</p>
                    <a href={`tel:${contactPhone}`} className="phone-link">
                        <FaPhone /> {contactPhone}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;