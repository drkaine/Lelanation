<script setup lang="ts">
import { type Summoner } from '../script/type'

const props = defineProps<{
  summoner: Summoner | null
}>()
</script>

<template>
  <div data-v-bab95e98="" data-v-cbff5ddf-s="" class="header">
    <div data-v-bab95e98="" data-v-cbff5ddf-s="" class="img">
      <img
        data-v-bab95e98=""
        data-v-cbff5ddf-s=""
        :src="'/assets/icons/summoners/' + props.summoner?.image.full"
        :alt="props.summoner?.name"
      />
    </div>
    <div data-v-bab95e98="" data-v-cbff5ddf-s="" class="name">
      {{ props.summoner?.name }}
    </div>
  </div>
  <div data-v-cbff5ddf="" class="body">
    <hr data-v-cbff5ddf="" />
    <div
      data-v-5ad5f5e7=""
      data-v-bab95e98=""
      data-v-cbff5ddf-s=""
      class="fstyle nopre"
    >
      {{ props.summoner?.description }}
    </div>
    <div class="space"></div>
    <div>{{ props.summoner?.tooltip }}</div>
  </div>
</template>
