const { hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const prisma = require("../config/prisma");
const ENV = require("../config/env");
const { checkUserByEmail, checkUserUnity } = require("../utils/checkUserExistence");
const { Role } = require('../utils/enums');

class UserController {

    async signup(req, res) {
        const { username, email, password, role } = req.body;

        try {
            // Vérifier si l'utilisateur qui fait la demande est un SUPER_ADMIN
            if (role === Role.SUPER_ADMIN && (!req.user || req.user.role !== Role.SUPER_ADMIN)) {
                return res.status(403).json({ error: 'Seul un super admin peut créer un super admin' });
            }

            await checkUserUnity(email, res);

            const hashedPassword = await hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    username: username || email.split('@')[0],
                    email,
                    password: hashedPassword,
                    role: role || Role.ADMIN,
                }
            });

            const token = sign(
                { userId: user.id },
                ENV.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({ error: "User creation failed", details: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await checkUserByEmail(email, res);

            const validPassword = await compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Email or password incorrect' });
            }

            if (!user.isActive) {
                return res.status(403).json({ error: 'Votre compte a été désactivé. Veuillez contacter un administrateur principal.' });
            }

            const token = sign({ id: user.id }, ENV.JWT_SECRET, { expiresIn: "7d" });

            res.json({
                message: "Logged in successfully",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({ error: "Login failed", details: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    isActive: true
                }
            });

            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;

            // Vérifier si l'utilisateur a le droit de voir ce profil
            if (req.user.role !== Role.SUPER_ADMIN && req.user.id !== id) {
                return res.status(403).json({ error: 'Accès interdit' });
            }

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { username, role } = req.body;

            const userToUpdate = await prisma.user.findUnique({ where: { id } });

            if (!userToUpdate) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            if (role && role !== userToUpdate.role && req.user.role !== Role.SUPER_ADMIN) {
                return res.status(403).json({ error: 'Vous n\'avez pas les permissions pour changer le rôle' });
            }

            if (req.user.role !== Role.SUPER_ADMIN && req.user.id !== id) {
                return res.status(403).json({ error: 'Vous ne pouvez pas modifier ce profil' });
            }

            const updateData = {};
            if (username) updateData.username = username;
            if (role && req.user.role === Role.SUPER_ADMIN) updateData.role = role;

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true
                }
            });

            res.json({
                success: true,
                message: 'Utilisateur mis à jour avec succès',
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const { id } = req.params;
            const { currentPassword, newPassword } = req.body;

            // Un utilisateur ne peut changer que son propre mot de passe
            if (req.user.id !== id) {
                return res.status(403).json({ error: 'Vous ne pouvez pas changer le mot de passe d\'un autre utilisateur' });
            }

            const user = await prisma.user.findUnique({ where: { id } });

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Vérifier le mot de passe actuel
            const validPassword = await compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
            }

            // Hasher et enregistrer le nouveau mot de passe
            const hashedPassword = await hash(newPassword, 10);

            await prisma.user.update({
                where: { id },
                data: { password: hashedPassword }
            });

            res.json({
                success: true,
                message: 'Mot de passe changé avec succès'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Vérifier si l'utilisateur existe
            const userToDelete = await prisma.user.findUnique({ where: { id } });

            if (!userToDelete) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Empêcher la suppression du dernier super admin
            if (userToDelete.role === Role.SUPER_ADMIN) {
                const superAdminCount = await prisma.user.count({
                    where: { role: Role.SUPER_ADMIN }
                });

                if (superAdminCount <= 1) {
                    return res.status(400).json({ error: 'Impossible de supprimer le dernier super admin' });
                }
            }

            // Supprimer l'utilisateur
            await prisma.user.delete({ where: { id } });

            res.json({
                success: true,
                message: 'Utilisateur supprimé avec succès'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async toggleUserActive(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            // Vérifications
            if (isActive === undefined) {
                return res.status(400).json({ error: 'Le paramètre isActive est requis' });
            }

            // Seul un super admin peut activer/désactiver un utilisateur
            if (req.user.role !== Role.SUPER_ADMIN) {
                return res.status(403).json({ error: 'Seul un super admin peut activer/désactiver un compte' });
            }

            const userToUpdate = await prisma.user.findUnique({ where: { id } });

            if (!userToUpdate) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Un super admin ne peut pas désactiver son propre compte
            if (req.user.id === id && !isActive) {
                return res.status(400).json({ error: 'Vous ne pouvez pas désactiver votre propre compte' });
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { isActive },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    isActive: true
                }
            });

            res.json({
                success: true,
                message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`,
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { id } = req.params;

            // Seul un super admin peut réinitialiser un mot de passe
            if (req.user.role !== Role.SUPER_ADMIN) {
                return res.status(403).json({ error: 'Seul un super admin peut réinitialiser un mot de passe' });
            }

            const userToUpdate = await prisma.user.findUnique({ where: { id } });

            if (!userToUpdate) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Hasher et enregistrer le nouveau mot de passe par défaut
            const hashedPassword = await hash(ENV.DEFAULT_REFRESH_PWD, 10);

            await prisma.user.update({
                where: { id },
                data: { password: hashedPassword }
            });

            res.json({
                success: true,
                message: 'Mot de passe réinitialisé avec succès'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;