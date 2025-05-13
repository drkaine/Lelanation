# Guide de déploiement du cache pour Lelanation

Ce document explique comment déployer et configurer le système de cache pour supporter la charge du front-end et du back-end de l'application Lelanation.

## Vue d'ensemble

Le système de cache de Lelanation se compose de trois niveaux:

1. **Cache Redis** - Cache en mémoire côté serveur pour les données API
2. **Cache HTTP** - En-têtes de cache pour le navigateur et les CDN
3. **Monitoring** - Surveillance des performances du cache

## Prérequis

- Redis 7.0+ installé sur le serveur
- Node.js 18+
- NPM 8+

## Installation

### 1. Installation de Redis

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# CentOS/RHEL
sudo yum install redis

# Vérification de l'installation
redis-cli ping
# Doit répondre "PONG"
```

### 2. Installation des dépendances Node.js

```bash
cd backend
npm install redis compression @types/compression
```

### 3. Configuration de Redis

Copiez le fichier de configuration optimisé vers Redis:

```bash
sudo cp backend/redis-optimized.conf /etc/redis/redis.conf
sudo systemctl restart redis-server
```

### 4. Configuration de l'environnement

Créez ou modifiez le fichier `.env` dans le dossier backend:

```
PORT=3500

# Configuration Redis
REDIS_URL=redis://127.0.0.1:6379
REDIS_CACHE_TTL=3600

# Environnement
NODE_ENV=production
SERVE_STATIC=false
```

## Structure du cache

### Niveaux de cache

1. **Cache Redis pour API**

   - TTL court (60s) pour données fréquemment mises à jour (analytics)
   - TTL moyen (300s) pour listes (builds, tierlists)
   - TTL long (3600s) pour données stables (builds individuels, dictionnaire)

2. **Cache HTTP**
   - Assets statiques: 24 heures avec stale-while-revalidate
   - Données API: 5 minutes
   - Données fréquentes: 1 minute

### Clés Redis

- `cache:{url}` - Format par défaut
- `builds:{buildName}` - Pour les builds individuels
- `builds:lelariva:{buildName}` - Pour les builds Lelariva
- `dictionnaire:*` - Pour les entrées du dictionnaire
- `analytics:*` - Pour les données d'analytics

## Démarrage et Vérification

1. **Démarrage du serveur**

```bash
cd backend
npm start
```

2. **Vérification du cache Redis**

```bash
redis-cli
> KEYS *
> GET cache:/api/builds
```

3. **Vérification des métriques**

Accédez à `http://votre-serveur:3500/api/metrics/cache` pour voir les statistiques.

## Maintenance

### Surveillance du cache

- **Métriques HTTP**: Vérifiez les en-têtes `X-Cache` et `X-Response-Time`
- **Métriques Redis**: Accédez à `/api/metrics/cache`

### Nettoyage périodique

Un nettoyage automatique est programmé tous les jours à 04h00 via cron.

Pour nettoyer manuellement:

```bash
cd backend
npx ts-node src/scripts/redisCacheMaintenance.ts
```

## Optimisations avancées

### 1. Mise à l'échelle

Pour les déploiements à grande échelle, envisagez:

- Redis Cluster pour distribuer la charge
- Redis Sentinel pour la haute disponibilité

### 2. Optimisation de la mémoire

Ajustez `maxmemory` dans redis.conf:

```
maxmemory 512mb  # Pour les serveurs avec plus de RAM
```

### 3. Compression

Activez la compression HTTP pour réduire la taille des réponses:

```
npm install compression
```

Puis décommentez dans `app.ts`:

```typescript
import compression from "compression";
app.use(compression());
```

## Résolution des problèmes

### Redis ne démarre pas

```bash
sudo systemctl status redis-server
sudo journalctl -u redis-server
```

### Cache ne fonctionne pas

Vérifiez les logs et l'endpoint `/api/health` pour confirmer que Redis est connecté.

### Performances faibles

1. Vérifiez le ratio de hits/miss via `/api/metrics/cache`
2. Ajustez les TTLs dans les middlewares
3. Augmentez la mémoire allouée à Redis
