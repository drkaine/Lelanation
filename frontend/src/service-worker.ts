import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope & typeof globalThis

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({ request }: { request: Request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }),
    ],
  }),
)

// Ne pas mettre en cache les JSON statiques car ils sont déjà bundlés dans le JavaScript
// Les fichiers JSON dans /assets/files/data/ sont importés statiquement et inclus dans le bundle
registerRoute(
  ({ url }: { url: URL }) =>
    url.pathname.endsWith('.json') && 
    !url.pathname.startsWith('/api') &&
    !url.pathname.includes('/assets/files/data/'), // Exclure les JSON bundlés
  new CacheFirst({
    cacheName: 'static-json',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 1 * 60 * 60, // 1 heure seulement pour les autres JSON
      }),
    ],
  }),
)

registerRoute(
  ({ url }: { url: URL }) => url.pathname.startsWith('/api'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 jour maximum dans le cache
      }),
    ],
  }),
)
