import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'
import { directTranslation, installGlobalTranslation } from './i18nCompat'

import App from './App.vue'
import router from './router'

// Create app instance
const app = createApp(App)

// Register i18n first
app.use(i18n)

// Register other plugins
app.use(createPinia())
app.use(router)

// Install our direct translation function as the global $t
installGlobalTranslation(app);

// Explicitly add $t to global properties to ensure it's available
app.config.globalProperties.$t = directTranslation;

// Explicitly define $t to ensure TypeScript compatibility
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string) => string;
  }
}

// Force direct setting of locale to ensure it's properly applied
try {
  const i18nAny = i18n as any
  if (i18nAny.global) {
    const currentLocale = i18nAny.global.locale || 'fr'
    i18nAny.global.locale = currentLocale
    
    // Override the Vue I18n global t function with our direct implementation
    i18nAny.global.t = directTranslation
  }
} catch (e) {
  console.error('Error setting i18n:', e)
}

// Mount app after all setup is complete
app.mount('#app')
