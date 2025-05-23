import React, { useState } from 'react';
import './Modal.css';

const ConfirmModal = ({ title, message, confirmLabel, confirmClass, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error('Erreur lors de la confirmation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container confirm-modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <p className="confirm-message">{message}</p>
                </div>

                <div className="modal-actions">
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annuler
                    </button>
                    <button
                        className={`confirm-btn ${confirmClass || ''}`}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Traitement...' : confirmLabel || 'Confirmer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;