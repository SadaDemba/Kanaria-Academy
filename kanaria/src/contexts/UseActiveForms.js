import { useState, useEffect } from 'react';
import FormsService from '../services/FormsService';

/**
 * Hook personnalisé pour vérifier s'il existe des formulaires actifs
 * @returns {Object} - { loading, error, hasActiveForms, activeForms }
 */
const UseActiveForms = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeForms, setActiveForms] = useState([]);
    const formsService = new FormsService();

    useEffect(() => {
        const checkActiveForms = async () => {
            try {
                setLoading(true);
                const response = await formsService.getActiveForms();
                const now = new Date();
                const filteredForms = response.data.filter(form => {
                    // Vérifier si le formulaire est actif
                    if (!form.isActive) return false;

                    // Vérifier les dates de début et de fin si elles existent
                    const beginDate = form.beginDate ? new Date(form.beginDate) : null;
                    const endDate = form.endDate ? new Date(form.endDate) : null;

                    const afterBeginDate = !beginDate || now >= beginDate;

                    const beforeEndDate = !endDate || now <= endDate;

                    return afterBeginDate && beforeEndDate;
                });

                setActiveForms(filteredForms);
                setError(null);
            } catch (err) {
                console.error('Erreur lors de la vérification des formulaires actifs:', err);
                setError('Impossible de charger les formulaires actifs');
                setActiveForms([]);
            } finally {
                setLoading(false);
            }
        };

        checkActiveForms();
    }, []);

    return {
        loading,
        error,
        hasActiveForms: activeForms.length > 0,
        activeForms
    };
};

export default UseActiveForms;