# Kanaria Academy

## Description du projet

Kanaria Academy est la plateforme académique de Kanaria, une association créée dans le cadre de nos projets d'école (Ydays) à Ynov Campus. Le but est de mettre en place une équipe académique d'e-sport en sélectionnant parmi les élèves de Ynov les plus talentueux et désireux de faire partie de l'équipe. Cette équipe sera entraînée et l'équipe première pourra sélectionner parmi les joueurs des éléments qui vont passer dans l'équipe première et participer à la compétition EVA.

Cette plateforme permet de créer des formulaires flexibles -- avec tous types de champs dont du texte court, du texte long, des nombres, des choix multiples ou uniques, etc., avec des paramètres configurables tels que le nombre de caractères ou l'obligation ou non du champ -- de les publier, et de consulter les réponses.

Elle contient aussi une boutique en ligne ainsi qu'une gestion des comptes utilisateurs, pour l'administration, intégrée.

## Structure du projet

Le projet est organisé en deux sous-dossiers principaux :

- `kanaria` : Application frontend en React.js
- `kanaria-api` : API backend en Node.js

## Prérequis

- Node.js (v14.x ou supérieur)
- npm ou yarn
- SQL Server (pour la base de données)
- Git
### Pour le déploiement
- Azure blob storage pour les images
- Azure SQL Server (une bdd pour les données principale et une autre shadow pour les données de migration avec Prisma
- Azure container apps pour déployer les deux applications (back et front) sur des conteneurs.
- Azure Container Registry pour garder les images de nos conteneurs


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
