<template>
  <div class="language-switcher">
    <label :for="selectId" class="sr-only">{{
      $t('navigation.language') || 'Select language'
    }}</label>
    <select
      :id="selectId"
      v-model="currentLocale"
      @change="changeLanguage"
      class="language-select"
      :aria-label="$t('navigation.language') || 'Select language'"
    >
      <option value="fr">FR</option>
      <option value="en">EN</option>
      <option value="laranguiva">LELA</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
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
    const defaultLocale = (i18nAny.global.locale || 'fr') as Locale
    return defaultLocale
  } catch {
    return 'fr'
  }
}

const { locale } = useI18n()
const currentLocale = ref<Locale>(getInitialLocale())

const instanceId = Math.random().toString(36).substr(2, 9)
const selectId = computed(() => `language-select-${instanceId}`)

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
