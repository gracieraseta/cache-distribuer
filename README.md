# Cache Distribué pour la Performance

API REST Node.js avec cache Redis distribué pour améliorer les performances.

## Architecture

Client → API Express → Cache Redis → Base de données

## Prérequis

- Docker Desktop
- Node.js 20+
- Git

## Installation

### 1. Cloner le projet

git clone https://github.com/gracieraseta/cache-distribuer.git
cd cache-distribuer

### 2. Installer les dépendances

npm install

### 3. Lancer avec Docker

docker-compose up -d

L'API est disponible sur http://localhost:3000

## Utilisation

### Récupérer un produit (avec cache)

GET http://localhost:3000/api/produits/1

- Premier appel → source: "BASE DE DONNÉES"
- Appels suivants → source: "CACHE" (réponse moins de 1ms)

### Invalider le cache

DELETE http://localhost:3000/api/cache/1

### Statistiques Redis

GET http://localhost:3000/api/stats

## Tests

npm test

5 tests automatisés couvrant : HIT/MISS cache, 404, invalidation.

## CI/CD

Pipeline GitHub Actions automatique à chaque push sur main :
- Démarre Redis
- Installe les dépendances
- Lance les tests

## Maintenance

### Voir les logs
docker-compose logs -f

### Redémarrer les conteneurs
docker-compose restart

### Rollback
git log --oneline
git checkout <commit-id>
docker-compose up -d --build

### Vider tout le cache Redis
docker exec redis-cache redis-cli FLUSHALL

## Choix techniques

Redis → Cache in-memory ultra-rapide, TTL natif
Express → Léger, rapide, idéal pour API REST
Docker → Environnement reproductible
Jest → Tests simples et puissants pour Node.js
GitHub Actions → CI/CD gratuit et intégré à GitHub