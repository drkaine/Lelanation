import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'
import laranguiva from './locales/laranguiva.json'

type Locale = 'fr' | 'en' | 'laranguiva'

// Get the saved locale or default to 'fr'
const savedLocale = localStorage.getItem('locale') as Locale
const defaultLocale = savedLocale || 'fr'

const messages = {
  fr,
  en,
  laranguiva
}

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: false,
  fallbackWarn: false,
  runtimeOnly: true,
  globalInjection: true,
  allowComposition: true,
  sync: true
})

// Exporter une fonction pour changer de langue
export async function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  // Force reload to ensure all components are updated
  window.location.reload()
}

// Log the current configuration
console.log('i18n configuration:', {
  currentLocale: i18n.global.locale.value,
  availableLocales: Object.keys(messages),
  messages: messages
})

export default i18n 