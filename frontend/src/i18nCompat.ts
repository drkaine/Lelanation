import i18n from './i18n'
import type { App } from 'vue'

interface I18nGlobal {
  global: {
    locale: string
    getLocaleMessage: (locale: string) => Record<string, unknown>
  }
}

const i18nAny = i18n as unknown as I18nGlobal

let frMessages: Record<string, unknown> | null = null
let enMessages: Record<string, unknown> | null = null
let laranguivaMessages: Record<string, unknown> | null = null

function loadMessages() {
  try {
    frMessages = i18nAny.global.getLocaleMessage('fr')
    enMessages = i18nAny.global.getLocaleMessage('en')
    laranguivaMessages = i18nAny.global.getLocaleMessage('laranguiva')
  } catch (e) {
    console.error('Failed to load translation messages:', e)
  }
}

function getNestedValue(
  obj: Record<string, unknown> | null,
  path: string,
): string | undefined {
  if (!obj) return undefined

  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current[part] === undefined) {
      return undefined
    }
    current = current[part] as Record<string, unknown>
  }

  return typeof current === 'string' ? current : undefined
}

export function directTranslation(key: string): string {
  if (!frMessages) {
    loadMessages()
  }

  const currentLocale = i18nAny.global.locale

  if (currentLocale === 'fr' && frMessages) {
    return getNestedValue(frMessages, key) || key
  } else if (currentLocale === 'en' && enMessages) {
    return getNestedValue(enMessages, key) || key
  } else if (currentLocale === 'laranguiva' && laranguivaMessages) {
    return getNestedValue(laranguivaMessages, key) || key
  }

  return key
}

export function installGlobalTranslation(app: App): void {
  if (!app.config) return
  app.config.globalProperties.$t = directTranslation
}

export { i18nAny }
