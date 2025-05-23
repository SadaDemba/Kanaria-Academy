export const FIELD_TYPES = [
    { value: 'TEXT', label: 'Texte court' },
    { value: 'TEXTAREA', label: 'Texte long' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'PHONE', label: 'Téléphone' },
    { value: 'NUMBER', label: 'Nombre' },
    { value: 'DATE', label: 'Date' },
    { value: 'CHECKBOX', label: 'Case à cocher' },
    { value: 'RADIO', label: 'Boutons radio' },
];

export const getFieldLabel = (type) =>
    FIELD_TYPES.find(t => t.value === type)?.label || type;
