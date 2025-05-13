<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

import {
  type ChampionData,
  type TierStats,
  type TierList,
  TIER_COLORS,
  TIER_DESCRIPTIONS,
} from '@/types/tier-list'
import { useRouter } from 'vue-router'
import { useConnexionStore } from '@/stores/connexionStore'

const router = useRouter()
const connexionStore = useConnexionStore()

if (!connexionStore.isLoggedIn) {
  router.push('/')
}

const validRoles = ['TOPLANE', 'JUNGLE', 'MIDLANE', 'ADC-BOT', 'SUPPORT']

function isValidRole(
  role: string,
): role is 'TOPLANE' | 'JUNGLE' | 'MIDLANE' | 'ADC-BOT' | 'SUPPORT' {
  return validRoles.includes(role)
}

Chart.register(...registerables)
const selectedRole = ref<
  'TOPLANE' | 'JUNGLE' | 'MIDLANE' | 'ADC-BOT' | 'SUPPORT'
>('TOPLANE')
let currentChart: Chart<'bar', number[], string> | null = null

let championsData: Array<TierStats> = []

const tierData = ref<TierList>({
  GRAPH: [],
  TOPLANE: [],
  JUNGLE: [],
  MIDLANE: [],
  'ADC-BOT': [],
  SUPPORT: [],
  TierList: [],
  Resultats: [],
})

const selectedList = ref<'normal' | 'bronze' | 'pro'>('normal')

const availableFiles = ref<Record<string, string[]>>({})
const selectedFile = ref<string>('tierlist')

