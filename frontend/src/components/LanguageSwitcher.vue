<template>
  <div class="language-switcher">
    <select
      v-model="currentLocale"
      @change="changeLanguage"
      class="language-select"
    >
      <option value="fr">FR</option>
      <option value="en">EN</option>
      <option value="laranguiva">LA</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import i18n from '@/i18n'

type Locale = 'fr' | 'en' | 'laranguiva'

interface I18nGlobal {
  global: {
    locale: string
  }
}

const i18nAny = i18n as unknown as I18nGlobal

const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem('locale') as Locale
  if (stored && ['fr', 'en', 'laranguiva'].includes(stored)) {
    return stored
  }

  try {
    return (i18nAny.global.locale || 'fr') as Locale
  } catch {
    return 'fr'
  }
}

const { locale } = useI18n()
const currentLocale = ref<Locale>(getInitialLocale())

const changeLanguage = async () => {
  await setLocale(currentLocale.value)
  window.location.reload()
}

watch(
  () => locale.value,
  newLocale => {
    if (newLocale) {
      currentLocale.value = newLocale as Locale
    }
  },
)

onMounted(() => {
  const storedLocale = getInitialLocale()
  if (storedLocale) {
    currentLocale.value = storedLocale
  }
})
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
  position: relative;
}

.language-select {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 6px;
  border: 2px solid var(--color-gold-200);
  background-color: var(--color-blue-600);
  color: var(--color-gold-100);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c8aa6e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.2em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-select:hover {
  border-color: var(--color-gold-300);
  background-color: var(--color-blue-500);
  color: var(--color-gold-50);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.language-select:focus {
  outline: none;
  border-color: var(--color-gold-400);
  box-shadow: 0 0 0 3px rgba(200, 170, 110, 0.2);
}

.language-select option {
  background-color: var(--color-blue-600);
  color: var(--color-gold-100);
  padding: 0.5rem;
  font-weight: 500;
}

.language-select option:hover {
  background-color: var(--color-blue-500);
}
</style>
