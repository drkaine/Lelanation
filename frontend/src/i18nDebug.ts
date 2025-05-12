/**
 * i18n Debugging Utility
 * This file contains utilities to help debug i18n translation issues
 */

import i18n from './i18n';

interface MessageStructure {
  [key: string]: string | boolean | undefined;
}

/**
 * Checks if translations are correctly loaded
 * @returns Object with debugging information
 */
export function checkTranslations() {
  // Cast to any to bypass TypeScript warnings with legacy mode
  const i18nAny = i18n as any;
  
  const result = {
    loaded: false,
    locale: i18nAny.global.locale,
    availableLocales: i18nAny.global.availableLocales,
    sampleTranslations: {} as Record<string, string>,
    messageStructure: {} as MessageStructure,
    errors: [] as string[]
  };

  try {
    // Check if messages are loaded - in legacy mode
    const currentMessages = i18nAny.global.getLocaleMessage(i18nAny.global.locale);
    result.loaded = !!currentMessages && Object.keys(currentMessages).length > 0;
    
    // Get sample translations using the 'any' typed instance
    const testKeys = ['home.title', 'navigation.home', 'button.next', 'legal.accept'];
    testKeys.forEach(key => {
      try {
        result.sampleTranslations[key] = i18nAny.global.t(key);
      } catch (e) {
        result.errors.push(`Failed to translate ${key}: ${e}`);
        result.sampleTranslations[key] = 'ERROR';
      }
    });

    // Check message structure by direct access
    if (currentMessages?.home?.title) {
      result.messageStructure['home.title exists'] = true;
      result.messageStructure['home.title value'] = currentMessages.home.title;
    } else {
      result.messageStructure['home.title exists'] = false;
      result.errors.push('home.title path not found in messages');
    }
    
    // Also check raw translation objects
    try {
      const frMessages = i18nAny.global.getLocaleMessage('fr');
      const enMessages = i18nAny.global.getLocaleMessage('en');
      
      if (frMessages) {
        result.messageStructure['fr loaded'] = true;
        result.messageStructure['fr.home.title'] = frMessages.home?.title || 'missing';
      }
      
      if (enMessages) {
        result.messageStructure['en loaded'] = true;
        result.messageStructure['en.home.title'] = enMessages.home?.title || 'missing';
      }
    } catch (e) {
      result.errors.push(`Error accessing messages: ${e}`);
    }

  } catch (e) {
    result.errors.push(`General error: ${e}`);
  }

  return result;
}

/**
 * Force i18n to reload translations
 */
export function forceReloadTranslations() {
  // Cast to any to bypass TypeScript restrictions
  const i18nAny = i18n as any;
  const currentLocale = i18nAny.global.locale;
  
  // Try to reload messages
  try {
    // Re-import messages
    import('./i18n/locales/fr.json').then(fr => {
      i18nAny.global.setLocaleMessage('fr', fr.default);
      console.log('French messages reloaded');
      
      // Verify after reload
      const frMessages = i18nAny.global.getLocaleMessage('fr');
      console.log('FR home.title after reload:', frMessages?.home?.title || 'missing');
    });
    
    import('./i18n/locales/en.json').then(en => {
      i18nAny.global.setLocaleMessage('en', en.default);
      console.log('English messages reloaded');
      
      // Verify after reload
      const enMessages = i18nAny.global.getLocaleMessage('en');
      console.log('EN home.title after reload:', enMessages?.home?.title || 'missing');
    });
    
    // Switch locale to trigger refresh
    const tempLocale = currentLocale === 'fr' ? 'en' : 'fr';
    i18nAny.global.locale = tempLocale;
    
    // Switch back after delay
    setTimeout(() => {
      i18nAny.global.locale = currentLocale;
      console.log(`Locale switched back to ${currentLocale}`);
      
      // Test translation after switch
      console.log(`Translation test after reload: ${i18nAny.global.t('home.title')}`);
    }, 100);
    
    return true;
  } catch (e) {
    console.error('Failed to force reload translations:', e);
    return false;
  }
}

// Run debug check on load
console.log('i18n Debug Check:', checkTranslations()); 