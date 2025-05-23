// src/composables/toggleSwitch/ToggleSwitch.js
import React from 'react';
import PropTypes from 'prop-types';
import './ToggleSwitch.css';
import { FaInfoCircle } from 'react-icons/fa';

/**
 * Composant ToggleSwitch réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.checked - État du toggle (activé/désactivé)
 * @param {function} props.onChange - Fonction appelée lors du changement d'état
 * @param {string} props.label - Texte du label (optionnel)
 * @param {string} props.name - Nom du champ pour les formulaires
 * @param {string} props.tooltip - Texte d'info-bulle (optionnel)
 * @returns {JSX.Element} - Le composant ToggleSwitch
 */
const ToggleSwitch = ({
    checked,
    onChange,
    label,
    name,
    tooltip,
    disabled = false
}) => {
    return (
        <div className="toggle-switch-container">
            <label className="toggle-switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    name={name}
                    disabled={disabled}
                />
                <span className="slider round"></span>
            </label>

            {label && (
                <div className="toggle-label">
                    <span>{label}</span>

                    {tooltip && (
                        <div className="tooltip-container">
                            <FaInfoCircle className="info-icon" />
                            <div className="tooltip-content">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ToggleSwitch.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool
};

export default ToggleSwitch;