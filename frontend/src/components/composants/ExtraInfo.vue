<script setup lang="ts">
import { useItemStore } from '@/stores/itemStore'
import { ref, onMounted } from 'vue'

const itemStore = useItemStore()

const statsTrad = ref<Record<string, string>>({})

const getTrad = (name: string) => {
  return statsTrad.value[name] || name
}

onMounted(async () => {
  try {
    const statsModule = await import(
      '@/assets/files/data-manuel/statsTrad.json'
    )
    statsTrad.value = statsModule.default
  } catch (error) {
    console.error('Erreur lors du chargement des traductions de stats:', error)
  }
})

const draggingItem = ref<number | null>(null)
const touchStartY = ref<number>(0)
const touchStartX = ref<number>(0)
const currentDropTarget = ref<number | null>(null)

const startDrag = (index: number, event?: TouchEvent) => {
  draggingItem.value = index
  if (event) {
    touchStartY.value = event.touches[0].clientY
    touchStartX.value = event.touches[0].clientX
    event.preventDefault()
  }
}

const handleTouchMove = (event: TouchEvent) => {
  if (draggingItem.value === null) return
  event.preventDefault()

  const touch = event.touches[0]
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
  const dropTarget = elements.find(el => el.classList.contains('item-slot'))

  if (dropTarget) {
    const index = parseInt(dropTarget.getAttribute('data-index') || '-1')
    if (index !== -1) {
      currentDropTarget.value = index
    }
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault()
  if (draggingItem.value !== null && currentDropTarget.value !== null) {
    itemStore.moveItem(draggingItem.value, currentDropTarget.value)
  }
  draggingItem.value = null
  currentDropTarget.value = null
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
  <div class="stats-container">
    <div class="items-grid">
      <div
        v-for="(item, index) in itemStore.ItemsSelection.core"
        :key="index"
        :data-index="index"
        class="item-slot"
        draggable="true"
        @dragstart="startDrag(index)"
        @touchstart.stop="startDrag(index, $event)"
        @touchmove.prevent="handleTouchMove"
        @touchend.prevent="handleTouchEnd($event)"
        @dragover.prevent
        @drop.prevent="onDrop(index)"
        :class="{
          dragging: draggingItem === index,
          'drop-target': currentDropTarget === index && draggingItem !== index,
        }"
      >
        <img :src="`/assets/icons/items/${item.image.full}`" :alt="item.name" />
        <button
          class="remove-item"
          @click.stop="removeItem(index)"
          @touchend.stop.prevent="removeItem(index)"
        >
          ×
        </button>
      </div>
    </div>

    <div class="stats-table-extra">
      <div class="stats-header">
        <div class="stat-name">{{ $t('extra-info.statistic') }}</div>
        <div class="stat-value">{{ $t('extra-info.value') }}</div>
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
                ? value[1] < 1 && value[1] > 0
                  ? (value[1] * 100).toFixed(0) + '%'
                  : value[1].toString().includes('.')
                    ? value[1].toFixed(2)
                    : value[1]
                : value[1]
            }}
          </div>
        </div>
      </template>
      <div class="stat-row total">
        <div class="stat-name">{{ $t('extra-info.total-cost') }}</div>
        <div class="stat-value">{{ itemStore.ItemsSelection.gold.total }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  width: 100%;
  max-width: 900px;
  margin: 16px auto 0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.stat-value {
  font-size: var(--text-sm);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  gap: 12px;
  padding: 8px;
  border: var(--border-size) dashed var(--color-gold-300);
  border-radius: 4px;
}

.item-slot {
  position: relative;
  width: 45px;
  height: 45px;
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  overflow: hidden;
  cursor: move;
  touch-action: none;
  transition: all 0.2s ease;
  background: var(--color-grey-300);
}

.item-slot.dragging {
  opacity: 0.7;
  transform: scale(1.1);
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.item-slot.drop-target {
  border-color: var(--color-gold-300);
  background: var(--color-grey-300);
  transform: scale(1.05);
}

.item-slot img {
  width: var(--width-all);
  height: var(--height-all);
  object-fit: cover;
}

.remove-item {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: var(--red);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: var(--text-base);
  cursor: pointer;
  opacity: 1;
  transform: scale(1);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.stats-table-extra {
  border-radius: 4px;
  overflow: hidden;
}

.stats-header,
.stat-row {
  display: grid;
  grid-template-columns: 1fr 100px;
}

.stats-header > div,
.stat-row > div {
  padding: 8px 16px;
}

.stat-row .stat-name {
  border-radius: 4px 0 0 4px;
}

.stats-header .stat-value {
  text-align: right;
}

.stat-row .stat-value {
  text-align: right;
}

.stat-row.total {
  font-weight: bold;
  color: var(--color-gold-200);
}

@media (max-width: 768px) {
  .stats-container {
    padding: 0;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
  }

  .item-slot {
    width: 35px;
    height: 35px;
  }

  .remove-item {
    width: 16px;
    height: 16px;
    font-size: var(--text-base);
    opacity: 1;
    transform: scale(1);
  }

  .item-slot:hover .remove-item {
    opacity: 1;
    transform: scale(1);
  }

  .item-slot.dragging {
    pointer-events: none;
  }
}
</style>
