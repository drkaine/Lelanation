self.addEventListener('install', event => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.keys().then(cacheNames => {

      return Promise.all(
        cacheNames.map(cacheName => {

          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
}); 