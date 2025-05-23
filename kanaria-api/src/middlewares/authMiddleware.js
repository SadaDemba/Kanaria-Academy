const jwt = require('jsonwebtoken');
const prisma = require("../config/prisma");

// Middleware d'authentification général
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'Votre compte a été désactivé. Veuillez contacter un administrateur.' });
        }

        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

module.exports = authenticate;