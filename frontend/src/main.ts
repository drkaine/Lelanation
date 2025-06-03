import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import i18n from './i18n'
import { directTranslation, installGlobalTranslation } from './i18nCompat'

import App from './App.vue'
import router from './router'

interface I18nGlobal {
  global: {
    locale: string | undefined
    t: (key: string) => string
  }
}

const app = createApp(App)
const head = createHead()

app.use(i18n)
app.use(head)

app.use(createPinia())
app.use(router)

installGlobalTranslation(app)

app.config.globalProperties.$t = directTranslation

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string) => string
  }
}

try {
  const i18nAny = i18n as unknown as I18nGlobal
  if (i18nAny.global) {
    const currentLocale = i18nAny.global.locale || 'fr'
    i18nAny.global.locale = currentLocale

    i18nAny.global.t = directTranslation
  }
} catch (e) {
  console.error('Error setting i18n:', e)
}

if (import.meta.env.DEV) {
  router.afterEach(to => {
    setTimeout(() => {
      const title = document.title
      const description = document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')

      if (!title || title === 'Lelanation') {
        console.warn(
          `[SEO] Titre manquant ou générique pour la route: ${to.path}`,
        )
      }

      if (!description) {
        console.warn(
          `[SEO] Meta description manquante pour la route: ${to.path}`,
        )
      }

      const canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        console.warn(`[SEO] Lien canonical manquant pour la route: ${to.path}`)
      }
    }, 100)
  })
}

app.mount('#app')

declare global {
  interface Window {
    clearCaches: () => Promise<boolean>
  }
}

if ('serviceWorker' in navigator) {
  const buildId = import.meta.env.VITE_BUILD_ID || Date.now().toString()
  navigator.serviceWorker
    .register('/service-worker.js?v=' + buildId)
    .catch(error => {
      console.error("Erreur lors de l'enregistrement du Service Worker:", error)
    })

  window.clearCaches = async () => {
    if (!('caches' in window)) {
      console.error('API Cache non supportée par ce navigateur')
      return false
    }

    try {
      const cacheNames = await window.caches.keys()
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))

      return true
    } catch (error) {
      console.error('Erreur lors du nettoyage des caches:', error)
      return false
    }
  }
}
