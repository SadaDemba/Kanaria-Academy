import { Form } from "./Form";

export class Field {
    constructor(data = {}) {
        this.id = data.id || null;
        this.formId = data.formId || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.type = data.type || 'TEXT';
        this.maxLength = data.maxLength || null;
        this.minLength = data.minLength || null;
        this.options = data.options || {};
        this.isRequired = data.isRequired !== undefined ? data.isRequired : false;
        this.order = data.order || 0;
        this.errorMessage = data.errorMessage || '';
        this.form = data.form ? new Form(data.form) : null;
        this.responses = data.responses || [];
    }

    // Méthode pour convertir en objet simple pour les requêtes API
    toJSON() {
        return {
            id: this.id,
            formId: this.formId,
            title: this.title,
            description: this.description,
            type: this.type,
            maxLength: this.maxLength,
            minLength: this.minLength,
            options: this.options,
            isRequired: this.isRequired,
            order: this.order,
            errorMessage: this.errorMessage
        };
    }

    // Méthode statique pour créer un Field à partir des données API
    static fromAPI(data) {
        return new Field(data);
    }

    // Méthode pour valider une valeur selon les règles du champ
    validate(value) {
        // Vérifier si le champ est requis
        if (this.isRequired && (!value || value.trim() === '')) {
            return this.errorMessage || `Le champ ${this.title} est requis`;
        }

        // Vérifier la longueur si définie
        if (value && this.minLength && value.length < this.minLength) {
            return `${this.title} doit contenir au moins ${this.minLength} caractères`;
        }

        if (value && this.maxLength && value.length > this.maxLength) {
            return `${this.title} ne doit pas dépasser ${this.maxLength} caractères`;
        }

        // Validations spécifiques au type
        switch (this.type) {
            case 'EMAIL':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return `Veuillez entrer une adresse email valide`;
                }
                break;
            case 'PHONE':
                if (value && !/^\+?[0-9\s-]{8,15}$/.test(value)) {
                    return `Veuillez entrer un numéro de téléphone valide`;
                }
                break;
            case 'NUMBER':
                if (value && isNaN(Number(value))) {
                    return `${this.title} doit être un nombre`;
                }
                break;
            case 'DATE':
                if (value && isNaN(new Date(value).getTime())) {
                    return `Veuillez entrer une date valide`;
                }
                break;
            default:
                return null;
        }
    }
}
