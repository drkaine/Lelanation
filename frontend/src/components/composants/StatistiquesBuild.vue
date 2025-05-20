<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stats } from '@/types/stat'
import type { Build } from '@/types/build'

const { t } = useI18n()
const lvl = ref(1)

const showBasicStats = ref(true)
const showDerivedStats = ref(false)
const showEconomicStats = ref(false)

const props = defineProps<{
  build: Build
  total: number
}>()

const updateLevel = (newLevel: number) => {
  lvl.value = newLevel
}

const toggleBasicStats = () => {
  showBasicStats.value = !showBasicStats.value
}

const toggleDerivedStats = () => {
  showDerivedStats.value = !showDerivedStats.value
}

const toggleEconomicStats = () => {
  showEconomicStats.value = !showEconomicStats.value
}

const roundValue = (value: string | number): string => {
  if (typeof value === 'string') {
    const num = parseFloat(value)
    if (isNaN(num)) return value
    return formatNumber(num)
  }
  return formatNumber(value)
}

const formatNumber = (num: number): string => {
  const rounded = Math.round(num * 100) / 100

  if (rounded === Math.floor(rounded)) {
    return rounded.toString()
  }

  return rounded.toString()
}

const getStatTranslation = (stat: string): string => {
  return t(`stats.${stat}`)
}

const statsList = [
  'hp',
  'hpregen',
  'mp',
  'mpregen',
  'armor',
  'spellblock',
  'attackdamage',
  'movespeed',
  'attackrange',
  'attackspeed',
  'CDR',
  'AP',
  'lethality',
  'crit',
  'magicPenetration',
  'shield',
  'omnivamp',
  'tenacity',
  'armorDamageReductionPercent',
  'magicDamageReductionPercent',
  'physicalEffectiveHealth',
  'magicalEffectiveHealth',
  'averageEffectiveHealth',
]

const statCategories: Record<string, string[]> = {
  basic: [
    'hp',
    'hpregen',
    'mp',
    'mpregen',
    'armor',
    'spellblock',
    'attackdamage',
    'movespeed',
    'attackrange',
    'attackspeed',
    'CDR',
    'AP',
    'lethality',
    'crit',
    'magicPenetration',
    'shield',
    'omnivamp',
    'tenacity',
  ],
  derived: [
    'armorDamageReductionPercent',
    'magicDamageReductionPercent',
    'physicalEffectiveHealth',
    'magicalEffectiveHealth',
    'averageEffectiveHealth',
  ],
  economic: ['goldValue', 'goldEfficiency'],
}

const statsListFiltered = statsList.filter(
  stat => props.build.totalStats[lvl.value - 1][stat as keyof Stats] !== '0',
)

const hasBasicStats = computed(() =>
  statsListFiltered.some(s => statCategories.basic.includes(s)),
)

const hasDerivedStats = computed(() =>
  statsListFiltered.some(s => statCategories.derived.includes(s)),
)

const hasEconomicStats = computed(() =>
  statsListFiltered.some(s => statCategories.economic.includes(s)),
)
</script>

