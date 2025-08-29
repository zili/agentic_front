# ECCBC Stock Management System

Système de gestion de stock moderne pour ECCBC, développé avec React, TypeScript et Tailwind CSS.

## 🚀 Technologies Utilisées

### Frontend
- **React 18** - Bibliothèque JavaScript pour les interfaces utilisateur
- **TypeScript** - Typage statique pour JavaScript
- **Vite** - Outil de build rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Bibliothèque d'animations
- **Lucide React** - Icônes modernes
- **Axios** - Client HTTP pour les requêtes API

### API
- **API N8N** - API déployée sur `n8n.xandys.xyz:8000`
- **Authentification JWT** - Gestion sécurisée des sessions
- **Base de données PostgreSQL** - Stockage des données

## 🏗️ Architecture

### Structure du Projet
```
src/
├── components/          # Composants réutilisables
├── contexts/           # Contextes React (Auth, etc.)
├── hooks/              # Hooks personnalisés
├── i18n/               # Internationalisation
├── lib/                # Utilitaires et configurations
├── pages/              # Pages de l'application
├── services/           # Services API
├── types/              # Types TypeScript
└── assets/             # Ressources statiques
```

### Services API
- **apiService** - Service principal pour communiquer avec l'API n8n
- **AuthContext** - Gestion de l'authentification
- **useTranslation** - Support multilingue (FR, EN, AR)

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd eccbc-stock-management

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Scripts Disponibles
- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run preview` - Prévisualise la version de production

## 🔐 Authentification

Le système utilise l'authentification JWT avec l'API n8n :
- Connexion sécurisée avec nom d'utilisateur et mot de passe
- Tokens stockés dans le localStorage
- Vérification automatique de la validité des tokens
- Déconnexion automatique en cas de token expiré

## 🌐 Fonctionnalités

### Dashboard
- Vue d'ensemble des métriques importantes
- Graphiques et statistiques en temps réel
- Notifications des commandes récentes

### Gestion des Produits
- Liste des produits avec informations détaillées
- Recherche multilingue (FR, EN, AR)
- Gestion des catégories et prix

### Gestion du Stock
- Suivi des quantités en stock
- Gestion des réservations
- Alertes de stock faible

### Commandes
- Création de nouvelles commandes
- Historique des commandes par client
- Suivi du statut des commandes

## 🎨 Interface Utilisateur

### Design System
- **Glassmorphism** - Effets de verre avec transparence
- **Animations fluides** - Transitions avec Framer Motion
- **Responsive Design** - Adaptation mobile et desktop
- **Thème ECCBC** - Couleurs et branding personnalisés

### Composants UI
- Cartes avec ombres douces et coins arrondis
- Boutons avec animations et états hover
- Formulaires avec validation
- Modales et notifications toast

## 🔧 Configuration

### Variables d'Environnement
L'API est configurée pour pointer vers `n8n.xandys.xyz:8000` par défaut.

### Internationalisation
Le système supporte 3 langues :
- Français (FR) - Langue par défaut
- Anglais (EN)
- Arabe (AR)

## 📱 Responsive Design

L'application est entièrement responsive avec :
- Design mobile-first
- Navigation adaptative
- Composants flexibles
- Grilles CSS modernes

## 🔒 Sécurité

- Authentification JWT sécurisée
- Validation des données côté client
- Protection contre les injections XSS
- Gestion sécurisée des tokens

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Serveur de Production
```bash
npm run preview
```

## 📄 Licence

© 2025 ECCBC. Tous droits réservés.

## 🤝 Support

Pour toute question ou problème, contactez l'équipe de développement ECCBC.
