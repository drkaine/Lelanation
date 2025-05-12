import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'
import laranguiva from './locales/laranguiva.json'

export type Locale = 'fr' | 'en' | 'laranguiva'

// Handle browser environment safely
const savedLocale = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null
const defaultLocale: Locale = (savedLocale as Locale) || 'fr'

// Create i18n instance with legacy: true for Vue template compatibility
const i18n = createI18n({
  legacy: true, // Critical for template usage with $t
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages: {
    fr,
    en,
    laranguiva
  },
  silentTranslationWarn: false,
  fallbackWarn: false,
  missingWarn: true
})

// Function to change locale
export function setLocale(locale: Locale) {
  try {
    // Cast to any to fix TypeScript errors with legacy mode
    const i18nAny = i18n as any;
    i18nAny.global.locale = locale;
    
    localStorage.setItem('locale', locale)
    document.querySelector('html')?.setAttribute('lang', locale)
  } catch (error) {
    console.error('Failed to change locale:', error)
  }
}

// Force initial locale setting to ensure it's properly applied
const i18nAny = i18n as any
if (i18nAny.global.locale !== defaultLocale) {
  i18nAny.global.locale = defaultLocale
}

export default i18n 