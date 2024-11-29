<script setup lang="ts">
import version from '@/assets/files/lastVersion.json'
import { type Item } from './type'

const props = defineProps<{
  item: Item
}>()
</script>

<template>
  <div
    data-v-cbff5ddf=""
    class="box"
    style="position: absolute; left: 974px; top: 417px"
  >
    <div data-v-354b7b55="" data-v-cbff5ddf-s="" class="tooltip-header">
      <div data-v-354b7b55="" data-v-cbff5ddf-s="" class="item-header">
        <img
          data-v-354b7b55=""
          data-v-cbff5ddf-s=""
          :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${props.item.image.full}`"
        />
        <div data-v-354b7b55="" data-v-cbff5ddf-s="" class="name">
          {{ props.item.name }}
        </div>
        <div data-v-354b7b55="" data-v-cbff5ddf-s="" class="gold">
          <div data-v-354b7b55="" data-v-cbff5ddf-s="" class="total">
            <svg
              data-v-354b7b55=""
              data-v-cbff5ddf-s=""
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z"
              ></path>
              <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"></path>
              <path
                d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z"
              ></path>
              <path d="M3 6v10c0 .888 .772 1.45 2 2"></path>
              <path d="M3 11c0 .888 .772 1.45 2 2"></path>
            </svg>
            {{ props.item.gold.total }}
          </div>
          <div data-v-354b7b55="" data-v-cbff5ddf-s="" class="sell">
            {{ props.item.gold.sell }} (40%)
          </div>
        </div>
      </div>
    </div>
    <div data-v-cbff5ddf="" class="body">
      {{ props.item.description }}
    </div>
    <div data-v-cbff5ddf="" class="stats">
      <h3>Statistiques</h3>
      <ul>
        <li v-for="(value, key) in props.item.stats" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.stats {
  margin-top: 1em;
}

.stats h3 {
  margin-bottom: 0.5em;
  font-size: 1.2em;
}

.stats ul {
  list-style: none;
  padding: 0;
}

.stats li {
  margin-bottom: 0.3em;
}
</style>
