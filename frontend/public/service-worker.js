const CACHE_NAME = 'lelanation-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/fonts/beaufort.woff2',
  '/assets/images/lelariva.png',
  '/assets/images/lelariva-quality.png',
];

self.addEventListener('fetch', (event) => {
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