<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import tierData from '@/assets/files/tiers-listes/Lelariva - Tierlist PATREON - 14.13 (1).json'

const validRoles = ['TOPLANE', 'JUNGLE', 'MIDLANE', 'ADC-BOT', 'SUPPORT']

function isValidRole(role: string): role is keyof typeof tierData {
  return validRoles.includes(role)
}

Chart.register(...registerables)
const selectedRole = ref<
  'TOPLANE' | 'JUNGLE' | 'MIDLANE' | 'ADC-BOT' | 'SUPPORT'
>('TOPLANE')
let currentChart: Chart | null = null

const tiers = {
  F: '#ff0000',
  C: '#9370db',
  B: '#87ceeb',
  A: '#4169e1',
  S: '#32cd32',
  'S+': '#ffd700',
} as const

type ChampionData = {
  TOP?: string
  JNG?: string
  MID?: string
  ADC?: string
  SUP?: string
  Column2?: string
  Column7: string
  Column8?: string
  Column9?: string
  Column10?: string
  Column11?: string
  Column12?: string
  Column13?: string
  Column14?: string
  Column15?: string
  Column16?: string
  Column19?: string
  Column20?: string
  Column21?: string
  Column24?: string
  Column25?: string
  Column26?: string
} | null

const roleMapping = {
  TOPLANE: 'TOP',
  JUNGLE: 'JNG',
  MIDLANE: 'MID',
  'ADC-BOT': 'ADC',
  SUPPORT: 'SUP',
} as const

const processRoleData = (role: string) => {
  if (!isValidRole(role)) {
    throw new Error(`Invalid role: ${role}`)
  }

  const mappedRole = roleMapping[role as keyof typeof roleMapping]
  const data = tierData[role] as ChampionData[]
  const championsData: Array<{ name: string; score: number }> = []

  data.forEach(champion => {
    if (champion && champion.Column7 && champion[mappedRole]) {
      championsData.push({
        name: champion[mappedRole] as string,
        score: Number(champion.Column7),
      })
    }
  })

  championsData.sort((a, b) => a.score - b.score)
  return {
    title: `TIERLIST : ${role}`,
    champions: championsData.map(c => c.name),
    scores: championsData.map(c => c.score),
  }
}

const createChart = () => {
  const ctx = document.getElementById('tierlistChart') as HTMLCanvasElement
  if (currentChart) {
    currentChart.destroy()
  }

  const roleInfo = processRoleData(selectedRole.value)

  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: roleInfo.champions,
      datasets: [
        {
          data: roleInfo.scores,
          backgroundColor: context => {
            const value = context.raw as number
            if (value <= -500) return tiers.F
            if (value <= -250) return tiers.C
            if (value <= 0) return tiers.B
            if (value <= 150) return tiers.A
            if (value <= 300) return tiers.S
            return tiers['S+']
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
          min: -800,
          max: 800,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'white',
            stepSize: 100,
            maxRotation: window.innerWidth <= 768 ? 0 : 45,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'white',
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
          color: 'white',
          font: {
            size: 24,
            weight: 'bold',
          },
        },
      },
    },
  })
}

watch(selectedRole, () => {
  createChart()
})

onMounted(() => {
  createChart()
})

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
    </div>
    <div class="chart-container">
      <div class="legend">
        <div v-for="(color, tier) in tiers" :key="tier" class="legend-item">
          <div class="color-box" :style="{ backgroundColor: color }"></div>
          <span>{{ tier }}</span>
        </div>
      </div>
      <canvas id="tierlistChart"></canvas>
    </div>
  </div>
</template>

<style scoped>
.statistique-container {
  background-color: #0a1428;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tabs button {
  padding: 0.5rem 0.75rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.tabs button.active {
  background-color: rgba(255, 255, 255, 0.3);
}

.tabs button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chart-container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  position: relative;
  height: 500px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  min-width: 80px;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
}

.color-box {
  width: 15px;
  height: 15px;
  border-radius: 4px;
}

canvas {
  width: calc(100% - 100px) !important;
  height: 100% !important;
}

@media (max-width: 1024px) {
  .statistique-container {
    padding: 1.5rem;
  }

  .chart-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .statistique-container {
    padding: 1rem;
  }

  .tabs {
    gap: 0.25rem;
  }

  .tabs button {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
    flex: 1 1 auto;
    min-width: 60px;
  }

  .chart-container {
    flex-direction: column;
    height: auto;
    min-height: 600px;
  }

  .legend {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.5rem;
  }

  .legend-item {
    font-size: 0.8rem;
    margin: 0.25rem;
  }

  canvas {
    width: 100% !important;
    height: 600px !important;
  }
}

@media (max-width: 480px) {
  .statistique-container {
    padding: 0.75rem;
  }

  .tabs button {
    font-size: 0.75rem;
    padding: 0.3rem 0.5rem;
  }

  .chart-container {
    gap: 0.75rem;
  }

  canvas {
    height: 500px !important;
  }

  .legend-item {
    font-size: 0.75rem;
  }

  .color-box {
    width: 12px;
    height: 12px;
  }
}
</style>
