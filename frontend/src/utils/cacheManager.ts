/**
 * Gestionnaire de cache pour le frontend
 * Permet de gérer les caches du service worker
 */

interface CacheInfo {
  name: string
  description: string
}

// Liste des caches utilisés par l'application
const CACHES: CacheInfo[] = [
  { name: 'images', description: 'Images mises en cache' },
  { name: 'static-json', description: 'Données JSON statiques' },
  { name: 'api-cache', description: 'Réponses API mises en cache' },
]

/**
 * Récupère les informations sur tous les caches
 */
export async function getCacheStats() {
  if (!('caches' in window)) {
    return { error: 'Cache API non supportée par ce navigateur' }
  }

  const stats: Record<string, { size: number; urls: string[] }> = {}

  try {
    for (const cache of CACHES) {
      const cacheStorage = await caches.open(cache.name)
      const keys = await cacheStorage.keys()
      const urls = keys.map(request => request.url)

      stats[cache.name] = {
        size: urls.length,
        urls,
      }
    }

    return stats
  } catch (error) {
    console.error('Erreur lors de la récupération des stats de cache:', error)
    return { error: 'Impossible de récupérer les stats de cache' }
  }
}

/**
 * Nettoie un cache spécifique
 */
export async function clearCache(cacheName: string) {
  if (!('caches' in window)) {
    return { error: 'Cache API non supportée par ce navigateur' }
  }

  try {
    const cacheExists = CACHES.some(cache => cache.name === cacheName)
    if (!cacheExists) {
      return { error: `Cache "${cacheName}" non reconnu` }
    }

    await caches.delete(cacheName)
    return { success: true, message: `Cache "${cacheName}" vidé avec succès` }
  } catch (error) {
    console.error(`Erreur lors du nettoyage du cache "${cacheName}":`, error)
    return { error: `Impossible de vider le cache "${cacheName}"` }
  }
}

/**
 * Nettoie tous les caches
 */
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return { error: 'Cache API non supportée par ce navigateur' }
  }

  try {
    const results = await Promise.all(
      CACHES.map(async cache => {
        await caches.delete(cache.name)
        return cache.name
      }),
    )

    return {
      success: true,
      message: `Tous les caches vidés avec succès`,
      clearedCaches: results,
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage des caches:', error)
    return { error: 'Impossible de vider tous les caches' }
  }
}

/**
 * Précharge un fichier dans le cache
 */
export async function preloadToCache(url: string, cacheName: string) {
  if (!('caches' in window)) {
    return { error: 'Cache API non supportée par ce navigateur' }
  }

  try {
    const cacheExists = CACHES.some(cache => cache.name === cacheName)
    if (!cacheExists) {
      return { error: `Cache "${cacheName}" non reconnu` }
    }

    const cache = await caches.open(cacheName)
    await cache.add(url)

    return {
      success: true,
      message: `URL "${url}" mise en cache dans "${cacheName}"`,
    }
  } catch (error) {
    console.error(`Erreur lors de la mise en cache de "${url}":`, error)
    return { error: `Impossible de mettre en cache "${url}"` }
  }
}
