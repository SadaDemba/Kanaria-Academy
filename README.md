# Kanaria Academy

## Description du projet

Kanaria Academy est une plateforme d'apprentissage complète qui intègre une application frontend en React.js et un backend en Node.js. Cette solution offre des fonctionnalités d'enseignement en ligne, de gestion des cours et d'interaction entre apprenants et formateurs.

## Structure du projet

Le projet est organisé en deux sous-dossiers principaux :

- `kanaria` : Application frontend en React.js
- `kanaria-api` : API backend en Node.js

## Prérequis

- Node.js (v14.x ou supérieur)
- npm ou yarn
- MongoDB (pour la base de données)
- Git

## Installation

### Clonage du dépôt
```bash
git clone https://github.com/SadaDemba/Kanaria-Academy.git
cd Kanaria-Academy
```

### Configuration du Backend (kanaria-api)

```bash
cd kanaria-api
npm install

# Créer et configurer le fichier .env
cp .env.example .env
# Éditez le fichier .env avec vos propres informations
```

#### Variables d'environnement backend

# Créer et configurer le fichier .env
cp .env.example .env

### Configuration du Frontend (kanaria)

```bash
cd ../kanaria
npm install

# Créer et configurer le fichier .env si nécessaire
cp .env.example .env
# Éditez le fichier .env avec vos propres informations
```

#### Variables d'environnement frontend

Créez un fichier `.env` dans le dossier `kanaria` avec les variables suivantes :
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Démarrage de l'application

### Démarrer le Backend

```bash
cd kanaria-api
npm run dev  # Pour le mode développement
# ou
npm start    # Pour le mode production
```

### Démarrer le Frontend

```bash
cd kanaria
npm start
```

L'application frontend sera accessible à l'adresse <http://localhost:3000> et l'API backend à <http://localhost:5000>.

## Fonctionnalités principales

- Authentification et gestion des utilisateurs
- Création et gestion de cours
- Suivi de progression des apprenants
- Interface administrative
- Système de messagerie intégré

## Structure des API

Le backend expose plusieurs endpoints API, notamment :

- `/api/auth` : Authentification et gestion des utilisateurs
- `/api/courses` : Gestion des cours
- `/api/lessons` : Gestion des leçons
- `/api/users` : Gestion des utilisateurs

## Déploiement

Instructions pour déployer l'application en production :

1. Construire le frontend :

```bash
cd kanaria
npm run build
```

1. Configurer les variables d'environnement pour la production
2. Déployer le backend et le frontend sur vos serveurs

## Contribution

Pour contribuer au projet :

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
2. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
3. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
4. Ouvrez une Pull Request

## Sécurité

- Ne jamais committer de fichiers `.env` ou d'autres fichiers contenant des secrets
- Toujours utiliser des variables d'environnement pour les informations sensibles
- S'assurer que les tokens JWT ont une durée de validité appropriée