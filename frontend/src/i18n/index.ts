import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'
import laranguiva from './locales/laranguiva.json'

export type Locale = 'fr' | 'en' | 'laranguiva'

interface I18nGlobal {
  global: {
    locale: string
  }
}

const savedLocale =
  typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null
const defaultLocale: Locale = (savedLocale as Locale) || 'fr'

const i18n = createI18n({
  legacy: true,
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages: {
    fr,
    en,
    laranguiva,
  },
  silentTranslationWarn: false,
  fallbackWarn: false,
  missingWarn: true,
})

export function setLocale(locale: Locale) {
  try {
    const i18nAny = i18n as unknown as I18nGlobal
    i18nAny.global.locale = locale

    localStorage.setItem('locale', locale)
    document.querySelector('html')?.setAttribute('lang', locale)
  } catch (error) {
    console.error('Failed to change locale:', error)
  }
}

const i18nAny = i18n as unknown as I18nGlobal
if (i18nAny.global.locale !== defaultLocale) {
  i18nAny.global.locale = defaultLocale
}

export default i18n
