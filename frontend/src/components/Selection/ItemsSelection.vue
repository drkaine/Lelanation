<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { TooltipCoordonne } from '../script/TooltipCoordonne'
import items from '@/assets/files/data/item.json'
import ItemTooltip from '@/components/Tooltip/ItemTooltip.vue'
import type { Item } from '@/types/item'
import { useItemStore } from '@/stores/itemStore'

const tooltip = new TooltipCoordonne()

const tooltipLeft = tooltip.tooltipLeft
const tooltipTop = tooltip.tooltipTop

const updateMousePosition = (event: MouseEvent) => {
  tooltip.updateMousePosition(event)
}

const resetMousePosition = () => {
  tooltip.resetMousePosition()
}

const selectedTags = ref<string[]>([])
const itemStore = useItemStore()
//   type: 'starter' | 'core' | 'situationnel' | 'boots',
const selectItem = (Item: Item) => {
  itemStore.setItemSelection(Item)
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (tag === 'all') {
    selectedTags.value = []
  } else if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const searchQuery = ref('')
const debouncedSearch = ref('')

watch(searchQuery, newValue => {
  const timeoutId = setTimeout(() => {
    debouncedSearch.value = newValue.toLowerCase()
  }, 300)

  onBeforeUnmount(() => clearTimeout(timeoutId))
})

const FILTERED_ITEMS = [
  'Jus chapi-chapo',
  'Promesse empyréenne',
  'Protège-bras pulvérisé',
] as const

const filteredItems = computed<Item[]>(() => {
  let filtered = Object.values(items.data)
    .filter(
      (item: Item) =>
        item.maps['11'] === true &&
        item.gold?.purchasable === true &&
        item.gold.total > 0 &&
        !FILTERED_ITEMS.includes(item.name as (typeof FILTERED_ITEMS)[number]),
    )
    .filter(
      (item: Item, index: number, self: Item[]) =>
        self.findIndex((i: Item) => i.name === item.name) === index,
    )

  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((item: Item) =>
      selectedTags.value.every(tag => item.tags.includes(tag)),
    )
  }

  if (debouncedSearch.value) {
    filtered = filtered.filter((item: Item) =>
      item.name.toLowerCase().includes(debouncedSearch.value),
    )
  }

  return filtered
})

const getItemsFrom = (item: Item): Item[] => {
  if (!item.from) return []
  return item.from
    .map(id => items.data[id as keyof typeof items.data])
    .filter(Boolean)
    .filter(item => filteredItems.value.includes(item))
}

const getItemsInto = (item: Item): Item[] => {
  if (!item.into) return []
  return item.into
    .map(id => items.data[id as keyof typeof items.data])
    .filter(Boolean)
    .filter(item => filteredItems.value.includes(item))
}

const SPECIAL_BOOTS_ITEMS = ['Jambières de métal', 'Lucidité pourpre'] as const

const itemsBoots = computed<Item[]>(() =>
  filteredItems.value
    .filter((item: Item) => {
      return (
        item.tags?.includes('Boots') ||
        SPECIAL_BOOTS_ITEMS.includes(
          item.name as (typeof SPECIAL_BOOTS_ITEMS)[number],
        )
      )
    })
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0)),
)

const itemsStarter = computed<Item[]>(() =>
  filteredItems.value
    .filter(
      (item: Item) =>
        (item.depth === undefined && item.tags?.includes('Lane')) ||
        (item.tags?.includes('Jungle') && item.maps['21'] === true) ||
        item.name === 'Larme de la déesse',
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0)),
)

const itemsBasic = computed<Item[]>(() =>
  filteredItems.value
    .filter(
      (item: Item) =>
        item.depth === undefined &&
        !item.tags?.includes('Lane') &&
        !item.tags?.includes('Jungle') &&
        !item.tags?.includes('Boots'),
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0)),
)

const itemsEpic = computed<Item[]>(() =>
  filteredItems.value
    .filter(
      (item: Item) =>
        item.into !== undefined &&
        !item.tags?.includes('Boots') &&
        !item.tags?.includes('Consumable') &&
        item.from !== undefined,
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0)),
)

const itemsLegendary = computed<Item[]>(() =>
  filteredItems.value
    .filter(
      (item: Item) =>
        item.into === undefined &&
        item.depth !== undefined &&
        item.depth > 1 &&
        !item.tags?.includes('Boots') &&
        !SPECIAL_BOOTS_ITEMS.includes(
          item.name as (typeof SPECIAL_BOOTS_ITEMS)[number],
        ),
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0)),
)
</script>

