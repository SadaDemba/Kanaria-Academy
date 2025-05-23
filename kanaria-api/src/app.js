const express = require('express');
const { json } = require('body-parser');
const path = require('path');
const cors = require('cors')
const ENV = require("./config/env");
const { specs, swaggerUi } = require('./config/swagger');
const { initAzureBlobContainer } = require('./config/storage');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const participantRoutes = require('./routes/participantRoutes');
const formRoutes = require('./routes/formRoutes')
const responseFormRoutes = require('./routes/responseFormRoutes');
const shopRoutes = require('./routes/shopRoutes');
const addDefaultUser = require('./config/initDatabase');

const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin"]
};


// Middlewares
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(json());

//documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/participant', participantRoutes);
app.use('/forms', formRoutes);
app.use('/responseForm', responseFormRoutes);
app.use('/shop', shopRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur est survenue!', details: err.message });
});

const PORT = ENV.PORT || 3000;

// Fonction de démarrage asynchrone
const startServer = async () => {
    try {
        // Initialiser la base de données avec l'utilisateur par défaut
        await addDefaultUser();

        // Initialiser le conteneur Azure Blob Storage si nécessaire
        if (ENV.AZURE_STORAGE_CONNECTION_STRING) {
            console.log('Initialisation du conteneur Azure Blob Storage...');
            await initAzureBlobContainer();
        } else {
            console.warn('Aucune chaîne de connexion Azure Storage trouvée. Le stockage local sera utilisé.');
        }

        // Démarrer le serveur
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
            console.log(`📄 Documentation accessible sur http://localhost:${PORT}/api-docs`);
            console.log(`Mode de stockage: ${ENV.AZURE_STORAGE_CONNECTION_STRING ? 'Azure Blob Storage' : 'Local'}`);
        });

    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

startServer();