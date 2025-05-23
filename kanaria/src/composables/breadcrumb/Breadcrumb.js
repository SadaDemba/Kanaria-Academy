import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Breadcrumb.css';
import { FaChevronRight, FaHome } from 'react-icons/fa';

/**
 * Composant Breadcrumb (fil d'Ariane) réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.items - Les éléments du breadcrumb (chemin)
 * @param {boolean} props.showHome - Afficher ou non l'élément Accueil au début
 * @param {string} props.homeUrl - URL de la page d'accueil
 * @param {string} props.className - Classes CSS additionnelles
 * @returns {JSX.Element} - Le composant Breadcrumb
 */
const Breadcrumb = ({ items, showHome = true, homeUrl = '/', className = '' }) => {
  return (
    <nav className={`breadcrumb-container ${className}`} aria-label="Fil d'Ariane">
      <ol className="breadcrumb-list">
        {showHome && (
          <li className="breadcrumb-item">
            <Link to={homeUrl} className="breadcrumb-link home-link">
              <FaHome className="breadcrumb-icon" />
              <span className="breadcrumb-text">Accueil</span>
            </Link>
            <FaChevronRight className="breadcrumb-separator" aria-hidden="true" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`breadcrumb-${index}`}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
            >
              {isLast ? (
                <span className="breadcrumb-current">{item.label}</span>
              ) : (
                <>
                  <Link to={item.url} className="breadcrumb-link">
                    {item.icon && (
                      <span className="breadcrumb-icon">{item.icon}</span>
                    )}
                    <span className="breadcrumb-text">{item.label}</span>
                  </Link>
                  <FaChevronRight className="breadcrumb-separator" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
      icon: PropTypes.element
    })
  ).isRequired,
  showHome: PropTypes.bool,
  homeUrl: PropTypes.string,
  className: PropTypes.string
};

export default Breadcrumb;