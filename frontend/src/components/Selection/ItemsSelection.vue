<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Item } from '@/types/item'
import i18n, { type I18nInternal } from '@/i18n'
import ItemsGrid from '@/components/Selection/ItemsGrid.vue'

const { locale } = useI18n()
const itemsData = ref<Record<string, Item>>({})

const i18nInstance = i18n as unknown as I18nInternal

const loadData = async () => {
  const currentLocale = i18nInstance.global.locale || 'fr'

  try {
    let itemsModule

    if (currentLocale === 'en') {
      itemsModule = await import('@/assets/files/data/en/item.json')
    } else {
      itemsModule = await import('@/assets/files/data/item.json')
    }

    itemsData.value = itemsModule.default.data
  } catch {
    try {
      const itemsModule = await import('@/assets/files/data/item.json')
      itemsData.value = itemsModule.default.data
    } catch (fallbackError) {
      console.error(
        '[ItemsSelection] Fallback loading also failed:',
        fallbackError,
      )
    }
  }
}

watch(
  () => locale.value,
  () => {
    loadData()
  },
)

onMounted(() => {
  loadData()

  window.addEventListener('languageChanged', () => {
    loadData()
  })
})

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

const searchQuery = ref('')
const debouncedSearch = ref('')
const currentPage = ref(1)
const itemsPerPage = 100
const activeCategory = ref('boots')

watch(searchQuery, newValue => {
  const timeoutId = setTimeout(() => {
    debouncedSearch.value = newValue.toLowerCase()
    currentPage.value = 1
  }, 300)

  onBeforeUnmount(() => clearTimeout(timeoutId))
})

watch(selectedTags, () => {
  currentPage.value = 1
})

const setActiveCategory = (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
}

const FILTERED_ITEMS = [
  'Jus chapi-chapo',
  'Promesse empyréenne',
  'Protège-bras pulvérisé',
] as const

const filteredItems = computed<Item[]>(() => {
  let filtered = Object.values(itemsData.value)
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
    .map(id => itemsData.value[id as string])
    .filter(Boolean)
    .filter(item => filteredItems.value.includes(item))
}

const getItemsInto = (item: Item): Item[] => {
  if (!item.into) return []
  return item.into
    .map(id => itemsData.value[id as string])
    .filter(Boolean)
    .filter(item => filteredItems.value.includes(item))
}

const SPECIAL_BOOTS_ITEMS = ['Jambières de métal', 'Lucidité pourpre'] as const

const itemsBoots = computed<Item[]>(() => {
  const boots = filteredItems.value
    .filter((item: Item) => {
      return (
        item.tags?.includes('Boots') ||
        SPECIAL_BOOTS_ITEMS.includes(
          item.name as (typeof SPECIAL_BOOTS_ITEMS)[number],
        )
      )
    })
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0))

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return boots.slice(start, end)
})

const itemsStarter = computed<Item[]>(() => {
  const starter = filteredItems.value
    .filter(
      (item: Item) =>
        (item.depth === undefined && item.tags?.includes('Lane')) ||
        (item.tags?.includes('Jungle') && item.maps['21'] === true) ||
        item.name === 'Larme de la déesse',
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0))

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return starter.slice(start, end)
})

const itemsBasic = computed<Item[]>(() => {
  const basic = filteredItems.value
    .filter(
      (item: Item) =>
        item.depth === undefined &&
        !item.tags?.includes('Lane') &&
        !item.tags?.includes('Jungle') &&
        !item.tags?.includes('Boots'),
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0))

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return basic.slice(start, end)
})

const itemsEpic = computed<Item[]>(() => {
  const epic = filteredItems.value
    .filter(
      (item: Item) =>
        item.into !== undefined &&
        !item.tags?.includes('Boots') &&
        !item.tags?.includes('Consumable') &&
        item.from !== undefined,
    )
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0))

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return epic.slice(start, end)
})

const itemsLegendary = computed<Item[]>(() => {
  const legendary = filteredItems.value
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
    .sort((a: Item, b: Item) => (a.gold.total || 0) - (b.gold.total || 0))

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return legendary.slice(start, end)
})

