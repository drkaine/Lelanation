<script setup lang="ts">
import type { Item } from '@/types/item'
import { computed } from 'vue'

const props = defineProps<{
  item: Item
  from: Item[]
  into: Item[]
}>()

// Calcul du pourcentage de revente
const sellPercentage = computed(() => {
  return Math.round((props.item.gold.sell / props.item.gold.total) * 100)
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
          <h3 class="item-name">{{ props.item.name }}</h3>
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
      <div class="recipe-title">Composants:</div>
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

  <div class="tooltip-body">
    {{ props.item.description }}
  </div>

  <div class="tooltip-builds" v-if="props.into?.length">
    <div class="builds-title">Se transforme en:</div>
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
  {{ console.log(props.item) }}
</template>

<style>
.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
}
.item-info {
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: center;
}

.item-icon {
  width: 32px;
  height: 32px;
  border: 1px solid var(--gold-lol);
  border-radius: 4px;
}

.item-name {
  color: var(--nox-grey1);
  font-size: 14px;
  margin: 0;
}

.item-cost {
  display: flex;
  gap: 4px;
  color: var(--gold-lol);
  font-size: 12px;
}

.cost-sell {
  color: var(--nox-grey3);
}

.tooltip-body {
  color: var(--nox-grey2);
  font-size: 12px;
  line-height: 1.4;
  margin: 8px 0;
}

.recipe-title,
.builds-title {
  color: var(--nox-gold4);
  font-size: 13px;
  margin-bottom: 4px;
}

.recipe-items,
.builds-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.recipe-item,
.builds-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.recipe-icon,
.builds-icon {
  width: 24px;
  height: 24px;
  border: 1px solid var(--gold-3);
  border-radius: 2px;
}

.recipe-cost,
.builds-cost {
  color: var(--gold-lol);
  font-size: 10px;
}
</style>
