# 🚀 Subtrack - Subscription Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-9.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/Angular-20.x-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

Une plateforme complète et moderne pour gérer et suivre tous vos abonnements logiciels et services avec des alertes automatiques, des analyses détaillées et des fonctionnalités de collaboration en équipe.

---

## 📋 Table des Matières

- [Aperçu](#-aperçu)
- [Caractéristiques](#-caractéristiques)
- [Architecture](#-architecture)
- [Technologies Utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement de l'Application](#-lancement-de-lapplication)
- [Structure du Projet](#-structure-du-projet)
- [Développement](#-développement)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Documentation API](#-documentation-api)
- [Résolution des Problèmes](#-résolution-des-problèmes)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 Aperçu

**Subtrack** est une plateforme de gestion d'abonnements qui permet aux particuliers et aux équipes de :

✅ **Centraliser** tous les abonnements logiciels et services en un seul endroit  
✅ **Recevoir** des alertes automatiques avant les renouvellements  
✅ **Analyser** les coûts avec des rapports personnalisables  
✅ **Collaborer** avec les membres de l'équipe via un contrôle d'accès basé sur les rôles  
✅ **Optimiser** les dépenses grâce à des analyses détaillées  
✅ **Suivre** l'utilisation et les tendances de consommation  

---

## ✨ Caractéristiques

### 🎨 Fonctionnalités Principales

- **Gestion Complète des Abonnements**
  - Ajout, modification et suppression d'abonnements
  - Catégorisation et organisation personnalisées
  - Historique complet des modifications

- **Notifications Automatisées**
  - Alertes email pour les renouvellements à venir
  - Rappels configurables (7, 14, 30 jours avant)
  - Notifications en temps réel

- **Tableau de Bord Analytique**
  - Graphiques interactifs et visuels
  - Rapports de dépenses mensuels/annuels
  - Tendances et prévisions budgétaires

- **Collaboration en Équipe**
  - Support multi-utilisateurs
  - Rôles et permissions (Admin, Manager, User)
  - Partage d'abonnements en équipe

- **Sécurité Avancée**
  - Authentification OAuth2 avec Laravel Passport
  - Chiffrement des données sensibles
  - Sessions sécurisées et CSRF protection

- **Optimisation des Coûts**
  - Détection des doublons d'abonnements
  - Suggestions d'économies
  - Comparaison de plans

### 🚧 Fonctionnalités à Venir

- 💳 Intégration de paiement avec Stripe
- 📱 Application mobile (iOS/Android)
- 📊 Rapports avancés avec filtres personnalisés
- 💰 Alertes budgétaires intelligentes
- 🔗 Intégration avec plateformes SaaS populaires
- 📄 Export de données (CSV, PDF, Excel)
- 🤖 Assistant IA pour recommandations

---

## 🏗️ Architecture

L'application suit une **architecture microservices** moderne :

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                   (Angular 20 SPA)                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Nginx Proxy                           │
│               (Port 8080 - Reverse Proxy)                │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Laravel API     │    │  Static Assets   │
│  (PHP-FPM 8.2)   │    │  (Angular Build) │
└────────┬─────────┘    └──────────────────┘
         │
    ┌────┴────┬──────────────┬──────────────┐
    ▼         ▼              ▼              ▼
┌────────┐ ┌──────┐  ┌───────────┐  ┌──────────┐
│ PostgreSQL│ │Redis │  │  MailHog  │  │ Scheduler│
│  (DB)   │ │(Cache)│  │  (Email)  │  │  (Cron) │
└─────────┘ └──────┘  └───────────┘  └──────────┘
```

**Composants :**

- **Frontend** : Angular 20 avec Berry Admin Template
- **Backend** : Laravel 9 REST API avec PHP 8.2
- **Base de données** : PostgreSQL 15
- **Cache & Queue** : Redis
- **Serveur Web** : Nginx
- **Email** : MailHog (dev) / SMTP (prod)
- **Orchestration** : Docker & Docker Compose

---

## 🛠️ Technologies Utilisées

### Backend
| Technologie | Version | Description |
|------------|---------|-------------|
| **PHP** | 8.2 | Langage serveur |
| **Laravel** | 9.x | Framework PHP moderne |
| **PostgreSQL** | 15 | Base de données relationnelle |
| **Redis** | Latest | Cache et gestion de files d'attente |
| **Laravel Passport** | Latest | Authentification OAuth2 |
| **Guzzle HTTP** | Latest | Client HTTP pour API externes |
| **Laravel Scheduler** | Built-in | Planification de tâches |

### Frontend
| Technologie | Version | Description |
|------------|---------|-------------|
| **Angular** | 20.x | Framework frontend |
| **TypeScript** | 5.x | Langage typé |
| **Bootstrap** | 5.x | Framework CSS |
| **Berry Template** | Latest | Template d'administration |
| **Tabler Icons** | Latest | Bibliothèque d'icônes |
| **Chart.js** | Latest | Graphiques interactifs |
| **RxJS** | 7.x | Programmation réactive |

### DevOps & Infrastructure
| Outil | Version | Description |
|-------|---------|-------------|
| **Docker** | 20.10+ | Conteneurisation |
| **Docker Compose** | 2.0+ | Orchestration multi-conteneurs |
| **Nginx** | Alpine | Serveur web et proxy inverse |
| **MailHog** | Latest | Test d'emails en développement |
| **pgAdmin** | 4 | Interface de gestion PostgreSQL |

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Obligatoire

- **Docker** : version 20.10 ou supérieure
  ```bash
  docker --version
  ```

- **Docker Compose** : version 2.0 ou supérieure
  ```bash
  docker-compose --version
  ```

- **Git** : pour cloner le dépôt
  ```bash
  git --version
  ```

### Optionnel (pour développement local)

- **Node.js** : version 20.x LTS
  ```bash
  node --version
  ```

- **Composer** : version 2.x
  ```bash
  composer --version
  ```

- **PHP** : version 8.2
  ```bash
  php --version
  ```

---

## 📦 Installation

### Étape 1 : Cloner le Dépôt

```bash
# Cloner le projet
git clone <votre-url-repository>
cd Subtrack
```

### Étape 2 : Configuration Backend

```bash
cd backend

# Copier le fichier d'environnement
cp .env.example .env

# Installation des dépendances PHP (si développement local)
composer install

# Retour au répertoire racine
cd ..
```

### Étape 3 : Configuration Frontend

```bash
cd frontend

# Installation des dépendances Node.js (si développement local)
npm install
# ou
yarn install

# Retour au répertoire racine
cd ..
```

### Étape 4 : Lancer les Conteneurs Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que tous les conteneurs fonctionnent
docker-compose ps
```

### Étape 5 : Configuration Initiale de Laravel

```bash
# Générer la clé d'application
docker-compose exec php php artisan key:generate

# Exécuter les migrations de base de données
docker-compose exec php php artisan migrate

# Installer Laravel Passport pour OAuth2
docker-compose exec php php artisan passport:install

# (Optionnel) Remplir la base avec des données de test
docker-compose exec php php artisan db:seed
```

---

## ⚙️ Configuration

### Configuration Backend (Laravel)

Éditez le fichier `backend/.env` :

```env
# === APPLICATION ===
APP_NAME=Subtrack
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
APP_KEY=base64:XXXXX  # Généré automatiquement

# === BASE DE DONNÉES ===
DB_CONNECTION=pgsql
DB_HOST=pgsql
DB_PORT=5432
DB_DATABASE=subtrack
DB_USERNAME=laravel
DB_PASSWORD=secret

# === REDIS ===
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_CLIENT=predis

# === QUEUE ===
QUEUE_CONNECTION=redis

# === CACHE ===
CACHE_DRIVER=redis
SESSION_DRIVER=redis

# === EMAIL ===
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@subtrack.com
MAIL_FROM_NAME="${APP_NAME}"

# === STRIPE (Production) ===
STRIPE_KEY=pk_test_XXXXX
STRIPE_SECRET=sk_test_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX

# === PASSPORT ===
PASSPORT_PRIVATE_KEY=
PASSPORT_PUBLIC_KEY=
```

### Configuration Frontend (Angular)

**Développement** : `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'Subtrack'
};
```

**Production** : `frontend/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-domaine.com/api',
  appName: 'Subtrack'
};
```

### Configuration Docker

Le fichier `docker-compose.yml` définit :

| Service | Port | Description |
|---------|------|-------------|
| **nginx** | 8080 | Serveur web principal |
| **pgsql** | 5432 | Base de données PostgreSQL |
| **mailhog** | 8025 | Interface email testing |
| **pgadmin** | 5050 | Interface gestion DB |
| **redis** | 6379 | Cache et queues |

---

## 🚀 Lancement de l'Application

### Démarrage Complet

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f php
docker-compose logs -f nginx
```

### Arrêt de l'Application

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

### Accès aux Services

| Service | URL | Identifiants |
|---------|-----|-------------|
| **Application Frontend** | http://localhost:4200 | - |
| **API Backend** | http://localhost:8080/api | - |
| **MailHog** | http://localhost:8025 | - |
| **pgAdmin** | http://localhost:5050 | admin@admin.com / admin |

### Commandes Utiles

```bash
# Voir les conteneurs actifs
docker-compose ps

# Redémarrer un service
docker-compose restart php

# Reconstruire les images
docker-compose build --no-cache

# Voir l'utilisation des ressources
docker stats

# Accéder au shell d'un conteneur
docker-compose exec php bash
docker-compose exec pgsql psql -U laravel -d subtrack
```

---

## 📁 Structure du Projet

```
Subtrack/
│
├── backend/                        # Application Laravel
│   ├── app/
│   │   ├── Console/               # Commandes Artisan personnalisées
│   │   ├── Exceptions/            # Gestionnaires d'exceptions
│   │   ├── Http/
│   │   │   ├── Controllers/       # Contrôleurs API
│   │   │   ├── Middleware/        # Middlewares personnalisés
│   │   │   ├── Requests/          # Form Request validations
│   │   │   └── Resources/         # API Resources (transformations)
│   │   ├── Models/                # Modèles Eloquent
│   │   ├── Notifications/         # Classes de notifications
│   │   ├── Policies/              # Policies d'autorisation
│   │   └── Services/              # Logique métier
│   │
│   ├── config/                    # Fichiers de configuration
│   │   ├── app.php
│   │   ├── database.php
│   │   ├── mail.php
│   │   └── services.php
│   │
│   ├── database/
│   │   ├── factories/             # Model factories
│   │   ├── migrations/            # Migrations de base de données
│   │   └── seeders/               # Seeders de données
│   │
│   ├── routes/
│   │   ├── api.php                # Routes API
│   │   ├── web.php                # Routes web
│   │   └── channels.php           # Broadcasting channels
│   │
│   ├── storage/
│   │   ├── app/                   # Fichiers d'application
│   │   ├── framework/             # Fichiers framework
│   │   └── logs/                  # Logs de l'application
│   │
│   ├── tests/
│   │   ├── Feature/               # Tests fonctionnels
│   │   └── Unit/                  # Tests unitaires
│   │
│   ├── .env.example               # Template de configuration
│   ├── composer.json              # Dépendances PHP
│   ├── artisan                    # CLI Laravel
│   └── phpunit.xml                # Configuration PHPUnit
│
├── frontend/                      # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # Services core (auth, guards)
│   │   │   ├── shared/            # Composants partagés
│   │   │   ├── pages/             # Pages de l'application
│   │   │   │   ├── authentication/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── subscriptions/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   ├── theme/             # Layout et thème
│   │   │   └── app.component.ts
│   │   │
│   │   ├── assets/                # Ressources statiques
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   └── icons/
│   │   │
│   │   ├── environments/          # Configurations d'environnement
│   │   │   ├── environment.ts
│   │   │   └── environment.prod.ts
│   │   │
│   │   └── scss/                  # Styles globaux SCSS
│   │       ├── _variables.scss
│   │       ├── _mixins.scss
│   │       └── styles.scss
│   │
│   ├── angular.json               # Configuration Angular
│   ├── package.json               # Dépendances Node.js
│   ├── tsconfig.json              # Configuration TypeScript
│   └── karma.conf.js              # Configuration tests
│
├── docker/                        # Configurations Docker
│   ├── nginx/
│   │   └── default.conf           # Config Nginx
│   ├── php/
│   │   ├── Dockerfile             # Image PHP-FPM
│   │   └── php.ini                # Config PHP
│   └── redis/
│       └── redis.conf             # Config Redis
│
├── docker-compose.yml             # Orchestration Docker
├── .gitignore                     # Fichiers ignorés par Git
└── README.md                      # Ce fichier
```

---

## 👨‍💻 Développement

### Backend (Laravel)

#### Commandes Artisan Courantes

```bash
# Créer une migration
docker-compose exec php php artisan make:migration create_subscriptions_table

# Créer un modèle avec migration
docker-compose exec php php artisan make:model Subscription -m

# Créer un contrôleur
docker-compose exec php php artisan make:controller SubscriptionController --api

# Créer un seeder
docker-compose exec php php artisan make:seeder SubscriptionSeeder

# Créer un middleware
docker-compose exec php php artisan make:middleware CheckSubscriptionOwner

# Créer une notification
docker-compose exec php php artisan make:notification SubscriptionRenewalNotification

# Nettoyer le cache
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear

# Lancer le worker de queue
docker-compose exec php php artisan queue:work --tries=3

# Lancer le scheduler manuellement
docker-compose exec php php artisan schedule:run
```

#### Migration de Base de Données

```bash
# Exécuter les migrations
docker-compose exec php php artisan migrate

# Rollback dernière migration
docker-compose exec php php artisan migrate:rollback

# Réinitialiser et re-migrer
docker-compose exec php php artisan migrate:fresh

# Migrer avec seeders
docker-compose exec php php artisan migrate:fresh --seed

# Voir le statut des migrations
docker-compose exec php php artisan migrate:status
```

#### Formatting et Code Style

```bash
# Formater le code avec Laravel Pint
docker-compose exec php ./vendor/bin/pint

# Vérifier sans modifier
docker-compose exec php ./vendor/bin/pint --test

# Analyser le code avec PHPStan
docker-compose exec php ./vendor/bin/phpstan analyse
```

### Frontend (Angular)

#### Commandes de Développement

```bash
cd frontend

# Démarrer le serveur de développement
npm start
# ou avec options
ng serve --open --port 4200

# Générer un composant
ng generate component pages/subscription-list
ng g c pages/subscription-list --skip-tests

# Générer un service
ng generate service core/services/subscription
ng g s core/services/subscription

# Générer un guard
ng generate guard core/guards/auth

# Générer un interceptor
ng generate interceptor core/interceptors/auth

# Générer un module
ng generate module pages/analytics --routing

# Build de production
npm run build-prod
# ou
ng build --configuration production

# Analyser le bundle
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

#### Linting et Formatting

```bash
# Linter le code
npm run lint

# Corriger automatiquement
npm run lint -- --fix

# Formater avec Prettier
npm run prettier

# Vérifier le formatage
npm run prettier:check
```

### Gestion de la Base de Données

#### Via psql CLI

```bash
# Se connecter à PostgreSQL
docker-compose exec pgsql psql -U laravel -d subtrack

# Commandes PostgreSQL utiles
\dt                    # Lister les tables
\d+ table_name        # Décrire une table
\l                    # Lister les bases de données
\du                   # Lister les utilisateurs
\q                    # Quitter
```

#### Via pgAdmin

1. Accéder à http://localhost:5050
2. Connexion : `admin@admin.com` / `admin`
3. Ajouter un nouveau serveur :
   - **Nom** : Subtrack
   - **Host** : pgsql
   - **Port** : 5432
   - **Database** : subtrack
   - **Username** : laravel
   - **Password** : secret

#### Backup et Restore

```bash
# Backup de la base de données
docker-compose exec pgsql pg_dump -U laravel subtrack > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore depuis un backup
docker-compose exec -T pgsql psql -U laravel subtrack < backup_20250129_120000.sql

# Backup avec compression
docker-compose exec pgsql pg_dump -U laravel subtrack | gzip > backup.sql.gz

# Restore depuis fichier compressé
gunzip -c backup.sql.gz | docker-compose exec -T pgsql psql -U laravel subtrack
```

---

## 🧪 Tests

### Tests Backend (Laravel)

```bash
# Exécuter tous les tests
docker-compose exec php php artisan test

# Avec couverture de code
docker-compose exec php php artisan test --coverage

# Tests spécifiques
docker-compose exec php php artisan test --filter SubscriptionTest

# Tests unitaires uniquement
docker-compose exec php php artisan test --testsuite Unit

# Tests fonctionnels uniquement
docker-compose exec php php artisan test --testsuite Feature

# Avec affichage détaillé
docker-compose exec php php artisan test --verbose
```

### Tests Frontend (Angular)

```bash
cd frontend

# Tests unitaires
npm run test

# Tests avec couverture
npm run test -- --code-coverage

# Tests en mode watch
npm run test -- --watch

# Tests end-to-end
npm run e2e
```

---

## 🌐 Déploiement

### Déploiement en Production

#### 1. Préparation Backend

```bash
# Optimiser Composer
composer install --optimize-autoloader --no-dev

# Mettre en cache les configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimiser l'autoloader
composer dump-autoload --optimize

# Générer la clé d'application (si nécessaire)
php artisan key:generate
```

#### 2. Build Frontend

```bash
cd frontend

# Build de production
npm run build-prod

# Les fichiers sont générés dans dist/
```

#### 3. Configuration Serveur Production

**Variables d'environnement** (`.env`) :

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_HOST=votre-db-host
DB_DATABASE=subtrack_prod
DB_USERNAME=votre-username
DB_PASSWORD=votre-password-secure

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email
MAIL_PASSWORD=votre-password
MAIL_ENCRYPTION=tls

STRIPE_KEY=pk_live_XXXXX
STRIPE_SECRET=sk_live_XXXXX
```

#### 4. Configuration Nginx Production

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/html/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass php:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### 5. Supervisor pour Queue Workers

Créer `/etc/supervisor/conf.d/subtrack-worker.conf` :

```ini
[program:subtrack-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Recharger Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start subtrack-worker:*
```

#### 6. Cron pour Scheduler

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne
* * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1
```

### Déploiement Automatisé (GitHub Actions)

Le frontend inclut un workflow GitHub Actions pour le déploiement automatique.

Fichier : `frontend/.github/workflows/prod.yml`

---

## 📚 Documentation API

### Endpoints Principaux

#### Authentification

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

```http
POST /api/logout
Authorization: Bearer {token}
```

#### Subscriptions

```http
GET /api/subscriptions
Authorization: Bearer {token}
```

```http
POST /api/subscriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Netflix",
  "price": 15.99,
  "billing_cycle": "monthly",
  "next_billing_date": "2025-02-01",
  "category": "Entertainment",
  "status": "active"
}
```

```http
GET /api/subscriptions/{id}
Authorization: Bearer {token}
```

```http
PUT /api/subscriptions/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Netflix Premium",
  "price": 19.99
}
```

```http
DELETE /api/subscriptions/{id}
Authorization: Bearer {token}
```

#### Analytics

```http
GET /api/analytics/overview
Authorization: Bearer {token}
```

```http
GET /api/analytics/spending?period=monthly
Authorization: Bearer {token}
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Ressource créée |
| 204 | Suppression réussie |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource introuvable |
| 422 | Erreur de validation |
| 500 | Erreur serveur |

---

## 🔧 Résolution des Problèmes

### Problème : Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d
```

### Problème : Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps pgsql

# Vérifier les logs PostgreSQL
docker-compose logs pgsql

# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d
docker-compose exec php php artisan migrate:fresh
```

### Problème : Erreur 500 sur l'API

```bash
# Voir les logs Laravel
docker-compose exec php tail -f storage/logs/laravel.log

# Vérifier les permissions
docker-compose exec php chmod -R 777 storage bootstrap/cache
```

### Problème : Le frontend ne se connecte pas à l'API

```bash
# Vérifier l'URL de l'API dans environment.ts
# Doit être : http://localhost:8080/api

# Vérifier les CORS dans backend/config/cors.php
```

### Problème : Les emails ne sont pas envoyés

```bash
# Vérifier MailHog
# Accéder à http://localhost:8025

# Voir les logs des jobs
docker-compose logs scheduler
docker-compose exec php php artisan queue:work --verbose
```

### Nettoyer Complètement l'Installation

```bash
# Arrêter et supprimer tout
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Nettoyer Docker
docker system prune -a --volumes

# Redémarrer proprement
docker-compose up -d --build
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

### 1. Fork le Projet

```bash
# Cliquez sur "Fork" sur GitHub
```

### 2. Créer une Branche

```bash
git checkout -b feature/amazing-feature
```

### 3. Committer vos Changements

```bash
git add .
git commit -m "feat: Add amazing feature"
```

### 4. Push vers la Branche

```bash
git push origin feature/amazing-feature
```

### 5. Ouvrir une Pull Request

Allez sur GitHub et ouvrez une Pull Request.

### Standards de Code

**Backend (PHP)** :
- Suivre PSR-12
- Utiliser Laravel Pint pour le formatage
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les méthodes publiques

**Frontend (Angular)** :
- Suivre le guide de style Angular
- Utiliser Prettier pour le formatage
- Respecter la structure de dossiers
- Écrire des tests unitaires

### Convention de Commits

Utiliser [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: Add new feature
fix: Fix bug in subscription service
docs: Update README
style: Format code
refactor: Refactor auth service
test: Add tests for analytics
chore: Update dependencies
```

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2025 Subtrack Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

### Support Technique

- **Email** : support@subtrack.com
- **Discord** : [Rejoindre notre serveur](https://discord.gg/subtrack)
- **Twitter** : [@SubtrackApp](https://twitter.com/subtrackapp)

### Documentation

- **Wiki** : [GitHub Wiki](https://github.com/votre-repo/wiki)
- **FAQ** : [Questions Fréquentes](https://github.com/votre-repo/wiki/FAQ)
- **Tutoriels** : [YouTube Channel](https://youtube.com/@subtrack)

### Signaler un Bug

Ouvrez une issue sur [GitHub Issues](https://github.com/votre-repo/issues) avec :
- Description détaillée du problème
- Étapes pour reproduire
- Logs d'erreur
- Environnement (OS, versions)

---

## 🙏 Remerciements

Nous tenons à remercier les technologies et projets open-source suivants :

- [Laravel](https://laravel.com) - The PHP Framework for Web Artisans
- [Angular](https://angular.io) - The Modern Web Developer's Platform
- [PostgreSQL](https://postgresql.org) - The World's Most Advanced Open Source Database
- [Docker](https://docker.com) - Accelerated Container Application Development
- [Berry Admin](https://berrydashboard.io) - Admin Dashboard Template
- [Tabler Icons](https://tabler-icons.io) - Beautiful Icon Set
- [Bootstrap](https://getbootstrap.com) - The Most Popular CSS Framework

---

## 📊 Statistiques du Projet

![GitHub stars](https://img.shields.io/github/stars/votre-repo/subtrack?style=social)
![GitHub forks](https://img.shields.io/github/forks/votre-repo/subtrack?style=social)
![GitHub issues](https://img.shields.io/github/issues/votre-repo/subtrack)
![GitHub pull requests](https://img.shields.io/github/issues-pr/votre-repo/subtrack)
![License](https://img.shields.io/github/license/votre-repo/subtrack)

---

## 🗺️ Roadmap

### Version 1.0 (Q1 2025) ✅
- [x] Gestion de base des abonnements
- [x] Authentification utilisateur
- [x] Dashboard analytique
- [x] Notifications email

### Version 1.5 (Q2 2025) 🚧
- [ ] Intégration Stripe
- [ ] Mode sombre
- [ ] Export de données
- [ ] API publique

### Version 2.0 (Q3 2025) 📅
- [ ] Application mobile
- [ ] Assistant IA
- [ ] Intégrations tierces
- [ ] Marketplace de templates

---

<p align="center">
  <strong>Fait avec ❤️ par l'équipe Subtrack</strong>
</p>

<p align="center">
  <a href="https://github.com/votre-repo/subtrack">⭐ Star ce projet sur GitHub</a>
</p>
