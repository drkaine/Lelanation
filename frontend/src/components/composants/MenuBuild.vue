<script setup lang="ts">
import { useStepStore } from '@/stores/stepStore'

const stepStore = useStepStore()

const next = (type: 'champion' | 'rune' | 'item') => {
  stepStore.setStepSelection(type)
}
</script>

<template>
  <div data-v-b6709614="" class="menu">
    <a
      data-v-b6709614=""
      class="router-link-active router-link-exact-active done"
      aria-current="page"
      @click="next('champion')"
    >
      Champions</a
    >
    <span data-v-b6709614="" class="arrow"></span>
    <a
      data-v-b6709614=""
      class="router-link-active router-link-exact-active done"
      @click="next('rune')"
    >
      <span data-v-b6709614="" class="long">
        Runes &amp; sort d'invocateur</span
      >
      <span data-v-b6709614="" class="short"> Runes </span>
    </a>
    <span data-v-b6709614="" class="arrow"></span>
    <a
      data-v-b6709614=""
      class="router-link-active router-link-exact-active done"
      @click="next('item')"
    >
      Items</a
    >
    <span data-v-b6709614="" class="arrow"></span>
    <a data-v-b6709614="" class="done"> Info</a>
  </div>
</template>
