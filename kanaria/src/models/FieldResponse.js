import { Field } from "./Field";
import { FormResponse } from "./FormResponse";

export class FieldResponse {
    constructor(data = {}) {
        this.id = data.id || null;
        this.formResponseId = data.formResponseId || '';
        this.fieldId = data.fieldId || '';
        this.value = data.value || '';
        this.field = data.field ? new Field(data.field) : null;
        this.formResponse = data.formResponse ? new FormResponse(data.formResponse) : null;
    }

    // Méthode pour convertir en objet simple pour les requêtes API
    toJSON() {
        return {
            id: this.id,
            formResponseId: this.formResponseId,
            fieldId: this.fieldId,
            value: this.value
        };
    }

    // Méthode statique pour créer un FieldResponse à partir des données API
    static fromAPI(data) {
        return new FieldResponse(data);
    }
}