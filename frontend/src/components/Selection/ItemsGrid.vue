<script setup lang="ts">
import ItemTooltip from '@/components/Tooltip/ItemTooltip.vue'
import { TooltipCoordonne } from '../script/TooltipCoordonne'
import type { Item } from '@/types/item'
import { useItemStore } from '@/stores/itemStore'

interface Props {
  items: Item[]
  title: string
  filteredItems: Item[]
  itemsData: Record<string, Item>
}

const props = defineProps<Props>()

const tooltip = new TooltipCoordonne()
const itemStore = useItemStore()

const tooltipLeft = tooltip.tooltipLeft
const tooltipTop = tooltip.tooltipTop

const updateMousePosition = (event: MouseEvent) => {
  tooltip.updateMousePosition(event)
}

const resetMousePosition = () => {
  tooltip.resetMousePosition()
}

const selectItem = (item: Item) => {
  itemStore.setItemSelection(item)
}

const getItemsFrom = (item: Item): Item[] => {
  if (!item.from) return []
  return item.from
    .map(id => props.itemsData[id as string])
    .filter(Boolean)
    .filter(item => props.filteredItems.includes(item))
}

const getItemsInto = (item: Item): Item[] => {
  if (!item.into) return []
  return item.into
    .map(id => props.itemsData[id as string])
    .filter(Boolean)
    .filter(item => props.filteredItems.includes(item))
}
</script>

<template>
  <div v-if="items.length > 0" class="items-section">
    <div class="group small">{{ title }} ({{ items.length }})</div>
    <div class="items-grid">
      <div v-for="item in items" :key="item.name" class="tip">
        <div class="tooltip">
          <button
            :class="{
              selected: itemStore.ItemsSelection.core?.includes(item),
              hide: !filteredItems.includes(item),
              item: true,
            }"
            @click="selectItem(item)"
            @mouseenter="updateMousePosition($event)"
            @mouseleave="resetMousePosition"
          >
            <img
              class="img"
              loading="lazy"
              width="32"
              height="32"
              decoding="async"
              :src="`/assets/icons/items/${item.image.full}`"
              :alt="item.name"
            />
            <div class="text">
              {{ item.gold.total }}
            </div>
          </button>
          <div
            class="box"
            :style="{
              left: tooltipLeft,
              top: tooltipTop,
            }"
          >
            <ItemTooltip
              :item="item"
              :from="getItemsFrom(item)"
              :into="getItemsInto(item)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items-section {
  margin-bottom: 1rem;
}

.group {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-gold-300);
}

.group.small {
  font-size: 0.9rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
  align-items: center;
  justify-items: center;
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
}

.tip {
  position: relative;
}

.tooltip {
  position: relative;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  background: rgba(26, 31, 44, 0.8);
  border: 1px solid rgba(200, 155, 60, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 48px;
  height: 56px;
}

.item:hover {
  border-color: var(--color-gold-400);
  background: rgba(200, 155, 60, 0.1);
  transform: translateY(-1px);
}

.item.selected {
  border-color: var(--color-gold-500);
  background: rgba(200, 155, 60, 0.2);
  box-shadow: 0 0 8px rgba(200, 155, 60, 0.3);
}

.item.hide {
  display: none;
}

.img {
  width: 32px;
  height: 32px;
  border-radius: 2px;
}

.text {
  font-size: 10px;
  color: var(--color-gold-200);
  text-align: center;
  line-height: 1;
  margin-top: 2px;
}

.box {
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: fixed;
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tip:hover .box {
  opacity: 1;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 6px;
  }

  .item {
    width: 40px;
    height: 48px;
  }

  .img {
    width: 28px;
    height: 28px;
  }

  .text {
    font-size: 9px;
  }
}
</style>
