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
    <a :class="isActive('champion')" @click="next('champion')">
      {{ $t('menu-build.champion') }}
    </a>
    <span class="arrow"></span>
    <a :class="isActive('rune')" @click="next('rune')">
      {{ $t('menu-build.rune') }}
    </a>
    <span class="arrow"></span>
    <a :class="isActive('item')" @click="next('item')">
      {{ $t('menu-build.item') }}
    </a>
    <span class="arrow"></span>
    <a
      :class="[
        isActive('info'),
        !championStore.$state.selectedChampion ? 'disabled' : '',
      ]"
      @click="next('info')"
    >
      {{ $t('menu-build.info') }}
    </a>
  </div>
</template>

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
