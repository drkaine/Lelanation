# YouTube Channel Management Scripts

Ce dossier contient tous les scripts pour gérer les chaînes YouTube et récupérer leurs vidéos.

## 🚀 Scripts Disponibles

### 1. **Manager Interactif** (Recommandé)
```bash
npm run youtube:manager
```
Interface interactive avec menu pour toutes les opérations.

### 2. **Afficher le Statut des Chaînes**
```bash
npm run youtube:status
```
Affiche l'état actuel de toutes les chaînes avec statistiques détaillées.

### 3. **Mise à Jour Intelligente**
```bash
npm run youtube:update-all
```
Met à jour toutes les chaînes :
- ✅ Chaînes complètes : cherche seulement les nouvelles vidéos
- ⚠️ Chaînes incomplètes : force la complétion

### 4. **Force Complétion de Toutes les Chaînes**
```bash
npm run youtube:force-complete-all
```
⚠️ **ATTENTION** : Récupère TOUTES les vidéos manquantes pour toutes les chaînes.
Peut prendre beaucoup de temps et consommer du quota API.

### 5. **Ajouter LelarivaExtra**
```bash
npm run youtube:add-lelarivaextra
```
Ajoute automatiquement la chaîne LelarivaExtra.

## 📊 Fonctionnalités

### **Système de Complétion Intelligente**
- Les chaînes sont marquées comme "complètes" quand toutes les anciennes vidéos sont récupérées
- Les chaînes complètes ne cherchent que les nouvelles vidéos (plus rapide)
- Les chaînes incomplètes récupèrent toutes les vidéos manquantes

### **Gestion des Quotas API**
- Pauses automatiques entre les requêtes
- Suivi du quota consommé
- Gestion des erreurs API

### **Statistiques Détaillées**
- Nombre de vidéos récupérées vs total YouTube
- Taux de complétion par chaîne
- Statistiques des chaînes (abonnés, vues totales)

## 🎯 Utilisation Recommandée

### **Première Utilisation**
1. ```bash
   npm run youtube:status
   ```
   Vérifier l'état actuel des chaînes

2. ```bash
   npm run youtube:force-complete-all
   ```
   Récupérer toutes les anciennes vidéos manquantes

### **Utilisation Quotidienne**
```bash
npm run youtube:update-all
```
Met à jour toutes les chaînes avec les nouvelles vidéos uniquement.

### **Ajout d'une Nouvelle Chaîne**
1. Via l'interface d'administration (recommandé)
2. Ou via le manager interactif : `npm run youtube:manager`

## 🔧 Configuration

### **Variables d'Environnement**
Assurez-vous d'avoir configuré :
```env
YOUTUBE_API_KEY=votre_clé_api_youtube
```

### **Fichiers de Données**
- `frontend/src/assets/files/data/youtube.json` : Stockage des vidéos et métadonnées
- `frontend/src/assets/files/data/token-state.json` : État des tokens API

## 📈 Monitoring

### **Logs Détaillés**
Tous les scripts affichent :
- Progression en temps réel
- Statistiques par chaîne
- Erreurs et avertissements
- Résumé final

### **Métriques**
- Nombre de vidéos par chaîne
- Taux de complétion
- Quota API consommé
- Temps d'exécution

## ⚠️ Limitations

### **Quota API YouTube**
- Limite quotidienne : 10,000 unités
- Chaque requête coûte 100 unités
- Les scripts incluent des pauses pour éviter les dépassements

### **Temps d'Exécution**
- Complétion forcée : peut prendre plusieurs heures pour de grosses chaînes
- Mise à jour normale : quelques minutes

## 🛠️ Dépannage

### **Erreur de Quota API**
```bash
npm run youtube:status
```
Vérifier l'état et attendre le reset quotidien.

### **Chaîne Non Trouvée**
Vérifier le nom d'utilisateur dans l'URL YouTube :
- ✅ `@LelarivaExtra` (avec @)
- ❌ `LelarivaExtra` (sans @)

### **Vidéos Manquantes**
```bash
npm run youtube:force-complete-all
```
Force la récupération de toutes les vidéos manquantes.

## 📝 Exemples d'Utilisation

### **Scénario 1 : Nouvelle Installation**
```bash
# 1. Vérifier l'état
npm run youtube:status

# 2. Compléter toutes les chaînes
npm run youtube:force-complete-all

# 3. Vérifier le résultat
npm run youtube:status
```

### **Scénario 2 : Maintenance Quotidienne**
```bash
# Mise à jour automatique
npm run youtube:update-all
```

### **Scénario 3 : Ajout de Chaîne**
```bash
# Via le manager interactif
npm run youtube:manager
# Puis option 4
```

## 🎉 Résultat

Après exécution, vous aurez :
- ✅ Toutes les vidéos des chaînes configurées
- 📊 Statistiques détaillées
- 🔄 Système de mise à jour automatique
- 🎬 Interface d'administration fonctionnelle
