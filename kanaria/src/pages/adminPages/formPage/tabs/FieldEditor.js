import React, { useState, useEffect } from 'react';
import {
    FaSave,
    FaTimes,
    FaPlus,
    FaArrowUp,
    FaArrowDown,
    FaTrash,
    FaChevronDown,
    FaChevronUp,
    FaExclamationTriangle
} from 'react-icons/fa';
import FormsService from '../../../../services/FormsService';
import Notification from '../../../../composables/notification/Notification';
import ToggleSwitch from '../../../../composables/toggleSwitch/ToggleSwitch';
import { getFieldLabel, FIELD_TYPES } from '../../../../utils/FieldTypesUtils';

// Modèle pour un nouveau champ
const createNewField = (order) => ({
    title: '',
    description: '',
    type: 'TEXT',
    isRequired: false,
    minLength: null,
    maxLength: null,
    options: [],
    order: order
});

const FieldEditor = ({ formId, initialFields = [], onCancel, onSave }) => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedFieldIndex, setExpandedFieldIndex] = useState(null);
    const formsService = new FormsService();

    useEffect(() => {
        // Initialiser les champs avec les champs existants ou en créer un s'il n'y en a pas
        if (initialFields && initialFields.length > 0) {
            setFields(initialFields.map(field => ({
                ...field,
                options: Array.isArray(field.options) ? field.options : []
            })));
        } else {
            // Créer un champ vide par défaut si aucun champ n'existe
            setFields([createNewField(0)]);
            setExpandedFieldIndex(0);
        }
    }, [initialFields]);

    // Ajouter un nouveau champ
    const handleAddField = () => {
        const newField = createNewField(fields.length);
        setFields([...fields, newField]);
        setExpandedFieldIndex(fields.length);
    };

    // Supprimer un champ
    const handleDeleteField = (index) => {
        if (fields.length === 1) {
            Notification.warning('Vous devez avoir au moins un champ.');
            return;
        }

        const updatedFields = [...fields];
        updatedFields.splice(index, 1);

        // Mettre à jour l'ordre des champs
        const reorderedFields = updatedFields.map((field, idx) => ({
            ...field,
            order: idx
        }));

        setFields(reorderedFields);

        // Ajuster l'index du champ développé si nécessaire
        if (expandedFieldIndex === index) {
            setExpandedFieldIndex(null);
        } else if (expandedFieldIndex > index) {
            setExpandedFieldIndex(expandedFieldIndex - 1);
        }
    };

    // Déplacer un champ vers le haut
    const handleMoveUp = (index) => {
        if (index === 0) return;

        const updatedFields = [...fields];
        [updatedFields[index - 1], updatedFields[index]] = [updatedFields[index], updatedFields[index - 1]];

        // Mettre à jour l'ordre
        const reorderedFields = updatedFields.map((field, idx) => ({
            ...field,
            order: idx
        }));

        setFields(reorderedFields);

        // Ajuster l'index du champ développé si nécessaire
        if (expandedFieldIndex === index) {
            setExpandedFieldIndex(index - 1);
        } else if (expandedFieldIndex === index - 1) {
            setExpandedFieldIndex(index);
        }
    };

    // Déplacer un champ vers le bas
    const handleMoveDown = (index) => {
        if (index === fields.length - 1) return;

        const updatedFields = [...fields];
        [updatedFields[index], updatedFields[index + 1]] = [updatedFields[index + 1], updatedFields[index]];

        // Mettre à jour l'ordre
        const reorderedFields = updatedFields.map((field, idx) => ({
            ...field,
            order: idx
        }));

        setFields(reorderedFields);

        // Ajuster l'index du champ développé si nécessaire
        if (expandedFieldIndex === index) {
            setExpandedFieldIndex(index + 1);
        } else if (expandedFieldIndex === index + 1) {
            setExpandedFieldIndex(index);
        }
    };

    // Mettre à jour un champ
    const handleFieldChange = (index, name, value) => {
        const updatedFields = [...fields];
        updatedFields[index] = {
            ...updatedFields[index],
            [name]: value
        };
        setFields(updatedFields);
    };

    // Ajouter une option à un champ de type RADIO ou CHECKBOX
    const handleAddOption = (fieldIndex) => {
        const updatedFields = [...fields];
        if (!Array.isArray(updatedFields[fieldIndex].options)) {
            updatedFields[fieldIndex].options = [];
        }
        updatedFields[fieldIndex].options.push('');
        setFields(updatedFields);
    };

    // Mettre à jour une option
    const handleOptionChange = (fieldIndex, optionIndex, value) => {
        const updatedFields = [...fields];
        updatedFields[fieldIndex].options[optionIndex] = value;
        setFields(updatedFields);
    };

    // Supprimer une option
    const handleDeleteOption = (fieldIndex, optionIndex) => {
        const updatedFields = [...fields];
        updatedFields[fieldIndex].options.splice(optionIndex, 1);
        setFields(updatedFields);
    };

    // Enregistrer les champs
    const handleSaveFields = async () => {
        // Validation des champs
        let isValid = true;
        let errorMessage = '';

        fields.forEach((field, index) => {
            if (!field.title.trim()) {
                isValid = false;
                errorMessage = `Le champ #${index + 1} doit avoir un titre.`;
                return;
            }

            // Validation des options pour les champs RADIO et CHECKBOX
            if (['RADIO', 'CHECKBOX'].includes(field.type)) {
                if (!field.options || field.options.length < 2) {
                    isValid = false;
                    errorMessage = `Le champ "${field.title}" doit avoir au moins 2 option.`;
                    return;
                }

                // Vérifier que toutes les options ont un texte
                field.options.forEach((option, optIndex) => {
                    if (!option.trim()) {
                        isValid = false;
                        errorMessage = `L'option #${optIndex + 1} du champ "${field.title}" ne peut pas être vide.`;
                        return;
                    }
                });
            }
        });

        if (!isValid) {
            Notification.warning(errorMessage);
            return;
        }

        try {
            setLoading(true);

            const fieldsToSave = fields.map((field, index) => ({
                ...field,
                order: index,
                // S'assurer que les champs qui n'utilisent pas d'options ont un tableau vide
                options: ['RADIO', 'CHECKBOX'].includes(field.type) ? field.options : []
            }));

            const response = await formsService.replaceFormFields(formId, fieldsToSave);
            console.log(response)

            if (response.success) {
                Notification.success(response.message);
                if (onSave) {
                    onSave();
                }
            } else {
                Notification.error(response.message);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des champs:', error);
            Notification.error('Erreur lors de la mise à jour des champs');
        } finally {
            setLoading(false);
        }
    };

    // Gérer l'expansion d'un champ
    const handleToggleExpand = (index) => {
        setExpandedFieldIndex(expandedFieldIndex === index ? null : index);
    };

    return (
        <div className="field-editor-container">
            <div className="field-editor-toolbar">
                <div className="editor-info">
                    <p>Vous pouvez ajouter, supprimer ou réorganiser les champs de votre formulaire.</p>
                </div>
            </div>

            <div className="field-list">
                {fields.map((field, index) => (
                    <div key={index} className="field-editor-item">
                        <div
                            className="field-editor-header"
                            onClick={() => handleToggleExpand(index)}
                        >
                            <div className="field-editor-title">
                                {expandedFieldIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                {field.title || `Champ #${index + 1}`}
                                {field.isRequired && <span className="field-required-indicator">*</span>}
                                <span className="field-editor-type">
                                    {getFieldLabel(field.type)}
                                </span>
                            </div>
                            <div className="field-editor-actions">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveUp(index);
                                    }}
                                    disabled={index === 0}
                                    title="Déplacer vers le haut"
                                >
                                    <FaArrowUp />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveDown(index);
                                    }}
                                    disabled={index === fields.length - 1}
                                    title="Déplacer vers le bas"
                                >
                                    <FaArrowDown />
                                </button>
                                <button
                                    type="button"
                                    className="btn-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteField(index);
                                    }}
                                    title="Supprimer"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        {expandedFieldIndex === index && (
                            <div className="field-editor-content">
                                <div className="form-group">
                                    <label htmlFor={`field-${index}-title`}>Titre du champ *</label>
                                    <input
                                        type="text"
                                        id={`field-${index}-title`}
                                        value={field.title}
                                        onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                        className="form-control"
                                        placeholder="Entrez le titre du champ"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`field-${index}-type`}>Type de champ</label>
                                    <select
                                        id={`field-${index}-type`}
                                        value={field.type}
                                        onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                                        className="form-control"
                                    >
                                        {FIELD_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`field-${index}-description`}>Description (optionnelle)</label>
                                    <textarea
                                        id={`field-${index}-description`}
                                        value={field.description || ''}
                                        onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                        className="form-control"
                                        placeholder="Entrez une description ou des instructions pour ce champ"
                                        rows="2"
                                    />
                                </div>

                                <div className="form-group">
                                    <ToggleSwitch
                                        checked={field.isRequired}
                                        onChange={(e) => handleFieldChange(index, 'isRequired', e.target.checked)}
                                        name={`field-${index}-isRequired`}
                                        label="Champ obligatoire"
                                    />
                                </div>

                                {['TEXT', 'TEXTAREA', 'EMAIL', 'PHONE'].includes(field.type) && (
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor={`field-${index}-minLength`}>Longueur minimale</label>
                                            <input
                                                type="number"
                                                id={`field-${index}-minLength`}
                                                value={field.minLength || ''}
                                                onChange={(e) => handleFieldChange(index, 'minLength', e.target.value ? parseInt(e.target.value) : null)}
                                                className="form-control"
                                                min="0"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`field-${index}-maxLength`}>Longueur maximale</label>
                                            <input
                                                type="number"
                                                id={`field-${index}-maxLength`}
                                                value={field.maxLength || ''}
                                                onChange={(e) => handleFieldChange(index, 'maxLength', e.target.value ? parseInt(e.target.value) : null)}
                                                className="form-control"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                )}

                                {['RADIO', 'CHECKBOX'].includes(field.type) && (
                                    <div className="field-editor-options">
                                        <div className="options-header">
                                            <label>Options</label>
                                        </div>

                                        {field.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="option-item">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                    className="form-control"
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                />
                                                <div className="option-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteOption(index, optionIndex)}
                                                        className="btn-icon"
                                                        title="Supprimer cette option"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => handleAddOption(index)}
                                            className="add-option-btn"
                                        >
                                            <FaPlus /> Ajouter une option
                                        </button>

                                        {(!field.options || field.options.length === 0) && (
                                            <div className="warning-message option-warning">
                                                <FaExclamationTriangle />
                                                <span>Vous devez ajouter au moins une option.</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="add-field-btn"
                onClick={handleAddField}
            >
                <FaPlus /> Ajouter un champ
            </button>

            <div className="field-editor-bottom-actions">
                <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={onCancel}
                    disabled={loading}
                >
                    <FaTimes /> Annuler
                </button>
                <button
                    type="button"
                    className="btn btn-save"
                    onClick={handleSaveFields}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-small"></span> Enregistrement...
                        </>
                    ) : (
                        <>
                            <FaSave /> Enregistrer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FieldEditor;