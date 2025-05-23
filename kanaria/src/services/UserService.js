import BaseService from './BaseService';

class UserService extends BaseService {
    constructor() {
        super();
        this.basePath = '/users';
    }

    async getAllUsers() {
        return this.get(`${this.basePath}`);
    }

    async getUserById(userId) {
        return this.get(`${this.basePath}/${userId}`);
    }

    async updateUser(userId, userData) {
        return this.put(`${this.basePath}/${userId}`, userData);
    }

    async changePassword(userId, passwordData) {
        return this.put(`${this.basePath}/${userId}/change-password`, passwordData);
    }

    async toggleUserActive(userId, isActive) {
        return this.put(`${this.basePath}/${userId}/toggle-active`, { isActive });
    }

    async resetPassword(userId) {
        return this.put(`${this.basePath}/${userId}/reset-password`, {});
    }

    async deleteUser(userId) {
        return this.delete(`${this.basePath}/${userId}`);
    }
}

export default UserService;