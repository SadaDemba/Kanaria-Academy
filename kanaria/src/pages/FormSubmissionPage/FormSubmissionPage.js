// src/pages/publicForms/FormSubmissionPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FormsService from '../../services/FormsService';
import FormResponseService from '../../services/FormResponseService';
import { FaArrowLeft, FaPaperPlane, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import './FormSubmissionPage.css';
import { formatLong } from '../../utils/DateUtils';
import Breadcrumb from '../../composables/breadcrumb';

const FormSubmissionPage = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState('');

    const formsService = new FormsService();
    const formResponseService = new FormResponseService();

    useEffect(() => {
        const fetchFormDetails = async () => {
            try {
                setLoading(true);
                const response = await formsService.getFormWithFields(formId);

                // Vérifier que le formulaire existe et est actif
                if (!response.data || !response.data.isActive) {
                    setError('Ce formulaire n\'est pas disponible ou n\'existe pas.');
                    setLoading(false);
                    return;
                }

                // Vérifier la période d'activité
                const now = new Date();
                const beginDate = response.data.beginDate ? new Date(response.data.beginDate) : null;
                const endDate = response.data.endDate ? new Date(response.data.endDate) : null;

                const afterBeginDate = !beginDate || now >= beginDate;
                const beforeEndDate = !endDate || now <= endDate;

                if (!afterBeginDate || !beforeEndDate) {
                    setError('Ce formulaire n\'est pas disponible en ce moment.');
                    setLoading(false);
                    return;
                }

                setForm(response.data);

                // Initialiser les valeurs du formulaire
                const initialFormData = {};
                response.data.fields.forEach(field => {
                    initialFormData[field.id] = '';
                });
                setFormData(initialFormData);

            } catch (err) {
                console.error('Erreur lors du chargement du formulaire:', err);
                setError('Une erreur est survenue lors du chargement du formulaire. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        };

        fetchFormDetails();
    }, [formId]);

    // Gérer les changements dans le formulaire
    const handleChange = (fieldId, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldId]: value
        }));

        // Effacer l'erreur de validation pour ce champ
        if (validationErrors[fieldId]) {
            setValidationErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    // Validation des champs
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Valider l'email
        if (!email.trim()) {
            errors.email = 'Veuillez entrer votre adresse email.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Veuillez entrer une adresse email valide.';
            isValid = false;
        }

        // Valider les champs
        form.fields.forEach(field => {
            const value = formData[field.id];

            // Champ obligatoire
            if (field.isRequired && (!value || value.trim() === '')) {
                errors[field.id] = 'Ce champ est obligatoire.';
                isValid = false;
                return;
            }

            // Validation spécifique au type de champ
            if (value) {
                switch (field.type) {
                    case 'EMAIL':
                        if (!/\S+@\S+\.\S+/.test(value)) {
                            errors[field.id] = 'Veuillez entrer une adresse email valide.';
                            isValid = false;
                        }
                        break;
                    case 'PHONE':
                        if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
                            errors[field.id] = 'Veuillez entrer un numéro de téléphone valide.';
                            isValid = false;
                        }
                        break;
                    case 'NUMBER':
                        if (isNaN(Number(value))) {
                            errors[field.id] = 'Veuillez entrer un nombre valide.';
                            isValid = false;
                        }
                        break;
                    default:
                        break;
                }

                // Validation de longueur
                if (field.minLength && value.length < field.minLength) {
                    errors[field.id] = `Ce champ doit contenir au moins ${field.minLength} caractères.`;
                    isValid = false;
                }

                if (field.maxLength && value.length > field.maxLength) {
                    errors[field.id] = `Ce champ ne doit pas dépasser ${field.maxLength} caractères.`;
                    isValid = false;
                }
            }
        });

        setValidationErrors(errors);
        return isValid;
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Faire défiler jusqu'à la première erreur
            const firstErrorField = document.querySelector('.field-error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        try {
            setSubmitting(true);

            const responseData = {
                formId: form.id,
                email: email,
                fieldResponses: Object.entries(formData).map(([fieldId, value]) => ({
                    fieldId,
                    value: String(value || '')
                }))
            };

            const response = await formResponseService.submitFormResponse(responseData);

            if (response.data && response.success) {
                setSuccess(true);
                // Réinitialiser le formulaire
                const initialFormData = {};
                form.fields.forEach(field => {
                    initialFormData[field.id] = '';
                });
                setFormData(initialFormData);
                setEmail('');

                // Faire défiler vers le haut pour voir le message de succès
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setError('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.');
            }
        } catch (err) {
            console.error('Erreur lors de la soumission du formulaire:', err);
            setError('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    // Rendu des champs de formulaire en fonction de leur type
    const renderField = (field) => {
        const value = formData[field.id] || '';
        const hasError = validationErrors[field.id];

        switch (field.type) {
            case 'TEXT':
                return (
                    <input
                        type="text"
                        id={`field-${field.id}`}
                        value={value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`form-control ${hasError ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder || ''}
                        maxLength={field.maxLength}
                    />
                );

            case 'TEXTAREA':
                return (
                    <textarea
                        id={`field-${field.id}`}
                        value={value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`form-control ${hasError ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder || ''}
                        rows="4"
                        maxLength={field.maxLength}
                    ></textarea>
                );

            case 'EMAIL':
                return (
                    <input
                        type="email"
                        id={`field-${field.id}`}
                        value={value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`form-control ${hasError ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder || 'exemple@email.com'}
                    />
                );

            case 'PHONE':
                return (
                    <input
                        type="tel"
                        id={`field-${field.id}`}
                        value={value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`form-control ${hasError ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder || ''}
                    />
                );

            case 'NUMBER':
                return (
                    <input
                        type="number"
                        id={`field-${field.id}`}
                        value={value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`form-control ${hasError ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder || ''}
                        min={field.min}
                        max={field.max}
                    />
                );

            case 'DATE':
                return (
                    <input
                        type="date"
                        id={`field-${field.id}`}
                        value={value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`form-control ${hasError ? 'is-invalid' : ''}`}
                    />
                );

            case 'CHECKBOX':
                return (
                    <div className="checkbox-group">
                        {field.options && field.options.map((option, index) => (
                            <div key={index} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`field-${field.id}-option-${index}`}
                                    checked={value.includes(option)}
                                    onChange={(e) => {
                                        const currentValues = value ? value.split(',') : [];
                                        let newValues;

                                        if (e.target.checked) {
                                            newValues = [...currentValues, option];
                                        } else {
                                            newValues = currentValues.filter(val => val !== option);
                                        }

                                        handleChange(field.id, newValues.join(','));
                                    }}
                                    className={hasError ? 'is-invalid' : ''}
                                />
                                <label htmlFor={`field-${field.id}-option-${index}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                );

            case 'RADIO':
                return (
                    <div className="radio-group">
                        {field.options && field.options.map((option, index) => (
                            <div key={index} className="radio-item">
                                <input
                                    type="radio"
                                    id={`field-${field.id}-option-${index}`}
                                    name={`field-${field.id}`}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className={hasError ? 'is-invalid' : ''}
                                />
                                <label htmlFor={`field-${field.id}-option-${index}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        id={`field-${field.id}`}
                        value={value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`form-control ${hasError ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder || ''}
                    />
                );
        }
    };

    // Si le formulaire est en chargement
    if (loading) {
        return (
            <div className="form-submission-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement du formulaire...</p>
                </div>
            </div>
        );
    }

    // Si une erreur s'est produite
    if (error) {
        return (
            <div className="form-submission-page">
                <div className="error-state">
                    <FaExclamationTriangle className="error-icon" />
                    <h2>Une erreur s'est produite</h2>
                    <p>{error}</p>
                    <div className="error-actions">
                        <Link to="/forms" className="btn btn-secondary">
                            <FaArrowLeft /> Retour aux formulaires
                        </Link>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si le formulaire a été soumis avec succès
    if (success) {
        return (
            <div className="form-submission-page">
                <div className="success-state">
                    <FaCheck className="success-icon" />
                    <h2>Formulaire envoyé avec succès !</h2>
                    <p>Merci d'avoir pris le temps de remplir ce formulaire.</p>
                    <div className="success-actions">
                        <Link to="/forms" className="btn btn-secondary">
                            <FaArrowLeft /> Retour aux formulaires
                        </Link>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSuccess(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            Remplir à nouveau
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si le formulaire est chargé
    return (
        <div className="form-submission-page">
            <div className="form-header">
                <Breadcrumb
                    items={[
                        {
                            label: 'Formulaires',
                            url: '/forms'
                        },
                        {
                            label: form.title
                        }
                    ]}
                    showHome={false}
                    className='back-link'
                />

                <h1 className="form-title">{form.title}</h1>

                {form.description && (
                    <p className="form-description">{form.description}</p>
                )}

                <div className="form-metadata">
                    {form.beginDate && (
                        <div className="form-date">
                            <span>Début:</span> {formatLong(form.beginDate)}
                        </div>
                    )}

                    {form.endDate && (
                        <div className="form-date">
                            <span>Fin:</span> {formatLong(form.endDate)}
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-submission-form">
                {/* Email de contact */}
                <div className={`form-field ${validationErrors.email ? 'field-error' : ''}`}>
                    <label htmlFor="contact-email" className="field-label">
                        Votre adresse email <span className="required">*</span>
                    </label>
                    <input
                        type="email"
                        id="contact-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                        placeholder="Entrez votre adresse email"
                        required
                    />
                    {validationErrors.email && (
                        <div className="error-message">{validationErrors.email}</div>
                    )}
                    <p className="field-help">
                        Nous utiliserons cette adresse pour vous contacter si nécessaire.
                    </p>
                </div>

                {/* Séparateur */}
                <div className="form-separator">
                    <span>Informations demandées</span>
                </div>

                {/* Champs du formulaire */}
                {form.fields && form.fields.map((field) => (
                    <div
                        key={field.id}
                        className={`form-field ${validationErrors[field.id] ? 'field-error' : ''}`}
                    >
                        <label htmlFor={`field-${field.id}`} className="field-label">
                            {field.title}
                            {field.isRequired && <span className="required">*</span>}
                        </label>

                        {field.description && (
                            <p className="field-description">{field.description}</p>
                        )}

                        {renderField(field)}

                        {validationErrors[field.id] && (
                            <div className="error-message">{validationErrors[field.id]}</div>
                        )}
                    </div>
                ))}

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/forms')}
                        disabled={submitting}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <div className="spinner-small"></div> Envoi en cours...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane /> Envoyer
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormSubmissionPage;