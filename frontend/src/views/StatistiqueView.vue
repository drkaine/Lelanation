<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, computed } from 'vue'

const instanceId = Math.random().toString(36).substr(2, 9)
const chartId = computed(() => `tierlistChart-${instanceId}`)
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
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Statistiques LoL - Tier Lists et Analytics League of Legends',
  description:
    'Analysez les statistiques des champions et des builds League of Legends. Tier lists détaillées, win rates et méta analysis.',
  keywords:
    'statistiques LoL, tier list League of Legends, win rate champions, méta LoL, analytics gaming',
  type: 'article',
})

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
    const response = await fetch('/api/tierlist/all', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    if (!response.ok)
      throw new Error('Erreur lors de la récupération des listes')
    const allFiles = await response.json()

    availableFiles.value = Object.fromEntries(
      Object.entries(allFiles).map(([category, files]) => [
        category,
        (files as string[]).filter(file => !file.startsWith('private_')),
      ]),
    )

    const currentFiles = availableFiles.value[selectedList.value] || []
    if (!currentFiles.includes(selectedFile.value) && currentFiles.length > 0) {
      selectedFile.value = currentFiles[0]
    }
  } catch (error) {
    console.error('Erreur:', error)
    availableFiles.value = { normal: [], bronze: [], pro: [] }
  }
}

