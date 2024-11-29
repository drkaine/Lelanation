<script setup lang="ts">
import { ref, computed } from 'vue'
import items from '@/assets/files/item.json'
import version from '@/assets/files/lastVersion.json'
import ItemTooltip from '@/components/ItemTooltip.vue'
import { type Item } from './type'

const selectedTags = ref<string[]>([])

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
        item.consumed === undefined &&
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

const itemsBoots = computed<Item[]>(() =>
  filteredItems.value.filter((item: Item) => item.tags?.includes('Boots')),
)

const itemsStarter = computed<Item[]>(() =>
  filteredItems.value.filter(
    (item: Item) =>
      (item.depth === undefined && item.tags?.includes('Lane')) ||
      item.tags?.includes('Jungle'),
  ),
)

const itemsBasic = computed<Item[]>(() =>
  filteredItems.value.filter((item: Item) => item.depth === undefined),
)

const itemsEpic = computed<Item[]>(() =>
  filteredItems.value.filter(
    (item: Item) => item.depth === 2 && !item.tags?.includes('Boots'),
  ),
)

const itemsLegendary = computed<Item[]>(() =>
  filteredItems.value.filter(
    (item: Item) => item.depth === 3 && !item.tags?.includes('Boots'),
  ),
)
</script>

<template>
  <div data-v-c3d704f8="" class="main">
    <div data-v-c8040147="" data-v-c3d704f8="" class="items-page">
      <div data-v-aa396e7d="" data-v-c8040147="" class="grid">
        <div data-v-aa396e7d="" class="search">
          <form data-v-c8040147="">
            <label class="small"
              ><input placeholder="Search" type="search"
            /></label>
          </form>
        </div>
        <div data-v-aa396e7d="" class="filter">
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('all')"
          >
            Tous
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('Damage'),
            }"
            @click="toggleTag('Damage')"
          >
            Attack Damage
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('CriticalStrike'),
            }"
            @click="toggleTag('CriticalStrike')"
          >
            Critical Strike
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('AttackSpeed'),
            }"
            @click="toggleTag('AttackSpeed')"
          >
            Attack Speed
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('OnHit'),
            }"
            @click="toggleTag('OnHit')"
          >
            On-Hit
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('ArmorPenetration'),
            }"
            @click="toggleTag('ArmorPenetration')"
          >
            Armor Pen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('SpellDamage'),
            }"
            @click="toggleTag('SpellDamage')"
          >
            Ability Power
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('Mana'),
            }"
            @click="toggleTag('Mana')"
          >
            Mana
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('ManaRegen'),
            }"
            @click="toggleTag('ManaRegen')"
          >
            Mana Regen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('MagicPenetration'),
            }"
            @click="toggleTag('MagicPenetration')"
          >
            Magic Pen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('Health'),
            }"
            @click="toggleTag('Health')"
          >
            Health
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('HealthRegen'),
            }"
            @click="toggleTag('HealthRegen')"
          >
            Health Regen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('Armor'),
            }"
            @click="toggleTag('Armor')"
          >
            Armor
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('SpellBlock'),
            }"
            @click="toggleTag('SpellBlock')"
          >
            Magic Resist
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('AbilityHaste'),
            }"
            @click="toggleTag('AbilityHaste')"
          >
            Ability Haste
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('NonbootsMovement'),
            }"
            @click="toggleTag('NonbootsMovement')"
          >
            Movement
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('LifeSteal'),
            }"
            @click="toggleTag('LifeSteal')"
          >
            Life Steal
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            :class="{
              active: selectedTags.includes('SpellVamp'),
            }"
            @click="toggleTag('SpellVamp')"
          >
            Omnivamp
          </button>
        </div>

        <div
          data-v-aa396e7d=""
          class="group type-grid"
          v-if="itemsStarter.length > 0"
        >
          Starter items
        </div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsStarter"
          :key="index"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
              />
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                {{ item.gold.total }}
              </div>
            </button>
            <ItemTooltip :item="item" />
          </div>
        </div>
        <div data-v-aa396e7d="" class="divider"></div>

        <div
          data-v-aa396e7d=""
          class="group type-grid"
          v-if="itemsBasic.length > 0"
        >
          Basic items
        </div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsBasic"
          :key="index"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
              />
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                {{ item.gold.total }}
              </div>
            </button>
            <ItemTooltip :item="item" />
          </div>
        </div>
        <div data-v-aa396e7d="" class="divider"></div>
        <div
          data-v-aa396e7d=""
          class="group type-grid"
          v-if="itemsBoots.length > 0"
        >
          Boots items
        </div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsBoots"
          :key="index"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
              />
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                {{ item.gold.total }}
              </div>
            </button>
            <ItemTooltip :item="item" />
          </div>
        </div>
        <div data-v-aa396e7d="" class="divider"></div>
        <div
          data-v-aa396e7d=""
          class="group type-grid"
          v-if="itemsEpic.length > 0"
        >
          Epic items
        </div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsEpic"
          :key="index"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
              />
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                {{ item.gold.total }}
              </div>
            </button>
            <ItemTooltip :item="item" />
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
        <div
          data-v-aa396e7d=""
          class="group type-grid"
          v-if="itemsLegendary.length > 0"
        >
          Legendary items
        </div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsLegendary"
          :key="index"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
              />
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                {{ item.gold.total }}
              </div>
            </button>
            <ItemTooltip :item="item" />
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
      </div>
    </div>
    <div data-v-c3d704f8="" class="next off">
      <button data-v-c3d704f8="">Next</button>
    </div>
  </div>
</template>
