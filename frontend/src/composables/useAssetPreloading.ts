import { onMounted } from 'vue'

const IMPORTANT_IMAGES = [
  '/assets/images/lelariva.webp',
  '/assets/images/lelariva.png',
  '/assets/images/lelariva-quality.png',
]

const COMMON_ICONS = ['']

const IMPORTANT_JSON_DATA = ['']

const DIRECTORIES_TO_PRELOAD = [
  {
    path: 'public/assets/icons',
    extensions: ['svg', 'png'],
    cacheName: 'images',
  },
  {
    path: 'public/assets/images',
    extensions: ['png', 'jpg', 'webp'],
    cacheName: 'images',
  },
  {
    path: 'public/assets/files',
    extensions: ['json'],
    cacheName: 'static-json',
  },
  {
    path: 'src/assets/files',
    extensions: ['json'],
    cacheName: 'static-json',
  },
  {
    path: 'data',
    extensions: ['json'],
    cacheName: 'static-json',
  },
]

export function useAssetPreloading(
  options = {
    preloadImages: true,
    preloadJsonData: true,
    preloadDirectories: true,
    enableApiPreloading: true,
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
        await cache.add(url)
        return true
      }
      return true
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('404')) {
        return false
      }
      console.warn(`Failed to preload asset ${url}:`, err)
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
        if (response.status !== 403) {
          console.warn(
            `Unable to list files in directory ${directory.path} (${response.status})`,
          )
        }
        return 0
      }

      const files: string[] = await response.json()

      if (files.length === 0) return 0

      const results = await Promise.allSettled(
        files.map(file => preloadFile(file, directory.cacheName)),
      )

      return results.filter(r => r.status === 'fulfilled' && r.value).length
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return 0
      }
      console.error(
        `Error during directory preloading ${directory.path}:`,
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

      void results.filter(r => r.status === 'fulfilled' && r.value).length

      if (options.preloadDirectories && options.enableApiPreloading) {
        const imageDirectories = DIRECTORIES_TO_PRELOAD.filter(
          dir => dir.cacheName === 'images',
        )

        for (const directory of imageDirectories) {
          await preloadDirectory(directory)
        }
      }
    } catch (error) {
      console.error('Error during image preloading:', error)
    }
  }

  const preloadJsonData = async () => {
    try {
      await Promise.allSettled(
        IMPORTANT_JSON_DATA.map(json => preloadFile(json, 'static-json')),
      )

      if (options.preloadDirectories && options.enableApiPreloading) {
        const jsonDirectories = DIRECTORIES_TO_PRELOAD.filter(
          dir => dir.cacheName === 'static-json',
        )

        for (const directory of jsonDirectories) {
          await preloadDirectory(directory)
        }
      }
    } catch (error) {
      console.error('Error during JSON data preloading:', error)
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
    }, 2000)
  })

  return {
    preloadImages,
    preloadJsonData,
    preloadAll,
  }
}
