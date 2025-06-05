<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stats } from '@/types/stat'
import type { Build } from '@/types/build'
import type { ShardSelection } from '@/types/shard'
import type { Champion } from '@/types/champion'
import { calculateShardStats } from '@/components/script/BuildCalculator'
import { STAT_GOLD_VALUES } from '@/components/script/StatsCalculator'

const { t } = useI18n()
const lvl = ref(1)

const showBasicStats = ref(true)
const showDerivedStats = ref(false)
const showEconomicStats = ref(false)

const props = defineProps<{
  build: Build
  total: number
  shards?: ShardSelection
  champion?: Champion
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

const getShardStatsForLevel = (level: number) => {
  const currentBonusAD = parseFloat(
    typeof props.build?.buildItemStats.attackdamage === 'string'
      ? props.build.buildItemStats.attackdamage
      : String(props.build?.buildItemStats.attackdamage || 0),
  )

  const currentAP = parseFloat(
    typeof props.build?.buildItemStats.AP === 'string'
      ? props.build.buildItemStats.AP
      : String(props.build?.buildItemStats.AP || 0),
  )

  return calculateShardStats(
    props.shards,
    props.champion,
    currentBonusAD,
    currentAP,
    level,
  )
}

const getShardStatValue = (stat: string, level: number): string => {
  const shardStats = getShardStatsForLevel(level)

  if (stat === 'goldValue') {
    const goldValue =
      shardStats.hp * STAT_GOLD_VALUES.hp +
      shardStats.attackdamage * STAT_GOLD_VALUES.attackdamage +
      shardStats.AP * STAT_GOLD_VALUES.AP +
      shardStats.attackspeed * 100 * STAT_GOLD_VALUES.attackspeed +
      shardStats.CDR * STAT_GOLD_VALUES.abilityhaste +
      shardStats.movespeed * STAT_GOLD_VALUES.movespeed +
      shardStats.tenacity * 20
    return roundValue(goldValue)
  }

  const value = shardStats[stat as keyof typeof shardStats] || 0
  return roundValue(value)
}

const statsList = [
  'hp',

  'mp',
  'attackdamage',
  'AP',
  'attackspeed',
  'armor',
  'spellblock',

  'hpregen',
  'mpregen',
  'movespeed',
  'attackrange',

  'CDR',

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
  'goldValue',
  'goldEfficiency',
]

const statCategories: Record<string, string[]> = {
  basic: [
    'hp',

    'mp',
    'attackdamage',
    'AP',
    'attackspeed',
    'armor',
    'spellblock',

    'hpregen',
    'mpregen',
    'movespeed',
    'attackrange',

    'CDR',

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

const alwaysDisplayStats = [
  'AP',
  'attackdamage',
  'hp',
  'armor',
  'spellblock',
  'attackspeed',
  'goldValue',
]

const statsListFiltered = computed(() =>
  statsList.filter(stat => {
    const totalStatValue =
      props.build.totalStats[lvl.value - 1][stat as keyof Stats]
    const total = parseFloat(
      typeof totalStatValue === 'string'
        ? totalStatValue
        : String(totalStatValue || 0),
    )

    if (alwaysDisplayStats.includes(stat)) {
      return !isNaN(total)
    }

    return !isNaN(total) && total !== 0
  }),
)

const basicStatsFiltered = computed(() =>
  statsListFiltered.value.filter((s: string) =>
    statCategories.basic.includes(s),
  ),
)

const derivedStatsFiltered = computed(() =>
  statsListFiltered.value.filter((s: string) =>
    statCategories.derived.includes(s),
  ),
)

const economicStatsFiltered = computed(() =>
  statsListFiltered.value.filter((s: string) =>
    statCategories.economic.includes(s),
  ),
)

const hasBasicStats = computed(() =>
  statsListFiltered.value.some((s: string) => statCategories.basic.includes(s)),
)

const hasDerivedStats = computed(() =>
  statsListFiltered.value.some((s: string) =>
    statCategories.derived.includes(s),
  ),
)

const hasEconomicStats = computed(() =>
  statsListFiltered.value.some((s: string) =>
    statCategories.economic.includes(s),
  ),
)
</script>

<template>
  <div class="stats-panel">
    <table class="stats-table">
      <thead>
        <tr>
          <th>
            <div class="statistic-header">
              {{ $t('build-recap.statistic') }}
              <div class="info-icon" :title="$t('stats.disclaimer')">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
            </div>
          </th>
          <th>{{ $t('build-recap.base') }}</th>
          <th>{{ $t('build-recap.items') }}</th>
          <th>{{ $t('build-recap.shards') }}</th>
          <th>{{ $t('build-recap.total') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="stat-category-separator"
          v-if="hasBasicStats"
          @click="toggleBasicStats"
        >
          <td colspan="5" class="stat-category-title">
            <div class="category-header">
              <span>{{ t('stats.categories.basic') }}</span>
              <span class="toggle-icon" :class="{ open: showBasicStats }"
                >▼</span
              >
            </div>
          </td>
        </tr>

        <template v-if="showBasicStats">
          <tr v-for="stat in basicStatsFiltered" :key="stat" class="basic-stat">
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
              {{ getShardStatValue(stat, lvl) }}
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
          <td colspan="5" class="stat-category-title">
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
            v-for="stat in derivedStatsFiltered"
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
              {{ getShardStatValue(stat, lvl) }}
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
          <td colspan="5" class="stat-category-title">
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
            v-for="stat in economicStatsFiltered"
            :key="stat"
            class="economic-stat"
          >
            <td>{{ getStatTranslation(stat) }}</td>
            <td>
              {{
                stat === 'goldValue'
                  ? roundValue(
                      props.build?.baseStats[lvl - 1][stat as keyof Stats],
                    )
                  : '-'
              }}
            </td>
            <td>
              {{ roundValue(props.build?.buildItemStats[stat as keyof Stats]) }}
            </td>
            <td>
              {{ stat === 'goldValue' ? getShardStatValue(stat, lvl) : '-' }}
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.stats-table {
  border-collapse: collapse;
  margin-bottom: 0;
  border-bottom: 1px solid var(--color-gold-50);
  width: 100%;
  min-width: 600px;
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

.statistic-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-icon {
  color: var(--color-gold-400);
  cursor: help;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
}

.info-icon:hover {
  opacity: 1;
}

.level-selector {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--color-grey-300);
  margin-top: -1px;
  width: 100%;
}

.level-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
  width: 100%;
}

.level-btn {
  flex: 1;
  min-width: 30px;
  max-width: 40px;
  height: 30px;
  padding: 0;
  border: var(--border-size) solid transparent;
  background: var(--color-grey-700);
  color: var(--color-gold-300);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  z-index: 1;
}

.level-btn:hover {
  border-color: var(--color-gold-300);
  background: var(--color-grey-600);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.level-btn.active {
  border-color: var(--color-gold-300);
  background: var(--color-gold-300);
  color: var(--color-grey-800);
  font-weight: bold;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

  .stats-panel {
    max-width: 100%;
    padding: 0.5rem;
  }

  .stats-table {
    min-width: 100%;
    font-size: var(--text-sm);
  }

  .level-buttons {
    justify-content: center;
    gap: 0.25rem;
  }

  .level-btn {
    min-width: 25px;
    max-width: 30px;
    height: 25px;
    font-size: var(--text-xs);
  }
}
</style>
