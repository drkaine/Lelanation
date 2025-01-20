<script setup lang="ts">
import { useStepStore } from '@/stores/stepStore'

const stepStore = useStepStore()

const next = (type: 'champion' | 'rune' | 'item' | 'info') => {
  stepStore.setStepSelection(type)
}

const isActive = (type: 'champion' | 'rune' | 'item' | 'info') => {
  return stepStore.step === type ? 'link-exact' : 'link'
}
</script>

<template>
  <div class="menu-build">
    <a :class="isActive('champion')" @click="next('champion')"> Champions </a>
    <span class="arrow"></span>
    <a :class="isActive('rune')" @click="next('rune')">
      <span class="long">Runes &amp; sort d'invocateur</span>
      <span class="short">Runes</span>
    </a>
    <span class="arrow"></span>
    <a :class="isActive('item')" @click="next('item')"> Items </a>
    <span class="arrow"></span>
    <a :class="isActive('info')" @click="next('info')"> Info </a>
  </div>
</template>
