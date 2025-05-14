import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
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

app.use(i18n)

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
    .then(registration => {
      console.log('Service Worker enregistré avec succès:', registration)
    })
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
      console.log('Tous les caches ont été vidés avec succès')
      return true
    } catch (error) {
      console.error('Erreur lors du nettoyage des caches:', error)
      return false
    }
  }
}
