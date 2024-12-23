<script setup lang="ts">
import { ref, computed } from 'vue'
import { TooltipCoordonne } from '../script/TooltipCoordonne'
import items from '@/assets/files/item.json'
import ItemTooltip from '@/components/Tooltip/ItemTooltip.vue'
import { type Item } from '../script/type'
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

const filteredItems = computed<Item[]>(() => {
  if (selectedTags.value.length === 0) {
    return Object.values(items.data).filter(
      (item: Item) =>
        item.maps['11'] === true &&
        item.gold?.purchasable === true &&
        item.gold.total > 0,
    )
  }
  return Object.values(items.data).filter(
    (item: Item) =>
      selectedTags.value.every(tag => item.tags.includes(tag)) &&
      item.maps['11'] === true &&
      item.gold?.purchasable === true &&
      item.gold.total > 0,
  )
})

const getItemsFrom = (item: Item) => {
  return (
    item.from
      ?.map((id: string) => items.data[id as keyof typeof items.data])
      .filter(Boolean) || []
  )
}

const getItemsInto = (item: Item) => {
  return (
    item.into
      ?.map((id: string) => items.data[id as keyof typeof items.data])
      .filter(Boolean) || []
  )
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
  <div data-v-6a781413="" data-v-b6709614="" class="items-page">
    <div data-v-72110c46="" data-v-6a781413="" class="grid small">
      <div data-v-72110c46="" class="search">
        <form data-v-6a781413="">
          <label class="small">
            <input placeholder="Search" type="search" />
          </label>
        </form>
      </div>
      <div data-v-72110c46="" class="filter">
        <button
          data-v-27037513=""
          data-v-6a781413=""
          class=""
          @click="toggleTag('all')"
        >
          Tous
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('Damage'),
          }"
          @click="toggleTag('Damage')"
        >
          Attack Damage
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('CriticalStrike'),
          }"
          @click="toggleTag('CriticalStrike')"
        >
          Critical Strike
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('AttackSpeed'),
          }"
          @click="toggleTag('AttackSpeed')"
        >
          Attack Speed
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('OnHit'),
          }"
          @click="toggleTag('OnHit')"
        >
          On-Hit
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('ArmorPenetration'),
          }"
          @click="toggleTag('ArmorPenetration')"
        >
          Armor Pen
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('SpellDamage'),
          }"
          @click="toggleTag('SpellDamage')"
        >
          Ability Power
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('Mana'),
          }"
          @click="toggleTag('Mana')"
        >
          Mana
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('ManaRegen'),
          }"
          @click="toggleTag('ManaRegen')"
        >
          Mana Regen
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('MagicPenetration'),
          }"
          @click="toggleTag('MagicPenetration')"
        >
          Magic Pen
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('Health'),
          }"
          @click="toggleTag('Health')"
        >
          Health
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('HealthRegen'),
          }"
          @click="toggleTag('HealthRegen')"
        >
          Health Regen
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('Armor'),
          }"
          @click="toggleTag('Armor')"
        >
          Armor
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('SpellBlock'),
          }"
          @click="toggleTag('SpellBlock')"
        >
          Magic Resist
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('AbilityHaste'),
          }"
          @click="toggleTag('AbilityHaste')"
        >
          Ability Haste
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('NonbootsMovement'),
          }"
          @click="toggleTag('NonbootsMovement')"
        >
          Movement
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('LifeSteal'),
          }"
          @click="toggleTag('LifeSteal')"
        >
          Life Steal
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('SpellVamp'),
          }"
          @click="toggleTag('SpellVamp')"
        >
          Omnivamp
        </button>
        <button
          data-v-27037513=""
          data-v-6a781413=""
          :class="{
            active: selectedTags.includes('Consumable'),
          }"
          @click="toggleTag('Consumable')"
        >
          Consommable
        </button>
      </div>
      <div data-v-72110c46="" class="divider"></div>
      <div
        data-v-72110c46=""
        class="group small"
        v-if="itemsStarter.length > 0"
      >
        Starter items
      </div>
      <div
        data-v-354b7b55=""
        data-v-7ab6e59a=""
        data-v-85ffd0f2=""
        data-v-72110c46=""
        class="tip"
        v-for="(item, index) in itemsStarter"
        :key="index"
      >
        <div data-v-cbff5ddf="" data-v-354b7b55="" class="tooltip">
          <button
            data-v-7ab6e59a=""
            data-v-cbff5ddf-s=""
            to="false"
            :class="{
              selected: itemStore.ItemsSelection.core?.includes(item),
              hide: !itemsStarter.includes(item),
              item: true,
            }"
            replace="false"
            @click="selectItem(item)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <img
              data-v-7ab6e59a=""
              data-v-cbff5ddf-s=""
              class="img"
              :src="`/assets/icons/items/${item.image.full}`"
              :alt="item.name"
            />

            <div data-v-7ab6e59a="" data-v-cbff5ddf-s="" class="text">
              {{ item.gold.total }}
            </div>
          </button>
          <div
            data-v-cbff5ddf=""
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
      <div data-v-72110c46="" class="divider"></div>
      <div data-v-72110c46="" class="group small" v-if="itemsBasic.length > 0">
        Basic items
      </div>
      <div
        data-v-354b7b55=""
        data-v-7ab6e59a=""
        data-v-85ffd0f2=""
        data-v-72110c46=""
        class="tip"
        v-for="(item, index) in itemsBasic"
        :key="index"
      >
        <div data-v-cbff5ddf="" data-v-354b7b55="" class="tooltip">
          <button
            data-v-7ab6e59a=""
            data-v-cbff5ddf-s=""
            to="false"
            :class="{
              selected: itemStore.ItemsSelection.core?.includes(item),
              hide: !itemsBasic.includes(item),
              item: true,
            }"
            replace="false"
            @click="selectItem(item)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <img
              data-v-7ab6e59a=""
              data-v-cbff5ddf-s=""
              class="img"
              :src="`/assets/icons/items/${item.image.full}`"
              :alt="item.name"
            />

            <div data-v-7ab6e59a="" data-v-cbff5ddf-s="" class="text">
              {{ item.gold.total }}
            </div>
          </button>
          <div
            data-v-cbff5ddf=""
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

      <div data-v-72110c46="" class="divider"></div>
      <div data-v-72110c46="" class="group small" v-if="itemsBoots.length > 0">
        Boots items
      </div>
      <div
        data-v-354b7b55=""
        data-v-7ab6e59a=""
        data-v-85ffd0f2=""
        data-v-72110c46=""
        class="tip"
        v-for="(item, index) in itemsBoots"
        :key="index"
      >
        <div data-v-cbff5ddf="" data-v-354b7b55="" class="tooltip">
          <button
            data-v-7ab6e59a=""
            data-v-cbff5ddf-s=""
            to="false"
            :class="{
              selected: itemStore.ItemsSelection.core?.includes(item),
              hide: !itemsBoots.includes(item),
              item: true,
            }"
            replace=" false"
            @click="selectItem(item)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <img
              data-v-7ab6e59a=""
              data-v-cbff5ddf-s=""
              class="img"
              :src="`/assets/icons/items/${item.image.full}`"
              :alt="item.name"
            />

            <div data-v-7ab6e59a="" data-v-cbff5ddf-s="" class="text">
              {{ item.gold.total }}
            </div>
          </button>
          <div
            data-v-cbff5ddf=""
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
      <div data-v-72110c46="" class="divider"></div>
      <div data-v-72110c46="" class="group small" v-if="itemsEpic.length > 0">
        Epic items
      </div>
      <div
        data-v-354b7b55=""
        data-v-7ab6e59a=""
        data-v-85ffd0f2=""
        data-v-72110c46=""
        class="tip"
        v-for="(item, index) in itemsEpic"
        :key="index"
        @click="selectItem(item)"
      >
        <div data-v-cbff5ddf="" data-v-354b7b55="" class="tooltip">
          <button
            data-v-7ab6e59a=""
            data-v-cbff5ddf-s=""
            to="false"
            :class="{
              selected: itemStore.ItemsSelection.core?.includes(item),
              hide: !itemsEpic.includes(item),
              item: true,
            }"
            replace=" false"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <img
              data-v-7ab6e59a=""
              data-v-cbff5ddf-s=""
              class="img"
              :src="`/assets/icons/items/${item.image.full}`"
              :alt="item.name"
            />

            <div data-v-7ab6e59a="" data-v-cbff5ddf-s="" class="text">
              {{ item.gold.total }}
            </div>
          </button>
          <div
            data-v-cbff5ddf=""
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
      <div data-v-72110c46="" class="divider"></div>
      <div
        data-v-72110c46=""
        class="group small"
        v-if="itemsLegendary.length > 0"
      >
        Legendary items
      </div>
      <div
        data-v-354b7b55=""
        data-v-7ab6e59a=""
        data-v-85ffd0f2=""
        data-v-72110c46=""
        class="tip"
        v-for="(item, index) in itemsLegendary"
        :key="index"
      >
        <div data-v-cbff5ddf="" data-v-354b7b55="" class="tooltip">
          <button
            data-v-7ab6e59a=""
            data-v-cbff5ddf-s=""
            to="false"
            replace="false"
            :class="{
              selected: itemStore.ItemsSelection.core?.includes(item),
              hide: !itemsLegendary.includes(item),
              item: true,
            }"
            @click="selectItem(item)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <img
              data-v-7ab6e59a=""
              data-v-cbff5ddf-s=""
              class="img"
              :src="`/assets/icons/items/${item.image.full}`"
              :alt="item.name"
            />

            <div data-v-7ab6e59a="" data-v-cbff5ddf-s="" class="text">
              {{ item.gold.total }}
            </div>
          </button>
          <div
            data-v-cbff5ddf=""
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
      <div data-v-72110c46="" class="divider"></div>
    </div>
  </div>
</template>
