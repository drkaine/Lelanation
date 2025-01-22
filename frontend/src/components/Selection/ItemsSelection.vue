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

const filteredItems = computed<Item[]>(() => {
  let filtered = Object.values(items.data).filter(
    (item: Item) =>
      item.maps['11'] === true &&
      item.gold?.purchasable === true &&
      item.gold.total > 0,
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
}

const getItemsInto = (item: Item): Item[] => {
  if (!item.into) return []
  return item.into
    .map(id => items.data[id as keyof typeof items.data])
    .filter(Boolean)
}

const itemsBoots = computed<Item[]>(() =>
  filteredItems.value
    .filter(
      (item: Item) => item.tags?.includes('Boots') || item.name === 'Zéphyr',
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0)),
)

const itemsStarter = computed<Item[]>(() =>
  filteredItems.value
    .filter(
      (item: Item) =>
        (item.depth === undefined && item.tags?.includes('Lane')) ||
        (item.tags?.includes('Jungle') && item.maps['21'] === true),
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0)),
)

const itemsBasic = computed<Item[]>(() =>
  filteredItems.value
    .filter(
      (item: Item) =>
        item.depth === undefined &&
        !item.tags?.includes('Lane') &&
        !item.tags?.includes('Jungle'),
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
        item.name !== 'Zéphyr',
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
        Attack Damage
      </button>
      <button
        :class="{
          active: selectedTags.includes('CriticalStrike'),
        }"
        @click="toggleTag('CriticalStrike')"
      >
        Critical Strike
      </button>
      <button
        :class="{
          active: selectedTags.includes('AttackSpeed'),
        }"
        @click="toggleTag('AttackSpeed')"
      >
        Attack Speed
      </button>
      <button
        :class="{
          active: selectedTags.includes('OnHit'),
        }"
        @click="toggleTag('OnHit')"
      >
        On-Hit
      </button>
      <button
        :class="{
          active: selectedTags.includes('ArmorPenetration'),
        }"
        @click="toggleTag('ArmorPenetration')"
      >
        Armor Pen
      </button>
      <button
        :class="{
          active: selectedTags.includes('SpellDamage'),
        }"
        @click="toggleTag('SpellDamage')"
      >
        Ability Power
      </button>
      <button
        :class="{
          active: selectedTags.includes('Mana'),
        }"
        @click="toggleTag('Mana')"
      >
        Mana
      </button>
      <button
        :class="{
          active: selectedTags.includes('ManaRegen'),
        }"
        @click="toggleTag('ManaRegen')"
      >
        Mana Regen
      </button>
      <button
        :class="{
          active: selectedTags.includes('MagicPenetration'),
        }"
        @click="toggleTag('MagicPenetration')"
      >
        Magic Pen
      </button>
      <button
        :class="{
          active: selectedTags.includes('Health'),
        }"
        @click="toggleTag('Health')"
      >
        Health
      </button>
      <button
        :class="{
          active: selectedTags.includes('HealthRegen'),
        }"
        @click="toggleTag('HealthRegen')"
      >
        Health Regen
      </button>
      <button
        :class="{
          active: selectedTags.includes('Armor'),
        }"
        @click="toggleTag('Armor')"
      >
        Armor
      </button>
      <button
        :class="{
          active: selectedTags.includes('SpellBlock'),
        }"
        @click="toggleTag('SpellBlock')"
      >
        Magic Resist
      </button>
      <button
        :class="{
          active: selectedTags.includes('AbilityHaste'),
        }"
        @click="toggleTag('AbilityHaste')"
      >
        Ability Haste
      </button>
      <button
        :class="{
          active: selectedTags.includes('NonbootsMovement'),
        }"
        @click="toggleTag('NonbootsMovement')"
      >
        Movement
      </button>
      <button
        :class="{
          active: selectedTags.includes('LifeSteal'),
        }"
        @click="toggleTag('LifeSteal')"
      >
        Life Steal
      </button>
      <button
        :class="{
          active: selectedTags.includes('SpellVamp'),
        }"
        @click="toggleTag('SpellVamp')"
      >
        Omnivamp
      </button>
      <button
        :class="{
          active: selectedTags.includes('Consumable'),
        }"
        @click="toggleTag('Consumable')"
      >
        Consommable
      </button>
      <button
        :class="{
          active: selectedTags.includes('all'),
        }"
        @click="toggleTag('all')"
      >
        Tous
      </button>
    </div>
    <div class="items-container">
      <div v-if="itemsBoots.length > 0">
        <div class="group small">Bottes ({{ itemsBoots.length }})</div>
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
          Objets de départ ({{ itemsStarter.length }})
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
        <div class="group small">Objets basiques ({{ itemsBasic.length }})</div>
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
        <div class="group small">Objets épiques ({{ itemsEpic.length }})</div>
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
          Objets légendaires ({{ itemsLegendary.length }})
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
