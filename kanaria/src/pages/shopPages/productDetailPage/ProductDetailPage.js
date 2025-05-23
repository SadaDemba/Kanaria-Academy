import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ShopService from '../../../services/ShopService';
import { FaPhone, FaShareAlt, FaArrowLeft } from 'react-icons/fa';
import './ProductDetailPage.css';
import { useAuth } from '../../../contexts';
import Breadcrumb from "../../../composables/breadcrumb";
import {ENV} from "../../../services/config/env";


const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // Numéro de téléphone pour les commandes
    const contactPhone = ENV.PHONE_NUMBER

    const shopService = new ShopService();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const response = await shopService.getProductById(id);

                setProduct(response.data);

                // Définir l'image principale
                if (response.data.images && response.data.images.length > 0) {
                    // Chercher d'abord une image principale
                    const primary = response.data.images.find(img => img.isPrimary);
                    setMainImage(primary || response.data.images[0]);
                }

                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement du produit:', err);
                setError('Une erreur est survenue lors du chargement du produit.');
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Découvrez ${product.name} sur notre boutique`,
                url: window.location.href,
            })
                .catch(err => console.error('Erreur lors du partage:', err));
        } else {
            // Fallback: copier l'URL dans le presse-papier
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    alert('Lien copié dans le presse-papier !');
                })
                .catch(err => {
                    console.error('Impossible de copier le lien:', err);
                });
        }
    };

    // Fonction helper pour obtenir l'URL d'image correcte
    const getImageUrl = (imageUrl) => {
        return shopService.getDisplayImageUrl(imageUrl);
    };

    if (loading) {
        return (
            <div className="product-detail-page loading">
                <div className="loading-spinner">Chargement du produit...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail-page error">
                <div className="error-message">{error}</div>
                <Link to="/shop" className="back-link">
                    <FaArrowLeft /> Retour à la boutique
                </Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page error">
                <div className="error-message">Produit non trouvé.</div>
                <Link to="/shop" className="back-link">
                    <FaArrowLeft /> Retour à la boutique
                </Link>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <Breadcrumb
                items={[
                    {
                        label: "Boutique",
                        url: "/shop"
                    },
                    {
                        label: product.category.name,
                        url: `/shop?category=${product.category.id}`
                    },
                    {
                        label: product.name
                    }
                ]}
                showHome={false}
            />

            <div className="product-container">
                <div className="product-gallery">
                    <div className="main-image">
                        {mainImage ? (
                            <img
                                src={getImageUrl(mainImage.imageUrl)}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.png';
                                }}
                            />
                        ) : (
                            <div className="no-image">Pas d'image disponible</div>
                        )}
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="image-thumbnails">
                            {product.images.map(image => (
                                <div
                                    key={image.id}
                                    className={`thumbnail ${mainImage && mainImage.id === image.id ? 'active' : ''}`}
                                    onClick={() => handleImageClick(image)}
                                >
                                    <img
                                        src={getImageUrl(image.imageUrl)}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-image.png';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h1 className="product-name">{product.name}</h1>

                    <div className="product-meta">
                        <span className="product-category">Catégorie: {product.category.name}</span>
                        <span className="product-code">Code produit: {product.id.substring(0, 8).toUpperCase()}</span>
                    </div>

                    <div className="product-price">{product.price.toFixed(2)} €</div>

                    <div className="product-availability">
                        {product.stock > 0 ? (
                            <span className="in-stock">En stock</span>
                        ) : (
                            <span className="out-of-stock">Rupture de stock</span>
                        )}
                    </div>

                    <div className="product-description">
                        <h2>Description</h2>
                        <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                    </div>

                    <div className="product-actions">
                        <a href={`tel:${contactPhone}`} className="call-to-order">
                            <FaPhone /> Commander par téléphone
                        </a>

                        <button className="share-button" onClick={handleShare}>
                            <FaShareAlt /> Partager
                        </button>
                    </div>

                    <div className="contact-info">
                        <p>Pour commander ce produit, appelez-nous au:</p>
                        <a href={`tel:${contactPhone}`} className="phone-number">
                            <FaPhone /> {contactPhone}
                        </a>
                        <p className="phone-info">Du lundi au vendredi, de 9h à 18h</p>
                    </div>
                </div>
            </div>

            <div className="back-section">
                <Link to={currentUser ? "/admin/shop/products" : "/shop"} className="back-button">
                    <FaArrowLeft /> Retour à la boutique
                </Link>
            </div>
        </div>
    );
};

export default ProductDetailPage;