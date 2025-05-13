import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'
import laranguiva from './locales/laranguiva.json'

export type Locale = 'fr' | 'en' | 'laranguiva'

export interface I18nInternal {
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
    const i18nAny = i18n as unknown as I18nInternal
    i18nAny.global.locale = locale

    localStorage.setItem('locale', locale)
    document.querySelector('html')?.setAttribute('lang', locale)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('languageChanged', { detail: locale }),
      )
    }
  } catch (error) {
    console.error('[i18n] Failed to change locale:', error)
  }
}

const i18nAny = i18n as unknown as I18nInternal
if (i18nAny.global.locale !== defaultLocale) {
  i18nAny.global.locale = defaultLocale
}

if (typeof window !== 'undefined') {
  // @ts-expect-error - Adding i18n to window for debugging
  window._i18n = i18n
  // @ts-expect-error - Adding setLocale to window for debugging
  window._setLocale = setLocale
}

export default i18n