const totalBoots = computed(
  () =>
    filteredItems.value.filter(
      (item: Item) =>
        item.tags?.includes('Boots') ||
        SPECIAL_BOOTS_ITEMS.includes(
          item.name as (typeof SPECIAL_BOOTS_ITEMS)[number],
        ),
    ).length,
)

const totalStarter = computed(
  () =>
    filteredItems.value.filter(
      (item: Item) =>
        (item.depth === undefined && item.tags?.includes('Lane')) ||
        (item.tags?.includes('Jungle') && item.maps['21'] === true) ||
        item.name === 'Larme de la déesse',
    ).length,
)

const totalBasic = computed(
  () =>
    filteredItems.value.filter(
      (item: Item) =>
        item.depth === undefined &&
        !item.tags?.includes('Lane') &&
        !item.tags?.includes('Jungle') &&
        !item.tags?.includes('Boots'),
    ).length,
)

const totalEpic = computed(
  () =>
    filteredItems.value.filter(
      (item: Item) =>
        item.into !== undefined &&
        !item.tags?.includes('Boots') &&
        !item.tags?.includes('Consumable') &&
        item.from !== undefined,
    ).length,
)

const totalLegendary = computed(
  () =>
    filteredItems.value.filter(
      (item: Item) =>
        item.into === undefined &&
        item.depth !== undefined &&
        item.depth > 1 &&
        !item.tags?.includes('Boots') &&
        !SPECIAL_BOOTS_ITEMS.includes(
          item.name as (typeof SPECIAL_BOOTS_ITEMS)[number],
        ),
    ).length,
)

const currentCategoryItems = computed(() => {
  switch (activeCategory.value) {
    case 'boots':
      return itemsBoots.value
    case 'starter':
      return itemsStarter.value
    case 'basic':
      return itemsBasic.value
    case 'epic':
      return itemsEpic.value
    case 'legendary':
      return itemsLegendary.value
    default:
      return []
  }
})

const currentCategoryTotal = computed(() => {
  switch (activeCategory.value) {
    case 'boots':
      return totalBoots.value
    case 'starter':
      return totalStarter.value
    case 'basic':
      return totalBasic.value
    case 'epic':
      return totalEpic.value
    case 'legendary':
      return totalLegendary.value
    default:
      return 0
  }
})

const totalPages = computed(() =>
  Math.ceil(currentCategoryTotal.value / itemsPerPage),
)
const hasNextPage = computed(() => currentPage.value < totalPages.value)
const hasPrevPage = computed(() => currentPage.value > 1)

const nextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (hasPrevPage.value) {
    currentPage.value--
  }
}
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
        :class="{ active: selectedTags.includes('Damage') }"
        @click="toggleTag('Damage')"
      >
        {{ $t('item.damage') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('CriticalStrike') }"
        @click="toggleTag('CriticalStrike')"
      >
        {{ $t('item.critical-strike') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('AttackSpeed') }"
        @click="toggleTag('AttackSpeed')"
      >
        {{ $t('item.attack-speed') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('OnHit') }"
        @click="toggleTag('OnHit')"
      >
        {{ $t('item.on-hit') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('ArmorPenetration') }"
        @click="toggleTag('ArmorPenetration')"
      >
        {{ $t('item.armor-penetration') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('SpellDamage') }"
        @click="toggleTag('SpellDamage')"
      >
        {{ $t('item.ability-power') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('Mana') }"
        @click="toggleTag('Mana')"
      >
        {{ $t('item.mana') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('ManaRegen') }"
        @click="toggleTag('ManaRegen')"
      >
        {{ $t('item.mana-regen') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('MagicPenetration') }"
        @click="toggleTag('MagicPenetration')"
      >
        {{ $t('item.magic-penetration') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('Health') }"
        @click="toggleTag('Health')"
      >
        {{ $t('item.health') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('HealthRegen') }"
        @click="toggleTag('HealthRegen')"
      >
        {{ $t('item.health-regen') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('Armor') }"
        @click="toggleTag('Armor')"
      >
        {{ $t('item.armor') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('SpellBlock') }"
        @click="toggleTag('SpellBlock')"
      >
        {{ $t('item.magic-resist') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('AbilityHaste') }"
        @click="toggleTag('AbilityHaste')"
      >
        {{ $t('item.ability-haste') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('NonbootsMovement') }"
        @click="toggleTag('NonbootsMovement')"
      >
        {{ $t('item.movement') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('LifeSteal') }"
        @click="toggleTag('LifeSteal')"
      >
        {{ $t('item.life-steal') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('SpellVamp') }"
        @click="toggleTag('SpellVamp')"
      >
        {{ $t('item.omnivamp') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('Consumable') }"
        @click="toggleTag('Consumable')"
      >
        {{ $t('item.consumable') }}
      </button>
      <button
        :class="{ active: selectedTags.includes('all') }"
        @click="toggleTag('all')"
      >
        {{ $t('item.all') }}
      </button>
    </div>

    <div class="category-tabs">
      <button
        :class="{ active: activeCategory === 'boots' }"
        @click="setActiveCategory('boots')"
      >
        {{ $t('item.boots') }} ({{ totalBoots }})
      </button>
      <button
        :class="{ active: activeCategory === 'starter' }"
        @click="setActiveCategory('starter')"
      >
        {{ $t('item.starter') }} ({{ totalStarter }})
      </button>
      <button
        :class="{ active: activeCategory === 'basic' }"
        @click="setActiveCategory('basic')"
      >
        {{ $t('item.basic') }} ({{ totalBasic }})
      </button>
      <button
        :class="{ active: activeCategory === 'epic' }"
        @click="setActiveCategory('epic')"
      >
        {{ $t('item.epic') }} ({{ totalEpic }})
      </button>
      <button
        :class="{ active: activeCategory === 'legendary' }"
        @click="setActiveCategory('legendary')"
      >
        {{ $t('item.legendary') }} ({{ totalLegendary }})
      </button>
    </div>

    <div class="items-container">
      <ItemsGrid
        :items="currentCategoryItems"
        :title="$t(`item.${activeCategory}`)"
        :get-items-from="getItemsFrom"
        :get-items-into="getItemsInto"
        :filtered-items="filteredItems"
      />

      <div v-if="totalPages > 1" class="pagination">
        <button
          :disabled="!hasPrevPage"
          @click="prevPage"
          class="pagination-btn"
        >
          ← Précédent
        </button>
        <span class="pagination-info">
          Page {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          :disabled="!hasNextPage"
          @click="nextPage"
          class="pagination-btn"
        >
          Suivant →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(26, 31, 44, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(200, 155, 60, 0.3);
}

.category-tabs button {
  padding: 8px 16px;
  background: rgba(26, 31, 44, 0.8);
  border: 1px solid rgba(200, 155, 60, 0.3);
  border-radius: 4px;
  color: var(--color-gold-200);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-beaufort);
  font-size: 0.9rem;
}

.category-tabs button:hover {
  border-color: var(--color-gold-400);
  background: rgba(200, 155, 60, 0.1);
}

.category-tabs button.active {
  background: var(--color-gold-400);
  color: var(--color-blue-900);
  border-color: var(--color-gold-500);
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.pagination-btn {
  padding: 8px 16px;
  background: rgba(26, 31, 44, 0.8);
  border: 1px solid rgba(200, 155, 60, 0.3);
  border-radius: 4px;
  color: var(--color-gold-200);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-beaufort);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-gold-400);
  background: rgba(200, 155, 60, 0.1);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--color-gold-300);
  font-family: var(--font-spiegel);
  font-weight: 500;
}

@media (max-width: 768px) {
  .category-tabs {
    gap: 4px;
    padding: 0.5rem;
  }

  .category-tabs button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .pagination {
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .pagination-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

.items-container {
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .items-container {
    flex-direction: column !important;
    gap: 16px;
    align-items: stretch;
  }
}
</style>
