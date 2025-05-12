/**
 * i18n Compatibility Layer
 */

import i18n from './i18n';
import type { App } from 'vue';

// Cast to any to avoid TypeScript errors
const i18nAny = i18n as any;

// Cache for translation messages
let frMessages: any = null;
let enMessages: any = null;
let laranguivaMessages: any = null;

// Load translation messages
function loadMessages() {
  try {
    frMessages = i18nAny.global.getLocaleMessage('fr');
    enMessages = i18nAny.global.getLocaleMessage('en');
    laranguivaMessages = i18nAny.global.getLocaleMessage('laranguiva');
  } catch (e) {
    console.error('Failed to load translation messages:', e);
  }
}

// Get value from nested object using path (e.g. 'home.title')
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj) return undefined;
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return undefined;
    }
    current = current[part];
  }
  
  return typeof current === 'string' ? current : undefined;
}

/**
 * Get translation directly from loaded messages
 */
export function directTranslation(key: string): string {
  // Load messages on first use
  if (!frMessages) {
    loadMessages();
  }
  
  // Get current locale
  const currentLocale = i18nAny.global.locale;
  
  // Return translation based on current locale
  if (currentLocale === 'fr' && frMessages) {
    return getNestedValue(frMessages, key) || key;
  } else if (currentLocale === 'en' && enMessages) {
    return getNestedValue(enMessages, key) || key;
  } else if (currentLocale === 'laranguiva' && laranguivaMessages) {
    return getNestedValue(laranguivaMessages, key) || key;
  }
  
  // Fallback to key if no translation found
  return key;
}

/**
 * Install the compatibility layer into a Vue app instance
 */
export function installGlobalTranslation(app: App): void {
  if (!app.config) return;
  app.config.globalProperties.$t = directTranslation;
}

// Export for direct use
export { i18nAny }; 