import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'
import lelarivien from './locales/lelarivien.json'

const i18n = createI18n({
  legacy: false, // Set to false to use Composition API
  locale: localStorage.getItem('locale') || 'fr', // Default locale
  fallbackLocale: 'en', // Fallback locale
  messages: {
    fr,
    en,
    lelarivien
  }
})

export default i18n 