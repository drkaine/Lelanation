<script setup lang="ts">
import type { Item } from '@/types/item'
import { computed } from 'vue'

const props = defineProps<{
  item: Item
  from: Item[]
  into: Item[]
}>()

const sellPercentage = computed(() => {
  return Math.round((props.item.gold.sell / props.item.gold.total) * 100)
})

const formattedDescription = computed(() => {
  if (!props.item.description) return ''

  return props.item.description
    .replace(/<mainText>/g, '')
    .replace(/<\/mainText>/g, '')
    .replace(/<stats>/g, '<div class="stats-block">')
    .replace(/<\/stats>/g, '</div>')
    .replace(/<attention>/g, '<span class="attention">')
    .replace(/<\/attention>/g, '</span>')
    .replace(/<passive>/g, '<span class="passive">')
    .replace(/<\/passive>/g, '</span>')
    .replace(/<active>/g, '<span class="active">')
    .replace(/<\/active>/g, '</span>')
    .replace(/<physicalDamage>/g, '<span class="physical">')
    .replace(/<\/physicalDamage>/g, '</span>')
    .replace(/<status>/g, '<span class="status">')
    .replace(/<\/status>/g, '</span>')
    .replace(/<speed>/g, '<span class="speed">')
    .replace(/<\/speed>/g, '</span>')
})
</script>

<template>
  <div class="tooltip-header">
    <div>
      <div class="item-info">
        <img
          :src="`/assets/icons/items/${props.item.image.full}`"
          :alt="props.item.name"
          class="item-icon"
        />
        <div class="item-details">
          <h3 class="item-name">Objet: {{ props.item.name }}</h3>
          <div class="item-cost">
            <svg
              width="14"
              height="14"
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
            <span class="cost-total">{{ props.item.gold.total }}</span>
            <span class="cost-sell"
              >({{ props.item.gold.sell }}) ({{ sellPercentage }}%)</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="tooltip-recipe" v-if="props.from?.length">
      <div class="recipe-title">{{ $t('item.recipe') }}:</div>
      <div class="recipe-items">
        <div
          v-for="(item, index) in props.from"
          :key="index"
          class="recipe-item"
        >
          <img
            :src="`/assets/icons/items/${item.image.full}`"
            :alt="item.name"
            class="recipe-icon"
          />
          <span class="recipe-cost">{{ item.gold.total }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="tooltip-description">
    <div class="separator" v-if="props.item.plaintext"></div>

    <div class="plaintext" v-if="props.item.plaintext">
      {{ props.item.plaintext }}
    </div>

    <div class="separator" v-if="formattedDescription"></div>

    <div class="description" v-html="formattedDescription"></div>
    <div class="separator" v-if="props.into?.length"></div>
  </div>

  <div class="tooltip-builds" v-if="props.into?.length">
    <div class="builds-title">{{ $t('item.transforms-into') }}:</div>
    <div class="builds-items">
      <div v-for="(item, index) in props.into" :key="index" class="builds-item">
        <img
          :src="`/assets/icons/items/${item.image.full}`"
          :alt="item.name"
          class="builds-icon"
        />
        <span class="builds-cost">{{ item.gold.total }}</span>
      </div>
    </div>
  </div>
</template>
