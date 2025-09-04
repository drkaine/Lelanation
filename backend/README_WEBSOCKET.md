# Système WebSocket pour Mises à Jour YouTube

## 🎯 Objectif

Ce système permet au frontend de recevoir des notifications en temps réel lorsque de nouvelles vidéos YouTube sont ajoutées, sans avoir besoin de rafraîchir manuellement la page ou de faire un `npm run build`.

## 🏗️ Architecture

### Backend (WebSocket Server)

- **Fichier**: `src/websocket/YouTubeUpdateNotifier.ts`
- **Fonction**: Gère les connexions WebSocket et envoie des notifications
- **Intégration**: Automatiquement initialisé dans `app.ts`

### Frontend (WebSocket Client)

- **Fichier**: `frontend/src/views/ShortView.vue`
- **Fonction**: Écoute les notifications et met à jour automatiquement l'affichage
- **Reconnexion**: Automatique en cas de déconnexion

## 🔄 Fonctionnement

### 1. Connexion WebSocket

- Le frontend se connecte automatiquement au WebSocket lors du chargement de la page
- Affichage du statut de connexion (🟢 connecté / 🔴 déconnecté)

### 2. Mise à Jour YouTube

- Quand le script YouTube met à jour les données (`fetchAndStoreVideos`)
- Le système détecte automatiquement les nouvelles vidéos
- Une notification WebSocket est envoyée à tous les clients connectés

### 3. Mise à Jour Frontend

- Le frontend reçoit la notification
- Les données sont automatiquement rechargées depuis l'API
- Une notification visuelle apparaît pour informer l'utilisateur

## 📡 Format des Messages

### Notification de Mise à Jour

```json
{
  "type": "youtube_update",
  "channelId": "UCz0D_xJRQamxRlTrec5j4oA",
  "channelName": "Lelariva",
  "videosAdded": 3,
  "totalVideos": 516,
  "lastVideoDate": "2025-08-25T15:00:44Z",
  "timestamp": 1692972044000
}
```

### Message de Connexion

```json
{
  "type": "connection_established",
  "message": "Connecté au système de notifications YouTube",
  "timestamp": 1692972044000
}
```

## 🧪 Tests

### Test WebSocket Simple

```bash
npm run websocket:test
```

### Test Complet (Mise à Jour + WebSocket)

```bash
npm run test:full-update
```

## 🚀 Utilisation

### Démarrage du Serveur

```bash
cd backend
npm run dev
```

### Test en Temps Réel

1. Ouvrir la page des vidéos dans le navigateur
2. Vérifier que le statut WebSocket affiche "🟢 Mises à jour en temps réel activées"
3. Exécuter une mise à jour YouTube : `npm run youtube:update`
4. Observer la notification automatique et la mise à jour de l'affichage

## 🔧 Configuration

### Reconnexion Automatique

- Tentatives de reconnexion : 5 maximum
- Délai exponentiel : 1s, 2s, 4s, 8s, 16s, 30s max
- Reconnexion automatique après déconnexion

### Notifications Visuelles

- Position : Coin supérieur droit
- Durée : 5 secondes
- Style : Notification verte avec bouton de fermeture
- Animation : Slide-in depuis la droite

## 🐛 Dépannage

### Problème de Connexion WebSocket

1. Vérifier que le serveur backend est démarré
2. Vérifier les logs du serveur pour les erreurs WebSocket
3. Vérifier la console du navigateur pour les erreurs de connexion

### Pas de Mise à Jour Automatique

1. Vérifier que le WebSocket est connecté (statut vert)
2. Vérifier que le script YouTube fonctionne correctement
3. Vérifier les logs pour les notifications envoyées

### Erreurs de Reconnexion

1. Vérifier la connectivité réseau
2. Vérifier que le serveur WebSocket est accessible
3. Redémarrer le serveur si nécessaire

## 📊 Monitoring

### Logs Serveur

- Connexions/déconnexions WebSocket
- Notifications envoyées
- Nombre de clients connectés

### Logs Frontend

- Tentatives de connexion WebSocket
- Messages reçus
- Erreurs de reconnexion

## 🔒 Sécurité

- Le WebSocket utilise le même protocole que l'application (HTTP/HTTPS)
- Pas d'authentification requise (données publiques)
- Validation des messages côté serveur
- Limitation du nombre de tentatives de reconnexion

## 🎉 Avantages

✅ **Mises à jour automatiques** - Plus besoin de `npm run build`  
✅ **Temps réel** - Notifications instantanées  
✅ **Reconnexion automatique** - Robustesse du système  
✅ **Interface utilisateur** - Feedback visuel des mises à jour  
✅ **Performance** - Pas de polling, économie de ressources  
✅ **Simplicité** - Fonctionne sans intervention manuelle
