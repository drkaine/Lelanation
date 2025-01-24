<script setup lang="ts">
import { useItemStore } from '@/stores/itemStore'
import statsTrad from '@/assets/files/data/statsTrad.json'
import { ref } from 'vue'

const itemStore = useItemStore()

const getTrad = (name: string) => {
  return statsTrad[name as keyof typeof statsTrad]
}

const draggingItem = ref<number | null>(null)
const touchStartY = ref<number>(0)

const startDrag = (index: number, event?: TouchEvent) => {
  draggingItem.value = index
  if (event) {
    touchStartY.value = event.touches[0].clientY
    event.preventDefault()
  }
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
}

const handleTouchEnd = (dropIndex: number, event: TouchEvent) => {
  event.preventDefault()
  if (draggingItem.value !== null) {
    itemStore.moveItem(draggingItem.value, dropIndex)
    draggingItem.value = null
  }
}

const onDrop = (dropIndex: number) => {
  if (draggingItem.value !== null) {
    itemStore.moveItem(draggingItem.value, dropIndex)
    draggingItem.value = null
  }
}

const removeItem = (index: number) => {
  itemStore.removeItem(index)
}
</script>

<template>
  <div class="items-container">
    <div class="items-grid">
      <div
        v-for="(item, index) in itemStore.ItemsSelection.core"
        :key="index"
        class="item-slot"
        draggable="true"
        @dragstart="startDrag(index)"
        @touchstart="startDrag(index, $event)"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd(index, $event)"
        @dragover.prevent
        @drop.prevent="onDrop(index)"
        :class="{ dragging: draggingItem === index }"
      >
        <img :src="`/assets/icons/items/${item.image.full}`" :alt="item.name" />
        <button class="remove-item" @click="removeItem(index)">×</button>
      </div>
    </div>

    <div class="stats-table">
      <div class="stats-header">
        <div class="stat-name">Statistique</div>
        <div class="stat-value">Valeur</div>
      </div>
      <template
        v-for="(value, key) in Object.entries(itemStore.ItemsSelection.stats)"
        :key="key"
      >
        <div v-if="value[1] && value[1] > 0" class="stat-row">
          <div class="stat-name">{{ getTrad(value[0]) }}</div>
          <div class="stat-value">
            {{
              typeof value[1] === 'number'
                ? value[1].toString().includes('.')
                  ? value[1].toFixed(2)
                  : value[1]
                : value[1]
            }}
          </div>
        </div>
      </template>
      <div class="stat-row total">
        <div class="stat-name">Coût total</div>
        <div class="stat-value">{{ itemStore.ItemsSelection.gold.total }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items-container {
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  gap: 12px;
  padding: 8px;
  border: 2px dashed var(--gold-lol);
  border-radius: 4px;
}

.item-slot {
  position: relative;
  width: 45px;
  height: 45px;
  border: 2px solid var(--gold-lol);
  border-radius: 4px;
  overflow: hidden;
  cursor: move;
  transition: all 0.2s ease;
}

.item-slot.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.item-slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-item {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 20px;
  height: 20px;
  background: var(--red);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}

.item-slot:hover .remove-item {
  opacity: 1;
  transform: scale(1);
}

.stats-table {
  border-radius: 4px;
  overflow: hidden;
}

.stats-header,
.stat-row {
  display: grid;
  grid-template-columns: 1fr 100px;
}

.stats-header {
  font-weight: bold;
  color: var(--gold-lol);
}

.stats-header > div,
.stat-row > div {
  padding: 8px 16px;
}

.stat-row .stat-name {
  border-radius: 4px 0 0 4px;
}

.stat-row .stat-value {
  text-align: right;
  font-family: monospace;
}

.stat-row.total {
  font-weight: bold;
  color: var(--gold-lol);
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
  }

  .item-slot {
    width: 35px;
    height: 35px;
  }
}
</style>
