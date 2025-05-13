# Redis dans Lelanation

Ce document explique comment Redis est utilisé dans l'application Lelanation pour améliorer les performances et la scalabilité.

## Présentation

Redis est une base de données en mémoire très rapide utilisée comme cache pour stocker des données fréquemment accédées, réduisant ainsi la charge sur le serveur principal et accélérant les temps de réponse.

## Configuration

Les paramètres de configuration Redis sont définis dans le fichier `.env` :

```
REDIS_URL=redis://127.0.0.1:6379  # URL de connexion à Redis
REDIS_CACHE_TTL=3600              # Durée de vie par défaut du cache (en secondes)
```

## Architecture

L'intégration de Redis comprend plusieurs composants :

### 1. Client Redis (`src/utils/redisClient.ts`)

Ce module fournit une interface unifiée pour interagir avec Redis :

- Connexion au serveur Redis
- Méthodes utilitaires pour get/set/delete des clés
- Gestion des erreurs

### 2. Middleware de Cache (`src/middleware/cacheMiddleware.ts`)

Deux middlewares principaux :

- **cacheMiddleware** : Met en cache les réponses des routes GET
- **invalidateCacheMiddleware** : Invalide le cache lors des opérations d'écriture (POST, PUT, DELETE)

## Stratégie de mise en cache

### Données mises en cache

- **Builds** : TTL de 3600s (1h) pour les builds individuels, 300s (5min) pour les listes
- **Dictionnaire** : TTL de 3600s (1h)
- **Analytics** : TTL court de 60s
- **TierList** : TTL de 1800s (30min)

### Clés de cache

Les clés de cache suivent un format standardisé :

- `cache:{url}` - Format par défaut
- `builds:{buildName}` - Pour les builds individuels
- `builds:lelariva:{buildName}` - Pour les builds Lelariva

### Invalidation du cache

Le cache est invalidé automatiquement dans les scénarios suivants :

- Création d'un nouveau build → Invalide `builds:*`
- Mise à jour d'un build → Invalide la clé spécifique
- Modification du dictionnaire → Invalide `dictionnaire:*`

## Headers de cache

Les réponses incluent des headers pour faciliter le débogage :

- `X-Cache: HIT` - Indique que la réponse provient du cache
- `X-Cache: MISS` - Indique que la réponse a été générée et mise en cache
- `X-Cache: BYPASS` - Indique une erreur dans le mécanisme de cache
- `X-Cache-Key` - Indique la clé utilisée pour le cache
- `X-Cache-Invalidated` - Liste les patterns de clés invalidés

## Monitoring

Pour surveiller l'efficacité du cache :

1. Utiliser les logs (les hits et misses sont journalisés)
2. Exécuter le script de benchmark Redis (`load-test/redis-benchmark.js`)
3. Suivre le ratio de cache hit/miss via les métriques d'application

## Commandes Redis utiles

```bash
# Se connecter au client Redis
redis-cli

# Voir toutes les clés
KEYS *

# Voir une clé spécifique
GET cache:/api/builds

# Supprimer toutes les clés liées aux builds
DEL `redis-cli keys "builds:*"`

# Vérifier les statistiques
INFO stats

# Surveiller les commandes Redis en temps réel
MONITOR
```

## Bonnes pratiques

1. Éviter de mettre en cache les données qui changent fréquemment
2. Définir des TTLs adaptés à la nature des données
3. Utiliser des clés descriptives et préfixées par domaine
4. Invalider le cache de manière ciblée
5. Surveiller l'utilisation mémoire de Redis
