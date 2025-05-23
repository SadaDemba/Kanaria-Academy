import { FieldResponse } from "./FieldResponse";
import { Form } from "./Form";

export class FormResponse {
    constructor(data = {}) {
        this.id = data.id || null;
        this.formId = data.formId || '';
        this.email = data.email || '';
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.status = data.status || 'UNREAD';
        this.responses = data.responses ? data.responses.map(resp => new FieldResponse(resp)) : [];
        this.form = data.form ? new Form(data.form) : null;
    }

    // Ajouter une réponse de champ
    addFieldResponse(fieldId, value) {
        const fieldResponse = new FieldResponse({
            formResponseId: this.id,
            fieldId: fieldId,
            value: value
        });
        this.responses.push(fieldResponse);
        return fieldResponse;
    }

    // Méthode pour convertir en objet simple pour les requêtes API
    toJSON() {
        return {
            id: this.id,
            formId: this.formId,
            email: this.email,
            status: this.status,
            responses: this.responses.map(resp => resp.toJSON())
        };
    }

    // Méthode statique pour créer un FormResponse à partir des données API
    static fromAPI(data) {
        return new FormResponse(data);
    }

    // Méthode pour marquer comme lu
    markAsRead() {
        this.status = 'READ';
        return this;
    }
}