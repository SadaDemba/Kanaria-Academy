const dotenv = require("dotenv");

// Charger le fichier .env approprié selon l'environnement
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env.production" });
} else {
    dotenv.config();
}

const ENV = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "supersecret",
    DATABASE_URL: process.env.DATABASE_URL || "",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
    ADMIN_PWD: process.env.ADMIN_PWD || "",
    DEFAULT_REFRESH_PWD: process.env.DEFAULT_REFRESH_PWD || "",
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME || "product-images",
    IS_PRODUCTION: process.env.NODE_ENV === "production"
};

module.exports = ENV;