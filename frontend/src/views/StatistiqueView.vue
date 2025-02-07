<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
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

const loadTierData = async () => {
  try {
    const response = await fetch(
      '/assets/files/tiers-listes/normal/tierlist.json',
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
        bestMatchup: champion.Column15 || '',
        worstMatchup: champion.Column20 || '',
        otp: champion.Column1 === 'OTP',
      })
    }
  })

  championsData.sort((a, b) => a.score - b.score)

  // Filtre selon le type sélectionné
  if (filterType.value === 'otp') {
    championsData = championsData.filter(champion => champion.otp)
  } else if (filterType.value === 'no-otp') {
    championsData = championsData.filter(champion => !champion.otp)
  }
  // 'all' ne filtre rien

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

watch([selectedRole, selectedTier, filterType], async () => {
  await createChart()
})

onMounted(async () => {
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
</script>

<template>
  <div class="statistique-container">
    <div class="tabs">
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
    <div class="chart-container">
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
.filter-select {
  background: transparent;
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: var(--text-base);
  cursor: pointer;
  font-family: var(--font-beaufort);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-gold-500);
}

.filter-select option {
  background-color: var(--color-grey-800);
  color: var(--color-gold-300);
}

@media (max-width: 768px) {
  .tabs {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-select {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
