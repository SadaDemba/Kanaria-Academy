/**
 * Middleware pour vérifier les rôles des utilisateurs
 * @param {string} role - Rôle requis pour accéder à la ressource
 */
const authorize = (requiredRole) => {
    return (req, res, next) => {
        // L'utilisateur a déjà été authentifié grâce au middleware authenticate
        const { user } = req;

        if (!user || user.role !== requiredRole) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        next();
    };
};

module.exports = authorize;