<template>
  <div class="itemsPage">
    <div class="search">
      <input
        type="search"
        v-model="searchQuery"
        placeholder="Rechercher un objet..."
        class="search-input"
      />
    </div>
    <div class="filter-items">
      <button @click="toggleTag('all')">Tous</button>
      <button
        :class="{
          active: selectedTags.includes('Damage'),
        }"
        @click="toggleTag('Damage')"
      >
        {{ $t('item.damage') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('CriticalStrike'),
        }"
        @click="toggleTag('CriticalStrike')"
      >
        {{ $t('item.critical-strike') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('AttackSpeed'),
        }"
        @click="toggleTag('AttackSpeed')"
      >
        {{ $t('item.attack-speed') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('OnHit'),
        }"
        @click="toggleTag('OnHit')"
      >
        {{ $t('item.on-hit') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('ArmorPenetration'),
        }"
        @click="toggleTag('ArmorPenetration')"
      >
        {{ $t('item.armor-penetration') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('SpellDamage'),
        }"
        @click="toggleTag('SpellDamage')"
      >
        {{ $t('item.ability-power') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('Mana'),
        }"
        @click="toggleTag('Mana')"
      >
        {{ $t('item.mana') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('ManaRegen'),
        }"
        @click="toggleTag('ManaRegen')"
      >
        {{ $t('item.mana-regen') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('MagicPenetration'),
        }"
        @click="toggleTag('MagicPenetration')"
      >
        {{ $t('item.magic-penetration') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('Health'),
        }"
        @click="toggleTag('Health')"
      >
        {{ $t('item.health') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('HealthRegen'),
        }"
        @click="toggleTag('HealthRegen')"
      >
        {{ $t('item.health-regen') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('Armor'),
        }"
        @click="toggleTag('Armor')"
      >
        {{ $t('item.armor') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('SpellBlock'),
        }"
        @click="toggleTag('SpellBlock')"
      >
        {{ $t('item.magic-resist') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('AbilityHaste'),
        }"
        @click="toggleTag('AbilityHaste')"
      >
        {{ $t('item.ability-haste') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('NonbootsMovement'),
        }"
        @click="toggleTag('NonbootsMovement')"
      >
        {{ $t('item.movement') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('LifeSteal'),
        }"
        @click="toggleTag('LifeSteal')"
      >
        {{ $t('item.life-steal') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('SpellVamp'),
        }"
        @click="toggleTag('SpellVamp')"
      >
        {{ $t('item.omnivamp') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('Consumable'),
        }"
        @click="toggleTag('Consumable')"
      >
        {{ $t('item.consumable') }}
      </button>
      <button
        :class="{
          active: selectedTags.includes('all'),
        }"
        @click="toggleTag('all')"
      >
        {{ $t('item.all') }}
      </button>
    </div>
    <div class="items-container">
      <div v-if="itemsBoots.length > 0">
        <div class="group small">
          {{ $t('item.boots') }} ({{ itemsBoots.length }})
        </div>
        <div class="items-grid">
          <div v-for="(item, index) in itemsBoots" :key="index" class="tip">
            <div class="tooltip">
              <button
                to="false"
                :class="{
                  selected: itemStore.ItemsSelection.core?.includes(item),
                  hide: !filteredItems.includes(item),
                  item: true,
                }"
                replace="false"
                @click="selectItem(item)"
                @mouseenter="updateMousePosition"
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
                  position: 'absolute',
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

      <div v-if="itemsStarter.length > 0">
        <div class="group small">
          {{ $t('item.starter') }} ({{ itemsStarter.length }})
        </div>
        <div class="items-grid">
          <div v-for="(item, index) in itemsStarter" :key="index" class="tip">
            <div class="tooltip">
              <button
                to="false"
                :class="{
                  selected: itemStore.ItemsSelection.core?.includes(item),
                  hide: !filteredItems.includes(item),
                  item: true,
                }"
                replace="false"
                @click="selectItem(item)"
                @mouseenter="updateMousePosition"
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
                  position: 'absolute',
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

      <div v-if="itemsBasic.length > 0">
        <div class="group small">
          {{ $t('item.basic') }} ({{ itemsBasic.length }})
        </div>
        <div class="items-grid">
          <div v-for="(item, index) in itemsBasic" :key="index" class="tip">
            <div class="tooltip">
              <button
                to="false"
                :class="{
                  selected: itemStore.ItemsSelection.core?.includes(item),
                  hide: !filteredItems.includes(item),
                  item: true,
                }"
                replace="false"
                @click="selectItem(item)"
                @mouseenter="updateMousePosition"
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
                  position: 'absolute',
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

      <div v-if="itemsEpic.length > 0">
        <div class="group small">
          {{ $t('item.epic') }} ({{ itemsEpic.length }})
        </div>
        <div class="items-grid">
          <div v-for="(item, index) in itemsEpic" :key="index" class="tip">
            <div class="tooltip">
              <button
                to="false"
                :class="{
                  selected: itemStore.ItemsSelection.core?.includes(item),
                  hide: !filteredItems.includes(item),
                  item: true,
                }"
                replace="false"
                @click="selectItem(item)"
                @mouseenter="updateMousePosition"
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
                  position: 'absolute',
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

      <div v-if="itemsLegendary.length > 0">
        <div class="group small">
          {{ $t('item.legendary') }} ({{ itemsLegendary.length }})
        </div>
        <div class="items-grid">
          <div v-for="(item, index) in itemsLegendary" :key="index" class="tip">
            <div class="tooltip">
              <button
                to="false"
                :class="{
                  selected: itemStore.ItemsSelection.core?.includes(item),
                  hide: !filteredItems.includes(item),
                  item: true,
                }"
                replace="false"
                @click="selectItem(item)"
                @mouseenter="updateMousePosition"
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
                  position: 'absolute',
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
    </div>
  </div>
</template>
