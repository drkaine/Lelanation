<script setup lang="ts">
import { useStepStore } from '@/stores/stepStore'
import { useChampionStore } from '@/stores/championStore'

const stepStore = useStepStore()
const championStore = useChampionStore()

const next = (type: 'champion' | 'rune' | 'item' | 'info') => {
  if (type !== 'info' || championStore.$state.selectedChampion) {
    stepStore.setStepSelection(type)
  }
}

const isActive = (type: 'champion' | 'rune' | 'item' | 'info') => {
  return stepStore.step === type ? 'link-exact' : 'link'
}
</script>

<template>
  <div class="menu-build">
    <button
      :class="isActive('champion')"
      @click="next('champion')"
      type="button"
      :aria-pressed="stepStore.step === 'champion'"
      aria-label="Sélectionner un champion"
    >
      {{ $t('menu-build.champion') }}
    </button>
    <span class="arrow"></span>
    <button
      :class="isActive('rune')"
      @click="next('rune')"
      type="button"
      :aria-pressed="stepStore.step === 'rune'"
      aria-label="Configurer les runes"
    >
      {{ $t('menu-build.rune') }}
    </button>
    <span class="arrow"></span>
    <button
      :class="isActive('item')"
      @click="next('item')"
      type="button"
      :aria-pressed="stepStore.step === 'item'"
      aria-label="Sélectionner les objets"
    >
      {{ $t('menu-build.item') }}
    </button>
    <span class="arrow"></span>
    <button
      :class="[
        isActive('info'),
        !championStore.$state.selectedChampion ? 'disabled' : '',
      ]"
      @click="next('info')"
      type="button"
      :aria-pressed="stepStore.step === 'info'"
      :disabled="!championStore.$state.selectedChampion"
      aria-label="Voir les informations du build"
    >
      {{ $t('menu-build.info') }}
    </button>
  </div>
</template>