<template>
  <div class="stats-panel">
    <table class="stats-table">
      <thead>
        <tr>
          <th>{{ $t('build-recap.statistic') }}</th>
          <th>{{ $t('build-recap.base') }}</th>
          <th>{{ $t('build-recap.items') }}</th>
          <th>{{ $t('build-recap.total') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="stat-category-separator"
          v-if="hasBasicStats"
          @click="toggleBasicStats"
        >
          <td colspan="4" class="stat-category-title">
            <div class="category-header">
              <span>{{ t('stats.categories.basic') }}</span>
              <span class="toggle-icon" :class="{ open: showBasicStats }"
                >▼</span
              >
            </div>
          </td>
        </tr>

        <template v-if="showBasicStats">
          <tr
            v-for="stat in statsListFiltered.filter(s =>
              statCategories.basic.includes(s),
            )"
            :key="stat"
            class="basic-stat"
          >
            <td>{{ getStatTranslation(stat) }}</td>
            <td>
              {{
                roundValue(props.build?.baseStats[lvl - 1][stat as keyof Stats])
              }}
            </td>
            <td>
              {{ roundValue(props.build?.buildItemStats[stat as keyof Stats]) }}
            </td>
            <td>
              {{
                roundValue(
                  props.build?.totalStats[lvl - 1][stat as keyof Stats],
                )
              }}
            </td>
          </tr>
        </template>

        <tr
          class="stat-category-separator"
          v-if="hasDerivedStats"
          @click="toggleDerivedStats"
        >
          <td colspan="4" class="stat-category-title">
            <div class="category-header">
              <span>{{ t('stats.categories.advanced') }}</span>
              <span class="toggle-icon" :class="{ open: showDerivedStats }"
                >▼</span
              >
            </div>
          </td>
        </tr>

        <template v-if="showDerivedStats">
          <tr
            v-for="stat in statsListFiltered.filter(s =>
              statCategories.derived.includes(s),
            )"
            :key="stat"
            class="derived-stat"
          >
            <td>{{ getStatTranslation(stat) }}</td>
            <td>
              {{
                roundValue(props.build?.baseStats[lvl - 1][stat as keyof Stats])
              }}
            </td>
            <td>
              {{ roundValue(props.build?.buildItemStats[stat as keyof Stats]) }}
            </td>
            <td>
              {{
                roundValue(
                  props.build?.totalStats[lvl - 1][stat as keyof Stats],
                )
              }}
            </td>
          </tr>
        </template>

        <tr
          class="stat-category-separator"
          v-if="hasEconomicStats"
          @click="toggleEconomicStats"
        >
          <td colspan="4" class="stat-category-title">
            <div class="category-header">
              <span>{{ t('stats.categories.economic') }}</span>
              <span class="toggle-icon" :class="{ open: showEconomicStats }"
                >▼</span
              >
            </div>
          </td>
        </tr>

        <template v-if="showEconomicStats">
          <tr
            v-for="stat in statsListFiltered.filter(s =>
              statCategories.economic.includes(s),
            )"
            :key="stat"
            class="economic-stat"
          >
            <td>{{ getStatTranslation(stat) }}</td>
            <td>-</td>
            <td>
              {{ roundValue(props.build?.buildItemStats[stat as keyof Stats]) }}
            </td>
            <td>
              {{
                roundValue(
                  props.build?.totalStats[lvl - 1][stat as keyof Stats],
                )
              }}
            </td>
          </tr>
        </template>

        <tr>
          <td>{{ $t('stats.goldValue') }}</td>
          <td>0</td>
          <td>{{ props.total }}</td>
          <td>{{ props.total }}</td>
        </tr>
      </tbody>
    </table>
    <div class="level-selector">
      <div class="level-buttons">
        <button
          v-for="n in 18"
          :key="n"
          :class="['level-btn', { active: lvl === n }]"
          @click="updateLevel(n)"
        >
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  border-radius: 8px;
  padding: 1rem;
}

.stats-table {
  border-collapse: collapse;
  margin-bottom: 0;
  border-bottom: 1px solid var(--color-gold-50);
}

.stats-table th,
.stats-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-gold-50);
}

.stats-table th {
  color: var(--color-gold-300);
  font-weight: bold;
}

.stats-table td {
  color: var(--color-gold-200);
}

.stat-category-separator {
  background-color: rgba(218, 165, 32, 0.05);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.stat-category-separator:hover {
  background-color: rgba(218, 165, 32, 0.1);
}

.stat-category-title {
  color: var(--color-gold-300);
  font-weight: bold;
  text-align: left;
  padding: 0.5rem 1rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-icon {
  font-size: 10px;
  transition: transform 0.3s ease;
  display: inline-block;
  color: var(--color-gold-300);
}

.toggle-icon.open {
  transform: rotate(180deg);
}

.level-selector {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--color-grey-300);
  margin-top: -1px;
}

.level-buttons {
  display: grid;
  grid-template-columns: repeat(18, 30px);
  gap: 0.5rem;
  justify-content: center;
}

.level-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  border: var(--border-size) solid transparent;
  color: var(--color-gold-300);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-btn:hover {
  border-color: var(--color-grey-300);
}

.level-btn.active {
  border-color: var(--color-gold-300);
  color: var(--color-grey-300);
  font-weight: bold;
}

@media (max-width: 768px) {
  .build-recap {
    padding: 1rem;
  }

  .sheet-section {
    max-width: 100%;
  }

  .build-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .actions-panel {
    margin-right: -10px;
  }

  .stats-table {
    font-size: var(--text-sm);
  }

  .stats-table th,
  .stats-table td {
    padding: 0.5rem;
  }

  .level-buttons {
    grid-template-columns: repeat(6, 25px);
    grid-template-rows: repeat(3, 25px);
  }

  .level-btn {
    width: 25px;
    height: 25px;
    font-size: var(--text-xs);
  }
}
</style>
