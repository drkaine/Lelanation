import { onMounted } from 'vue'

const IMPORTANT_IMAGES = ['/public/assets/images/lelariva.png']

const COMMON_ICONS = ['']

const IMPORTANT_JSON_DATA = ['/data/champions.json', '/data/items.json']

const DIRECTORIES_TO_PRELOAD = [
  {
    path: '/public/assets/icons',
    extensions: ['svg', 'png'],
    cacheName: 'images',
  },
  {
    path: '/public/assets/images',
    extensions: ['png', 'jpg', 'webp'],
    cacheName: 'images',
  },
  {
    path: '/public/assets/files',
    extensions: ['json'],
    cacheName: 'static-json',
  },
  { path: '/src/assets/files', extensions: ['json'], cacheName: 'static-json' },
  { path: '/data', extensions: ['json'], cacheName: 'static-json' },
]

export function useAssetPreloading(
  options = {
    preloadImages: true,
    preloadJsonData: true,
    preloadDirectories: true,
  },
) {
  const preloadFile = async (
    url: string,
    cacheName: string,
  ): Promise<boolean> => {
    try {
      const cache = await caches.open(cacheName)
      const cachedResponse = await cache.match(url)

      if (!cachedResponse) {
        console.log(`Préchargement: ${url}`)
        await cache.add(url)
        return true
      }
      return true
    } catch (err) {
      console.warn(`Échec du préchargement de ${url}:`, err)
      return false
    }
  }

  const preloadDirectory = async (directory: {
    path: string
    extensions: string[]
    cacheName: string
  }): Promise<number> => {
    try {
      const extensionsParam = directory.extensions.join(',')
      const response = await fetch(
        `/api/assets/list?directory=${encodeURIComponent(directory.path)}&extensions=${extensionsParam}`,
      )

      if (!response.ok) {
        console.warn(
          `Impossible de lister les fichiers du répertoire ${directory.path}`,
        )
        return 0
      }

      const files: string[] = await response.json()
      console.log(`${files.length} fichiers trouvés dans ${directory.path}`)

      if (files.length === 0) return 0

      const results = await Promise.allSettled(
        files.map(file => preloadFile(file, directory.cacheName)),
      )

      return results.filter(r => r.status === 'fulfilled' && r.value).length
    } catch (error) {
      console.error(
        `Erreur lors du préchargement du répertoire ${directory.path}:`,
        error,
      )
      return 0
    }
  }

  const preloadImages = async () => {
    try {
      const specificImages = [...IMPORTANT_IMAGES, ...COMMON_ICONS]

      const results = await Promise.allSettled(
        specificImages.map(image => preloadFile(image, 'images')),
      )

      const successful = results.filter(
        r => r.status === 'fulfilled' && r.value,
      ).length
      console.log(
        `Préchargement des images spécifiques: ${successful}/${specificImages.length} réussies`,
      )

      if (options.preloadDirectories) {
        const imageDirectories = DIRECTORIES_TO_PRELOAD.filter(
          dir => dir.cacheName === 'images',
        )
        let totalPreloaded = 0

        for (const directory of imageDirectories) {
          const preloaded = await preloadDirectory(directory)
          totalPreloaded += preloaded
          console.log(
            `Préchargement de ${directory.path}: ${preloaded} fichiers mis en cache`,
          )
        }

        console.log(
          `Préchargement des répertoires d'images terminé: ${totalPreloaded} fichiers au total`,
        )
      }
    } catch (error) {
      console.error('Erreur lors du préchargement des images:', error)
    }
  }

  const preloadJsonData = async () => {
    try {
      const results = await Promise.allSettled(
        IMPORTANT_JSON_DATA.map(json => preloadFile(json, 'static-json')),
      )

      const successful = results.filter(
        r => r.status === 'fulfilled' && r.value,
      ).length
      console.log(
        `Préchargement des JSON spécifiques: ${successful}/${IMPORTANT_JSON_DATA.length} réussis`,
      )

      if (options.preloadDirectories) {
        const jsonDirectories = DIRECTORIES_TO_PRELOAD.filter(
          dir => dir.cacheName === 'static-json',
        )
        let totalPreloaded = 0

        for (const directory of jsonDirectories) {
          const preloaded = await preloadDirectory(directory)
          totalPreloaded += preloaded
          console.log(
            `Préchargement de ${directory.path}: ${preloaded} fichiers mis en cache`,
          )
        }

        console.log(
          `Préchargement des répertoires JSON terminé: ${totalPreloaded} fichiers au total`,
        )
      }
    } catch (error) {
      console.error('Erreur lors du préchargement des données JSON:', error)
    }
  }

  const preloadAll = async () => {
    await Promise.all([
      options.preloadImages ? preloadImages() : Promise.resolve(),
      options.preloadJsonData ? preloadJsonData() : Promise.resolve(),
    ])
    return true
  }

  onMounted(async () => {
    setTimeout(async () => {
      await preloadAll()
    }, 2000) // Délai de 2 secondes après le montage
  })

  return {
    preloadImages,
    preloadJsonData,
    preloadAll,
  }
}