const fetchAvailableFiles = async () => {
  try {
    const response = await fetch('/api/tierlist/all')
    if (!response.ok)
      throw new Error('Erreur lors de la récupération des listes')
    const allFiles = await response.json()

    availableFiles.value = Object.fromEntries(
      Object.entries(allFiles).map(([category, files]) => [
        category,
        (files as string[]).filter(file => !file.startsWith('private_')),
      ]),
    )
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const loadTierData = async () => {
  try {
    const response = await fetch(
      `/assets/files/tiers-listes/${selectedList.value}/${selectedFile.value}.json`,
    )
    if (!response.ok) throw new Error('Erreur lors du chargement des données')
    tierData.value = await response.json()
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const filterType = ref<'all' | 'otp' | 'no-otp'>('no-otp')

const processRoleData = (role: string) => {
  if (!isValidRole(role)) {
    throw new Error(`Invalid role: ${role}`)
  }

  championsData = []
  const data = tierData.value[role] as ChampionData[]

  data.forEach(champion => {
    if (champion && champion.name && champion.name !== 'CHAMPION') {
      championsData.push({
        name: champion.name,
        image: champion.image || '',
        score: Number(champion.Column2) || 0,
        tier: champion.Column || '',
        matchups: Number(champion.Column3) || 0,
        pickrate: Number(champion.Column4) || 0,
        bestMatchup: [
          champion.Column15 || '',
          champion.Column16 || '',
          champion.Column14 || '',
        ]
          .filter(Boolean)
          .join(', '),
        worstMatchup: [
          champion.Column20 || '',
          champion.Column19 || '',
          champion.Column21 || '',
        ]
          .filter(Boolean)
          .join(', '),
        otp: champion.Column1 === 'OTP',
      })
    }
  })

  championsData.sort((a, b) => a.score - b.score)

  if (filterType.value === 'otp') {
    championsData = championsData.filter(champion => champion.otp)
  } else if (filterType.value === 'no-otp') {
    championsData = championsData.filter(champion => !champion.otp)
  }

  return {
    title: `TIERLIST : ${role}`,
    champions: championsData.map(c => c.name),
    scores: championsData.map(c => c.score),
    tiers: championsData.map(c => c.tier),
    matchups: championsData.map(c => c.matchups),
    pickrate: championsData.map(c => c.pickrate),
    bestMatchup: championsData.map(c => c.bestMatchup),
    worstMatchup: championsData.map(c => c.worstMatchup),
    name: championsData.map(c => c.name),
    image: championsData.map(c => c.image),
  }
}

const formatChampionName = (name: string): string => {
  if (name === "Cho'Gath") {
    return 'Chogath'
  } else if (name === 'Wukong') {
    return 'MonkeyKing'
  } else if (name === "Bel'Veth") {
    return 'Belveth'
  } else if (name === "Kai'Sa") {
    return 'Kaisa'
  } else if (name === "Kha'Zix") {
    return 'Khazix'
  } else if (name === 'LeBlanc') {
    return 'Leblanc'
  } else if (name === "Vel'Koz") {
    return 'Velkoz'
  }

  return name.replace(/['\s.-]/g, '').replace(/&/g, 'and')
}
const selectedTier = ref<string | null>(null)

const createChart = async () => {
  await nextTick()
  const ctx = document.getElementById('tierlistChart') as HTMLCanvasElement

  currentChart?.destroy()
  currentChart = null

  const isMobile = window.innerWidth <= 768

  const roleInfo = processRoleData(selectedRole.value)

  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: roleInfo.champions.map(champion => champion || ''),
      datasets: [
        {
          data: roleInfo.scores.map(score => score || 0),
          backgroundColor: context => {
            const tier = roleInfo.tiers[context.dataIndex]
            const color = TIER_COLORS[tier as keyof typeof TIER_COLORS]
            return selectedTier.value && tier !== selectedTier.value
              ? `${color}26`
              : `${color}FF`
          },
        },
      ],
    },
    options: {
      animation: {
        duration: 0,
      },
      indexAxis: window.innerWidth <= 768 ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: !isMobile,
      plugins: {
        tooltip: {
          enabled: true,
          yAlign: 'bottom',
          callbacks: {
            title: tooltipItems => {
              return roleInfo.champions[tooltipItems[0].dataIndex]
            },
            label: context => {
              return `Score: ${context.parsed.y}`
            },
          },
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: roleInfo.title,
          color: '#f0e6d2',
          font: {
            size: 24,
            weight: 'bold',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#f0e6d2',
            maxRotation: window.innerWidth <= 768 ? 0 : 45,
          },
        },
        y: {
          grid: {
            color: '#5b5a56',
          },
          ticks: {
            color: '#f0e6d2',
            autoSkip: true,
          },
        },
      },
    },
  })
}

watch(
  [selectedRole, selectedTier, filterType, selectedList, selectedFile],
  async () => {
    await fetchAvailableFiles()
    await loadTierData()
    await createChart()
  },
)

onMounted(async () => {
  await fetchAvailableFiles()
  await loadTierData()
  await createChart()
})

onBeforeUnmount(() => {
  if (currentChart) {
    currentChart.destroy()
    currentChart = null
  }
  window.removeEventListener('resize', createChart)
})

const getTierDescription = (tier: string) => {
  return TIER_DESCRIPTIONS[tier as keyof typeof TIER_DESCRIPTIONS] || ''
}

const toggleTier = (tier: string) => {
  selectedTier.value = selectedTier.value === tier ? null : tier
}

const getChampionsInTier = (tier: string) => {
  if (!selectedTier.value || selectedTier.value !== tier) return []

  return championsData.filter(champion => champion.tier === tier)
}

window.addEventListener('resize', () => {
  createChart()
})

const displayMode = ref<'graph' | 'list'>('graph')

const sortBy = ref<'score' | 'pickrate' | 'tier'>('score')
const sortOrder = ref<'asc' | 'desc'>('desc')
const searchType = ref<'name' | 'easy' | 'hard'>('name')
const searchQuery = ref('')

const sortedAndFilteredChampions = computed(() => {
  const roleData = tierData.value[selectedRole.value] as ChampionData[]
  let filtered: TierStats[] = []

  roleData.forEach(champion => {
    if (champion && champion.name && champion.name !== 'CHAMPION') {
      filtered.push({
        name: champion.name,
        image: champion.image || '',
        score: Number(champion.Column2) || 0,
        tier: champion.Column || '',
        matchups: Number(champion.Column3) || 0,
        pickrate: Number(champion.Column4) || 0,
        bestMatchup: [
          champion.Column15 || '',
          champion.Column16 || '',
          champion.Column14 || '',
        ]
          .filter(Boolean)
          .join(', '),
        worstMatchup: [
          champion.Column20 || '',
          champion.Column19 || '',
          champion.Column21 || '',
        ]
          .filter(Boolean)
          .join(', '),
        otp: champion.Column1 === 'OTP',
      })
    }
  })

  if (filterType.value === 'otp') {
    filtered = filtered.filter(champion => champion?.otp)
  } else if (filterType.value === 'no-otp') {
    filtered = filtered.filter(champion => !champion?.otp)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(champion => {
      switch (searchType.value) {
        case 'name':
          return champion?.name?.toLowerCase().includes(query)
        case 'easy':
          return champion?.bestMatchup?.toLowerCase().includes(query)
        case 'hard':
          return champion?.worstMatchup?.toLowerCase().includes(query)
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => {
    const factor = sortOrder.value === 'desc' ? -1 : 1

    switch (sortBy.value) {
      case 'tier':
        const tierOrder = { 'S+': 6, S: 5, A: 4, B: 3, C: 2, F: 1 }
        return (
          (tierOrder[b?.tier as keyof typeof tierOrder] -
            tierOrder[a?.tier as keyof typeof tierOrder]) *
          factor
        )
      case 'score':
        return (a?.score - b?.score) * factor
      case 'pickrate':
        return (a?.pickrate - b?.pickrate) * factor
      default:
        return 0
    }
  })
})
</script>

<template>
  <div class="statistique-container">
    <div class="tabs-container">
      <div class="tier-type-tabs tab-group">
        <button
          v-for="type in ['normal', 'bronze', 'pro']"
          :key="type"
          :class="{ active: selectedList === type }"
          @click="selectedList = type as 'normal' | 'bronze' | 'pro'"
        >
          {{
            type === 'normal'
              ? 'TIER-LISTE'
              : type === 'bronze'
                ? 'BRONZE-LISTE'
                : 'PRO-LISTE'
          }}
        </button>
      </div>

      <div class="display-mode-selector tab-group">
        <button
          v-for="mode in ['graph', 'list']"
          :key="mode"
          :class="{ active: displayMode === mode }"
          @click="displayMode = mode as 'graph' | 'list'"
        >
          {{ mode === 'graph' ? 'GRAPHIQUE' : 'LISTE' }}
        </button>
      </div>

      <div class="role-tabs tab-group">
        <button
          v-for="role in ['TOPLANE', 'JUNGLE', 'MIDLANE', 'ADC-BOT', 'SUPPORT']"
          :key="role"
          :class="{ active: selectedRole === role }"
          @click="
            selectedRole = role as
              | 'TOPLANE'
              | 'JUNGLE'
              | 'MIDLANE'
              | 'ADC-BOT'
              | 'SUPPORT'
          "
        >
          {{ role.replace('LANE', '').replace('-BOT', '') }}
        </button>
        <select v-model="filterType" class="filter-select">
          <option value="all">Tous</option>
          <option value="otp">OTP</option>
          <option value="no-otp">Sans OTP</option>
        </select>
      </div>

      <div
        class="file-selector"
        v-if="availableFiles[selectedList]?.length > 1"
      >
        <select v-model="selectedFile" class="file-select">
          <option
            v-for="file in availableFiles[selectedList]"
            :key="file"
            :value="file"
          >
            {{ file }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="displayMode === 'graph'" class="chart-container">
      <div class="legend">
        <div
          v-for="(color, tier) in TIER_COLORS"
          :key="tier"
          class="legend-item"
          :class="{
            active: selectedTier === tier,
            inactive: selectedTier && selectedTier !== tier,
          }"
          @click="toggleTier(tier)"
        >
          <div class="color-box" :style="{ backgroundColor: color }"></div>
          <div class="legend-text">
            <span class="tier">{{ tier }}</span>
            <span class="description">{{ getTierDescription(tier) }}</span>
          </div>
        </div>
      </div>
      <canvas id="tierlistChart"></canvas>
    </div>
    <div v-else class="tier-list-container">
      <div class="list-controls">
        <div class="search-controls">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher..."
            class="search-input"
          />
          <select v-model="searchType" class="search-type">
            <option value="name">Nom</option>
            <option value="easy">Matchup Facile</option>
            <option value="hard">Matchup Difficile</option>
          </select>
        </div>
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="tier">Tier</option>
            <option value="score">Score CP</option>
            <option value="pickrate">Pickrate</option>
          </select>
          <button
            class="sort-order"
            @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
          >
            {{ sortOrder === 'desc' ? '↓' : '↑' }}
          </button>
        </div>
      </div>

      <div class="tier-list-header">
        <div class="tier-col">{{ $t('statistique.tier') }}</div>
        <div class="champion-col">{{ $t('statistique.champion') }}</div>
        <div class="score-col">{{ $t('statistique.score') }}</div>
        <div class="pickrate-col">{{ $t('statistique.pickrate') }}</div>
        <div class="matchups-col">{{ $t('statistique.matchups') }}</div>
        <div class="matchups-col">{{ $t('statistique.matchups-hard') }}</div>
      </div>

      <div
        v-for="champion in sortedAndFilteredChampions"
        :key="champion?.name"
        class="tier-list-row"
        :class="{ 'otp-champion': champion?.otp }"
      >
        <div
          class="tier-col"
          :style="{
            color: TIER_COLORS[champion?.tier as keyof typeof TIER_COLORS],
          }"
        >
          {{ champion?.tier }}
        </div>
        <div class="champion-col">
          <img
            class="champion-icon"
            :src="`/assets/icons/champions/${formatChampionName(champion?.name || '')}.png`"
            :alt="champion?.name || ''"
          />
          <span>{{ champion?.name || '' }}</span>
          <span v-if="champion?.otp" class="otp-badge">{{
            $t('statistique.otp')
          }}</span>
        </div>
        <div class="score-col">{{ champion?.score || 0 }}</div>
        <div class="pickrate-col">
          {{ champion?.pickrate?.toFixed(2) || 0 }}
        </div>
        <div class="matchups-col easy-matchups">
          <span
            v-for="(matchup, index) in champion?.bestMatchup?.split(',')"
            :key="index"
          >
            {{ matchup.trim() }}
          </span>
        </div>
        <div class="matchups-col hard-matchups">
          <span
            v-for="(matchup, index) in champion?.worstMatchup?.split(',')"
            :key="index"
          >
            {{ matchup.trim() }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="selectedTier" class="tier-details">
    <div class="tier-champions">
      <div
        v-for="champion in getChampionsInTier(selectedTier)"
        :key="champion.name"
        class="champion-item"
      >
        <img
          class="tier-list-icon"
          :src="
            '/assets/icons/champions/' +
            formatChampionName(champion.name) +
            '.png'
          "
          :style="{
            border:
              '1px solid ' +
              TIER_COLORS[selectedTier as keyof typeof TIER_COLORS],
          }"
          :alt="champion.name"
        />
        <span
          class="champion-score"
          :style="{
            color: TIER_COLORS[selectedTier as keyof typeof TIER_COLORS],
          }"
        >
          Score : {{ champion.score }}
        </span>
        <span
          class="champion-score"
          :style="{
            color: TIER_COLORS[selectedTier as keyof typeof TIER_COLORS],
          }"
        >
          Pickrate : {{ champion.pickrate }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}

.tab-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 0 1rem;
}

.tab-group button {
  flex: 0 1 auto;
  min-width: 120px;
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-beaufort);
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.tab-group button:hover {
  background-color: var(--color-gold-300);
  color: var(--color-grey-900);
}

.tab-group button.active {
  background-color: var(--color-gold-300);
  color: var(--color-grey-900);
}

.filter-select {
  min-width: 120px;
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-beaufort);
  text-transform: uppercase;
}

.filter-select:hover {
  border-color: var(--color-gold-500);
}

.filter-select option {
  background-color: var(--color-grey-900);
  color: var(--color-gold-300);
}

@media (max-width: 768px) {
  .tab-group {
    flex-wrap: wrap;
  }

  .tab-group button,
  .filter-select {
    flex: 1 1 auto;
    min-width: 100px;
    font-size: 0.9rem;
    padding: 0.5rem;
  }
}

.tier-list-container {
  width: 100%;
  margin-top: 1rem;
  color: var(--color-gold-300);
}

.tier-list-header,
.tier-list-row {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr 2fr 2fr;
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-gold-300);
  align-items: center;
}

