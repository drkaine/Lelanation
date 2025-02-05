<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import tierData from '@/assets/files/tiers-listes/Lelariva - Tierlist PATREON - 14.13 (1).json'
import {
  roleMapping,
  type ChampionData,
  type TierStats,
  TIER_COLORS,
  TIER_DESCRIPTIONS,
} from '@/types/tier-list'

const validRoles = ['TOPLANE', 'JUNGLE', 'MIDLANE', 'ADC-BOT', 'SUPPORT']

function isValidRole(role: string): role is keyof typeof tierData {
  return validRoles.includes(role)
}

Chart.register(...registerables)
const selectedRole = ref<
  'TOPLANE' | 'JUNGLE' | 'MIDLANE' | 'ADC-BOT' | 'SUPPORT'
>('TOPLANE')
let currentChart: Chart | null = null

let championsData: Array<TierStats> = []

const processRoleData = (role: string) => {
  if (!isValidRole(role)) {
    throw new Error(`Invalid role: ${role}`)
  }

  championsData = []

  const mappedRole = roleMapping[role as keyof typeof roleMapping]
  const data = tierData[role] as ChampionData[]

  data.forEach(champion => {
    if (champion && champion.Column7 && champion[mappedRole]) {
      championsData.push({
        name: champion[mappedRole] as string,
        score: Number(champion.Column7),
        tier: champion.Column2 || '',
        matchups: Number(champion.Column8),
        pickrate: Number(champion.Column9),
        bestMatchup: champion.Column20 || '',
        worstMatchup: champion.Column25 || '',
      })
    }
  })

  championsData.sort((a, b) => a.score - b.score)
  return {
    title: `TIERLIST : ${role}`,
    champions: championsData.map(c => c.name),
    scores: championsData.map(c => c.score),
    tiers: championsData.map(c => c.tier),
    matchups: championsData.map(c => c.matchups),
    pickrate: championsData.map(c => c.pickrate),
    bestMatchup: championsData.map(c => c.bestMatchup),
    worstMatchup: championsData.map(c => c.worstMatchup),
  }
}

const selectedTier = ref<string | null>(null)

const createChart = async () => {
  await nextTick()
  const ctx = document.getElementById('tierlistChart') as HTMLCanvasElement

  currentChart?.destroy()
  currentChart = null

  const roleInfo = processRoleData(selectedRole.value)

  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: roleInfo.champions,
      datasets: [
        {
          data: roleInfo.scores,
          backgroundColor: context => {
            const tier = roleInfo.tiers[context.dataIndex]
            const color = TIER_COLORS[tier as keyof typeof TIER_COLORS]

            if (selectedTier.value && tier !== selectedTier.value) {
              return `${color}26`
            }

            return `${color}FF`
          },
        },
      ],
    },
    options: {
      indexAxis: window.innerWidth <= 768 ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: -1000,
          max: 1000,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#f0e6d2',
            stepSize: 100,
            maxRotation: window.innerWidth <= 768 ? 0 : 45,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#f0e6d2',
            autoSkip: true,
            maxRotation: window.innerWidth <= 768 ? 0 : 45,
            minRotation: window.innerWidth <= 768 ? 0 : 45,
          },
        },
      },
      plugins: {
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
    },
  })
}

watch([selectedTier, selectedRole], async () => {
  await createChart()
})

onMounted(async () => {
  await createChart()
})

onBeforeUnmount(() => {
  if (currentChart) {
    currentChart.destroy()
    currentChart = null
  }
})

const getTierDescription = (tier: string) => {
  return TIER_DESCRIPTIONS[tier as keyof typeof TIER_DESCRIPTIONS] || ''
}

const toggleTier = (tier: string) => {
  selectedTier.value = selectedTier.value === tier ? null : tier
}

const getChampionsInTier = (tier: string) => {
  if (!selectedTier.value || selectedTier.value !== tier) return []

  return championsData
    .filter(champion => champion.tier === tier)
    .sort((a, b) => b.score - a.score)
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
  </div>
</template>
