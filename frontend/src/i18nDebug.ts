import i18n from './i18n'
import type { LocaleMessages, MessageStructure } from '@/types/i18n'

interface I18nGlobal {
  global: {
    locale: string
    availableLocales: string[]
    t: (key: string) => string
    getLocaleMessage: (locale: string) => LocaleMessages
    setLocaleMessage: (
      locale: string,
      messages: Record<string, unknown>,
    ) => void
  }
}

export function checkTranslations() {
  const i18nAny = i18n as unknown as I18nGlobal

  const result = {
    loaded: false,
    locale: i18nAny.global.locale,
    availableLocales: i18nAny.global.availableLocales,
    sampleTranslations: {} as Record<string, string>,
    messageStructure: {} as MessageStructure,
    errors: [] as string[],
  }

  try {
    const currentMessages = i18nAny.global.getLocaleMessage(
      i18nAny.global.locale,
    )
    result.loaded = !!currentMessages && Object.keys(currentMessages).length > 0

    const testKeys = [
      'home.title',
      'navigation.home',
      'button.next',
      'legal.accept',
    ]
    testKeys.forEach(key => {
      try {
        result.sampleTranslations[key] = i18nAny.global.t(key)
      } catch (e) {
        result.errors.push(`Failed to translate ${key}: ${e}`)
        result.sampleTranslations[key] = 'ERROR'
      }
    })

    if (currentMessages.home && currentMessages.home.title) {
      result.messageStructure['home.title exists'] = true
      result.messageStructure['home.title value'] = currentMessages.home.title
    } else {
      result.messageStructure['home.title exists'] = false
      result.errors.push('home.title path not found in messages')
    }

    try {
      const frMessages = i18nAny.global.getLocaleMessage('fr')
      const enMessages = i18nAny.global.getLocaleMessage('en')

      if (frMessages) {
        result.messageStructure['fr loaded'] = true
        result.messageStructure['fr.home.title'] =
          frMessages.home && frMessages.home.title
            ? frMessages.home.title
            : 'missing'
      }

      if (enMessages) {
        result.messageStructure['en loaded'] = true
        result.messageStructure['en.home.title'] =
          enMessages.home && enMessages.home.title
            ? enMessages.home.title
            : 'missing'
      }
    } catch (e) {
      result.errors.push(`Error accessing messages: ${e}`)
    }
  } catch (e) {
    result.errors.push(`General error: ${e}`)
  }

  return result
}

export function forceReloadTranslations() {
  const i18nAny = i18n as unknown as I18nGlobal
  const currentLocale = i18nAny.global.locale

  try {
    import('./i18n/locales/fr.json').then(fr => {
      i18nAny.global.setLocaleMessage('fr', fr.default)
    })

    import('./i18n/locales/en.json').then(en => {
      i18nAny.global.setLocaleMessage('en', en.default)
    })

    const tempLocale = currentLocale === 'fr' ? 'en' : 'fr'
    i18nAny.global.locale = tempLocale

    setTimeout(() => {
      i18nAny.global.locale = currentLocale
    }, 100)

    return true
  } catch (e) {
    console.error('Failed to force reload translations:', e)
    return false
  }
}