.tier-list-header {
  font-weight: bold;
  text-transform: uppercase;
  background-color: var(--color-grey-900);
}

.tier-col {
  font-weight: bold;
  text-align: center;
  font-size: 1.2rem;
  font-family: var(--font-beaufort);
}

.champion-col {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.champion-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-gold-300);
}

.otp-badge {
  background-color: var(--color-gold-300);
  color: var(--color-grey-500);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 0.5rem;
}

.easy-matchups {
  color: var(--color-green-500);
}

.hard-matchups {
  color: var(--color-red-500);
}

.matchups-col span:not(:last-child)::after {
  content: ', ';
}

@media (max-width: 768px) {
  .tier-list-header,
  .tier-list-row {
    grid-template-columns: 60px 2fr 1fr 1fr;
  }

  .matchups-col {
    display: none;
  }
}

.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  padding: 0 0.5rem;
}

.search-controls {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.search-input {
  flex: 1;
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.5rem;
  border-radius: 4px;
  font-family: var(--font-beaufort);
}

.search-type,
.sort-select {
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-beaufort);
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.sort-order {
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .list-controls {
    flex-direction: column;
  }

  .search-controls,
  .sort-controls {
    width: 100%;
  }
}

.file-selector {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.file-select {
  min-width: 200px;
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-beaufort);
}

.file-select option {
  background: var(--color-grey-900);
  color: var(--color-gold-300);
}
</style>
