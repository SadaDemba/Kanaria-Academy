export class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.username = data.username || '';
        this.role = data.role || 'ADMIN';
        this.email = data.email || '';
        this.password = data.password || '';
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.forms = data.forms || [];
    }

    // Méthode pour convertir en objet simple pour les requêtes API
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            role: this.role,
            email: this.email,
            password: this.password,
            isActive: this.isActive
        };
    }

    // Méthode statique pour créer un User à partir des données API
    static fromAPI(data) {
        return new User(data);
    }
}