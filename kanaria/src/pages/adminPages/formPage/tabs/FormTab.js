import React, { useState, useEffect } from 'react';
import { FaEdit, FaClipboardList, FaCalendarAlt, FaSave, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import FormsService from '../../../../services/FormsService';
import Notification from '../../../../composables/notification/Notification';
import ToggleSwitch from '../../../../composables/toggleSwitch/ToggleSwitch';
import { getFieldLabel } from '../../../../utils/FieldTypesUtils';
import FieldEditor from './FieldEditor';
import { truncateText } from '../../../../utils/TextUtils';

const FormTab = ({ form: initialForm, refreshForm }) => {
    const [form, setForm] = useState(initialForm);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingFields, setIsEditingFields] = useState(false);
    const [editedForm, setEditedForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [showInfoPopup, setShowInfoPopup] = useState(false);

    const formsService = new FormsService();

    // Mettre à jour l'état local lorsque le formulaire initial change
    useEffect(() => {
        setForm(initialForm);
    }, [initialForm]);

    // Démarrer l'édition des informations générales
    const handleStartInfoEdit = () => {
        if (!form.canModify) {
            Notification.warning('Ce formulaire ne peut pas être modifié car il contient déjà des réponses.');
            return;
        }

        setEditedForm({
            title: form.title,
            description: form.description || '',
            isActive: form.isActive,
            beginDate: form.beginDate ? new Date(form.beginDate).toISOString().substring(0, 16) : null,
            endDate: form.endDate ? new Date(form.endDate).toISOString().substring(0, 16) : null
        });
        setIsEditingInfo(true);
    };

    const handleStartFieldsEdit = () => {
        if (!form.canModify) {
            Notification.warning('Ce formulaire ne peut pas être modifié car il contient déjà des réponses.');
            return;
        }

        setIsEditingFields(true);
    };

    // Gérer les changements dans le formulaire d'édition
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedForm({
            ...editedForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Gérer les changements de date
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setEditedForm({
            ...editedForm,
            [name]: value || null
        });
    };

    // Annuler l'édition
    const handleCancelEdit = () => {
        setIsEditingInfo(false);
        setEditedForm({});
    };

    // Sauvegarder les informations modifiées
    const handleSaveInfo = async () => {
        try {
            setLoading(true);

            // Vérification de base
            if (!editedForm.title.trim()) {
                Notification.warning('Le titre du formulaire est obligatoire');
                setLoading(false);
                return;
            }

            const response = await formsService.updateFormInfo(form.id, editedForm);

            if (response.data && response.success) {
                Notification.success('Informations du formulaire mises à jour avec succès');
                setIsEditingInfo(false);

                // Mettre à jour l'état local et appeler refreshForm si fourni
                setForm({
                    ...form,
                    ...response.data
                });

                if (refreshForm) {
                    refreshForm();
                }
            } else {
                Notification.error('Erreur lors de la mise à jour du formulaire');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du formulaire:', error);
            Notification.error('Erreur lors de la mise à jour du formulaire');
        } finally {
            setLoading(false);
        }
    };

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifiée';

        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="form-tab">
            {/* Section des informations générales */}
            <section className="form-info-section">
                <div className="section-header">
                    <h2>Informations générales</h2>
                    {!isEditingInfo && (
                        <button
                            className={`btn btn-sm ${form.canModify ? 'btn-secondary' : 'btn-disabled'}`}
                            onClick={handleStartInfoEdit}
                            disabled={!form.canModify}
                            title={!form.canModify ? "Ce formulaire ne peut pas être modifié car il contient déjà des réponses" : ""}
                        >
                            <FaEdit /> Modifier
                        </button>
                    )}
                </div>

                {isEditingInfo ? (
                    <div className="form-edit-content">
                        <div className="form-group">
                            <label htmlFor="title">Titre du formulaire *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={editedForm.title}
                                onChange={handleFormChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={editedForm.description}
                                onChange={handleFormChange}
                                className="form-control"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <div className="form-label-with-info">
                                <ToggleSwitch
                                    checked={editedForm.isActive}
                                    onChange={handleFormChange}
                                    name="isActive"
                                    label="Formulaire actif"
                                />
                                <div className="info-icon-wrapper" onMouseEnter={() => setShowInfoPopup(true)} onMouseLeave={() => setShowInfoPopup(false)}>
                                    <FaInfoCircle className="info-icon" />
                                    {showInfoPopup && (
                                        <div className="info-popup">
                                            Un formulaire actif est visible et peut être rempli par les utilisateurs.
                                            Un formulaire inactif est masqué du public.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="beginDate">Date de début (optionnelle)</label>
                                <input
                                    type="datetime-local"
                                    id="beginDate"
                                    name="beginDate"
                                    value={editedForm.beginDate || ''}
                                    onChange={handleDateChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endDate">Date de fin (optionnelle)</label>
                                <input
                                    type="datetime-local"
                                    id="endDate"
                                    name="endDate"
                                    value={editedForm.endDate || ''}
                                    onChange={handleDateChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-edit-actions">
                            <button
                                className="btn btn-cancel"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >
                                <FaTimes /> Annuler
                            </button>
                            <button
                                className="btn btn-save"
                                onClick={handleSaveInfo}
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
                ) : (
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label">Titre</div>
                            <div className="info-value">{form.title}</div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">Description</div>
                            <div className="info-value">{truncateText(form.description) || 'Aucune description'}</div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">Date de création</div>
                            <div className="info-value">
                                <FaCalendarAlt className="info-icon" />
                                {formatDate(form.createdAt)}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">Statut</div>
                            <div className="info-value">
                                <span className={`status-badge ${form.isActive ? 'status-active' : 'status-inactive'}`}>
                                    {form.isActive ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">Date de début</div>
                            <div className="info-value">
                                <FaCalendarAlt className="info-icon" />
                                {form.beginDate ? formatDate(form.beginDate) : 'Non spécifiée'}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">Date de fin</div>
                            <div className="info-value">
                                <FaCalendarAlt className="info-icon" />
                                {form.endDate ? formatDate(form.endDate) : 'Non spécifiée'}
                            </div>
                        </div>

                        {!form.canModify && (
                            <div className="info-item warning-item">
                                <div className="warning-message">
                                    <FaExclamationTriangle className="warning-icon" />
                                    <span>Ce formulaire ne peut pas être modifié car il contient déjà des réponses.</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Section des champs du formulaire */}
            <section className="form-fields-section">
                <div className="section-header">
                    <h2>Structure du formulaire</h2>
                    {!isEditingFields && (
                        <button
                            className={`btn btn-sm ${form.canModify ? 'btn-secondary' : 'btn-disabled'}`}
                            onClick={handleStartFieldsEdit}
                            disabled={!form.canModify}
                            title={!form.canModify ? "Ce formulaire ne peut pas être modifié car il contient déjà des réponses" : ""}
                        >
                            <FaEdit /> Modifier les champs
                        </button>
                    )}
                </div>

                {isEditingFields ? (
                    <FieldEditor
                        formId={form.id}
                        initialFields={form.fields || []}
                        onCancel={() => setIsEditingFields(false)}
                        onSave={() => {
                            setIsEditingFields(false);
                            if (refreshForm) {
                                refreshForm();
                            }
                        }}
                    />
                ) : (
                    form.fields && form.fields.length > 0 ? (
                        <div className="fields-container">
                            {form.fields.map((field, index) => (
                                <div key={field.id || index} className="field-card">
                                    <div className="field-order">{index + 1}</div>
                                    <div className="field-content">
                                        <div className="field-header">
                                            <h3>{field.title || field.label}</h3>
                                            <span className="field-type-badge">{getFieldLabel(field.type)}</span>
                                        </div>

                                        {field.description && (
                                            <p className="field-description">{field.description}</p>
                                        )}

                                        <div className="field-properties">
                                            {field.isRequired && (
                                                <span className="field-property required">Obligatoire</span>
                                            )}
                                            {field.minLength && (
                                                <span className="field-property">Min: {field.minLength}</span>
                                            )}
                                            {field.maxLength && (
                                                <span className="field-property">Max: {field.maxLength}</span>
                                            )}
                                        </div>

                                        {field.options && field.options.length > 0 && (
                                            <div className="field-options">
                                                <div className="options-title">Options:</div>
                                                <ul className="options-list">
                                                    {field.options.map((option, i) => (
                                                        <li key={i} className="option-item">{option}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-fields">
                            <FaClipboardList className="empty-icon" />
                            <p>Aucun champ défini pour ce formulaire</p>
                            {form.canModify && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleStartFieldsEdit}
                                >
                                    <FaEdit /> Ajouter des champs
                                </button>
                            )}
                        </div>
                    )
                )}
            </section>
        </div>
    );
};

export default FormTab;