<script setup lang="ts">
import { type SubRune } from '../script/type'

const props = defineProps<{
  rune: SubRune | null
}>()
</script>

<template>
  <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="header">
    <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="img">
      <img
        data-v-ab218c16=""
        data-v-cbff5ddf-s=""
        :src="'/assets/icons/runes/' + props.rune?.id + '.png'"
        :alt="props.rune?.name"
      />
    </div>
    <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="name">
      {{ props.rune?.name }}
    </div>
  </div>
  <div data-v-cbff5ddf="" class="body">
    <hr data-v-cbff5ddf="" />
    <div
      data-v-5ad5f5e7=""
      data-v-ab218c16=""
      data-v-cbff5ddf-s=""
      class="fstyle nopre"
    >
      {{ props.rune?.shortDesc }}
      <div class="space"></div>
      <div>{{ props.rune?.longDesc }}</div>
      <div class="space"></div>
    </div>
  </div>
</template>
