import { Field } from "./Field";
import { FormResponse } from "./FormResponse";
import { User } from "./User";
export class Form {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.beginDate = data.beginDate ? new Date(data.beginDate) : null;
        this.endDate = data.endDate ? new Date(data.endDate) : null;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.createdBy = data.createdBy || '';
        this.fields = data.fields ? data.fields.map(field => new Field(field)) : [];
        this.creator = data.creator ? new User(data.creator) : null;
        this.responses = data.responses ? data.responses.map(response => new FormResponse(response)) : [];
    }

    // Ajouter un champ
    addField(field) {
        if (!(field instanceof Field)) {
            field = new Field(field);
        }
        field.formId = this.id;
        field.order = this.fields.length + 1;
        this.fields.push(field);
        return field;
    }

    // Méthode pour convertir en objet simple pour les requêtes API
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            isActive: this.isActive,
            beginDate: this.beginDate,
            endDate: this.endDate,
            createdBy: this.createdBy,
            fields: this.fields.map(field => field.toJSON())
        };
    }

    // Méthode statique pour créer un Form à partir des données API
    static fromAPI(data) {
        return new Form(data);
    }

    // Vérifier si le formulaire est actuellement actif
    isCurrentlyActive() {
        const now = new Date();
        if (!this.isActive) return false;

        // Vérifier les dates si elles sont définies
        if (this.beginDate && now < this.beginDate) return false;
        if (this.endDate && now > this.endDate) return false;

        return true;
    }
}