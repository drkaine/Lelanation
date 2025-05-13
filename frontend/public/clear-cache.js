// Script de nettoyage du cache navigateur
// Ce fichier sera servi à /clear-cache.js

// Nettoyer tous les caches du service worker
self.addEventListener('install', event => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('Nettoyage des caches:', cacheNames);
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log(`Suppression du cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('Cache nettoyé avec succès!');
}); 