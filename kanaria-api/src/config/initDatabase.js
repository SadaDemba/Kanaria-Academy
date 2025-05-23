const { hash } = require('bcryptjs');
const prisma = require("../config/prisma");
const ENV = require("../config/env");
const dotenv = require("dotenv");
const { Role } = require('../utils/enums');


dotenv.config();

const addDefaultUser = async () => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email: ENV.ADMIN_EMAIL } });

        if (existingUser) {
            console.log('- L\'utilisateur par défaut existe déjà. -');
            return;
        }
        const hashedPassword = await hash(ENV.ADMIN_PWD, 10);

        // Ajouter l'utilisateur par défaut si il n'existe pas
        const defaultUser = await prisma.user.create({
            data: {
                username: 'KA-admin',
                email: ENV.ADMIN_EMAIL,
                password: hashedPassword,
                role: Role.SUPER_ADMIN
            }
        });

        const { password, id, ...safeUser } = defaultUser;
        console.log('- Utilisateur par défaut ajouté:', safeUser);

    } catch (error) {
        console.error('- Erreur lors de l\'ajout de l\'utilisateur par défaut:', error.message);
    }
};

module.exports = addDefaultUser;
