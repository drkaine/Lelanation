# Tests de charge pour Lelanation

Ce dossier contient des scripts pour tester la performance et la charge de l'application Lelanation.

## Prérequis

- [k6](https://k6.io/docs/get-started/installation/) doit être installé sur votre système
- Accès aux URLs de test (frontend et API)

## Structure des fichiers

- `run-load-tests.sh` : Script principal pour lancer les tests
- `loadtest.js` : Test de navigation frontend
- `api-loadtest.js` : Test des APIs principales
- `build-creation-loadtest.js` : Test spécifique de création de builds

## Comment exécuter les tests

1. Rendez-vous dans le dossier load-test:
   ```bash
   cd load-test
   ```

2. Lancez le script principal:
   ```bash
   ./run-load-tests.sh
   ```

3. Suivez les instructions à l'écran pour choisir les tests à exécuter

## Types de tests disponibles

1. **Test du Frontend** : Simule des utilisateurs naviguant sur le site
2. **Test des APIs** : Teste les endpoints principaux de l'API
3. **Test de création de builds** : Teste spécifiquement la création et la récupération de builds

## Analyse des résultats

Les résultats sont enregistrés au format JSON dans un dossier daté à la racine du projet. Vous pouvez les visualiser avec:

```bash
k6 view ../load-test-results-DATE/nom-du-test-results.json
```

## Résolution des problèmes courants

### Erreurs HTTP 100%
- Vérifiez que les URLs sont correctes
- Vérifiez que le serveur est en cours d'exécution
- Examinez les logs du serveur pour des erreurs spécifiques

### Builds échouent mais les requêtes HTTP réussissent
- La structure de la réponse ne correspond peut-être pas à celle attendue par le test
- Vérifiez les logs du serveur pour comprendre le format des données

### Tests trop intensifs
- Modifiez les paramètres dans les fichiers JS pour réduire la charge:
  - Réduisez le nombre d'utilisateurs virtuels (VUs) dans les options
  - Augmentez les délais entre les requêtes 