const loadTierData = async () => {
  try {
    const filePath = `/assets/files/tiers-listes/${selectedList.value}/${selectedFile.value}.json`

    const response = await fetch(filePath, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Erreur lors du chargement des données: ${response.status}`,
      )
    }

    const data = await response.json()
    tierData.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    tierData.value = {
      GRAPH: [],
      TOPLANE: [],
      JUNGLE: [],
      MIDLANE: [],
      'ADC-BOT': [],
      SUPPORT: [],
      TierList: [],
      Resultats: [],
    }
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
  const ctx = document.getElementById(chartId.value) as HTMLCanvasElement

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

watch([selectedRole, selectedTier, filterType], async () => {
  await createChart()
})

watch([selectedList, selectedFile], async () => {
  await loadTierData()
  await createChart()
})

watch(selectedList, async () => {
  const currentFiles = availableFiles.value[selectedList.value] || []
  if (currentFiles.length > 0 && !currentFiles.includes(selectedFile.value)) {
    selectedFile.value = currentFiles[0]
  }
})

onMounted(async () => {
  await fetchAvailableFiles()

  if (availableTabs.value.length > 0) {
    if (!availableTabs.value.includes(selectedList.value)) {
      selectedList.value = availableTabs.value[0] as 'normal' | 'bronze' | 'pro'
    }

    const currentFiles = availableFiles.value[selectedList.value] || []
    if (currentFiles.length > 0 && !currentFiles.includes(selectedFile.value)) {
      selectedFile.value = currentFiles[0]
    }
  }

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
const selectedTierFilter = ref<string | 'all'>('all')

const availableTabs = computed(() => {
  return ['normal', 'bronze', 'pro'].filter(
    type => availableFiles.value[type]?.length > 0,
  )
})

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

  if (selectedTierFilter.value !== 'all') {
    filtered = filtered.filter(
      champion => champion?.tier === selectedTierFilter.value,
    )
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
    <h1 class="page-title">{{ $t('navigation.statistique') }}</h1>
    <div class="tabs-container">
      <div class="tier-type-tabs tab-group" v-if="availableTabs.length > 0">
        <button
          v-for="type in availableTabs"
          :key="type"
          :class="{ active: selectedList === type }"
          @click="selectedList = type as 'normal' | 'bronze' | 'pro'"
        >
          {{
            type === 'normal'
              ? $t('statistique.tier-list')
              : type === 'bronze'
                ? $t('statistique.bronze-list')
                : $t('statistique.pro-list')
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
          {{
            mode === 'graph' ? $t('statistique.graph') : $t('statistique.list')
          }}
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
          <option value="all">{{ $t('statistique.all') }}</option>
          <option value="otp">{{ $t('statistique.otp') }}</option>
          <option value="no-otp">{{ $t('statistique.no-otp') }}</option>
        </select>
      </div>

      <div
        class="file-selector"
        v-if="availableFiles[selectedList]?.length > 1"
      >
        <label class="file-selector-label">
          {{ $t('statistique.select-file') || 'Sélectionner une tier list :' }}
        </label>
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

    <div v-if="availableTabs.length === 0" class="no-data-message">
      <p>
        {{
          $t('statistique.no-tierlists') ||
          "Aucune tier list disponible. Veuillez en importer une depuis l'administration."
        }}
      </p>
    </div>

    <div v-else-if="displayMode === 'graph'" class="chart-container">
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
          <div
            class="color-box"
            :class="`tier-bg-${tier.toLowerCase().replace('+', 'plus')}`"
          ></div>
          <div class="legend-text">
            <span class="tier">{{ tier }}</span>
            <span class="description">{{ getTierDescription(tier) }}</span>
          </div>
        </div>
      </div>
      <canvas :id="chartId"></canvas>
    </div>
    <div v-else-if="availableTabs.length > 0" class="tier-list-container">
      <div class="list-controls">
        <div class="search-controls">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('statistique.search')"
            class="search-input"
          />
          <select v-model="searchType" class="search-type">
            <option value="name">{{ $t('statistique.search-name') }}</option>
            <option value="easy">{{ $t('statistique.search-easy') }}</option>
            <option value="hard">{{ $t('statistique.search-hard') }}</option>
          </select>
        </div>
        <div class="filter-controls">
          <select v-model="selectedTierFilter" class="tier-filter">
            <option value="all">{{ $t('statistique.all-tiers') }}</option>
            <option value="S+">S+</option>
            <option value="S">S</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="F">F</option>
          </select>
        </div>
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="tier">{{ $t('statistique.tier') }}</option>
            <option value="score">{{ $t('statistique.score') }}</option>
            <option value="pickrate">{{ $t('statistique.pickrate') }}</option>
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
          :class="`tier-color-${champion?.tier?.toLowerCase().replace('+', 'plus')}`"
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
          :class="`tier-border-${selectedTier?.toLowerCase().replace('+', 'plus')}`"
          :alt="champion.name"
        />
        <span
          class="champion-score"
          :class="`tier-color-${selectedTier?.toLowerCase().replace('+', 'plus')}`"
        >
          {{ $t('statistique.score') }} : {{ champion.score }}
        </span>
        <span
          class="champion-score"
          :class="`tier-color-${selectedTier?.toLowerCase().replace('+', 'plus')}`"
        >
          {{ $t('statistique.pickrate') }} : {{ champion.pickrate }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  color: var(--color-gold-300);
  font-size: var(--title-base);
  margin: 0 0 2rem 0;
  text-align: center;
}

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
.sort-select,
.tier-filter {
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-beaufort);
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
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
  .filter-controls,
  .sort-controls {
    width: 100%;
  }
}

.file-selector {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.file-selector-label {
  color: var(--color-gold-300);
  font-family: var(--font-beaufort);
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
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

.no-data-message {
  text-align: center;
  margin: 3rem 0;
  padding: 2rem;
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}

.no-data-message p {
  color: var(--color-gold-300);
  font-family: var(--font-beaufort);
  font-size: 1.1rem;
  margin: 0;
}

.tier-color-splus {
  color: #ffd700;
}
.tier-color-s {
  color: #32cd32;
}
.tier-color-a {
  color: #4169e1;
}
.tier-color-b {
  color: #87ceeb;
}
.tier-color-c {
  color: #9370db;
}
.tier-color-f {
  color: #ff0000;
}

.tier-bg-splus {
  background-color: #ffd700;
}
.tier-bg-s {
  background-color: #32cd32;
}
.tier-bg-a {
  background-color: #4169e1;
}
.tier-bg-b {
  background-color: #87ceeb;
}
.tier-bg-c {
  background-color: #9370db;
}
.tier-bg-f {
  background-color: #ff0000;
}

.tier-border-splus {
  border: 1px solid #ffd700;
}
.tier-border-s {
  border: 1px solid #32cd32;
}
.tier-border-a {
  border: 1px solid #4169e1;
}
.tier-border-b {
  border: 1px solid #87ceeb;
}
.tier-border-c {
  border: 1px solid #9370db;
}
.tier-border-f {
  border: 1px solid #ff0000;
}
</style>
