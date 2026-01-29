// Version du cache - incrémenter pour forcer la mise à jour
const CACHE_NAME = 'lelanation-cache-v2';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ne pas mettre en cache les JSON de données de jeu (déjà bundlés)
  if (url.pathname.endsWith('.json') && 
      (url.pathname.includes('/assets/files/data/') || 
       url.pathname.includes('championFull') || 
       url.pathname.includes('item.json') ||
       url.pathname.includes('runesReforged'))) {
    // Toujours récupérer depuis le réseau pour les JSON de données
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 