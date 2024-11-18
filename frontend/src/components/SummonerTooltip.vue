<script setup lang="ts">
const props = defineProps<{
  summoner: {
    image: { full: string }
    name: string
    description: string
    tooltip: string
  }
}>()

const cleanDescription = (description: string) => {
  return description.replace(/<[^>]*>/g, '')
}
</script>

<template>
  <div
    data-v-cbff5ddf=""
    class="box"
    style="position: absolute; left: -32px; top: 53px"
  >
    <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="header">
      <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="img">
        <img
          data-v-ab218c16=""
          data-v-cbff5ddf-s=""
          :src="
            'https://ddragon.leagueoflegends.com/cdn/14.22.1/img/spell/' +
            props.summoner.image.full
          "
        />
      </div>
      <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="name">
        {{ props.summoner.name }}
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
        <div>{{ cleanDescription(props.summoner.description) }}</div>
        <div class="space"></div>
        <div>{{ cleanDescription(props.summoner.tooltip) }}</div>
        <div class="space"></div>
      </div>
    </div>
  </div>
</template>
