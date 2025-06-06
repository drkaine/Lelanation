# Configuration Discord Webhook

Pour activer le partage vers Discord, vous devez configurer un webhook Discord et ajouter la variable d'environnement correspondante.

## Étapes de configuration

1. **Créer un webhook Discord :**

   - Allez sur votre serveur Discord
   - Cliquez sur la roue dentée du canal où vous voulez recevoir les messages
   - Allez dans "Intégrations" > "Webhooks"
   - Cliquez sur "Nouveau webhook"
   - Copiez l'URL du webhook

2. **Configurer la variable d'environnement :**
   Ajoutez cette ligne à votre fichier `.env` :

   ```
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
   ```

3. **Redémarrer le serveur :**
   Le serveur backend doit être redémarré pour prendre en compte la nouvelle variable.

## Format du message

Le message partagé sur Discord aura le format suivant :

- **Builds utilisateur :** "✨ Découvrez le build de {author} pour {champion} {roles}"
- **Builds certifiés :** "✨ Découvrez le build de {author} reconnu par Lelariva pour {champion} {roles}"
- **Builds Lelariva :** "✨ Découvrez le build de {champion} proposé par Lelariva pour {champion} {roles}"

Le message inclut également la description, la version et l'URL du build.

## Sécurité

⚠️ **Important :** Ne partagez jamais l'URL de votre webhook Discord publiquement. Gardez-la dans vos variables d'environnement uniquement.
