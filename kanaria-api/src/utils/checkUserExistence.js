const prisma = require("../config/prisma");

const checkUserById = async (userId, res) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return user;
}

const checkUserUnity = async (email, res) => {
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (user) {
        return res.status(404).json({ error: "Already an account linked to this email" });
    }
    return user;
}



const checkUserByEmail = async (email, res) => {
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return user;
}

module.exports = {
    checkUserByEmail,
    checkUserUnity,
    checkUserById
}