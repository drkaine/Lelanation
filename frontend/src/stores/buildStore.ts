import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  calculateBaseStats,
  calculateItemStats,
  calculateTotalStats,
} from '@/components/script/BuildCalculator'
import type { ChampionStats, ItemStats, Stats, TotalStats } from '@/types/stat'
import type { Build, BuildData } from '@/types/build'

export const useBuildStore = defineStore('build', () => {
  const userBuilds = ref<BuildData[]>([])

  const statsCalculator = (
    championStats: ChampionStats,
    itemStats: ItemStats,
  ): Build => {
    const baseStats: Stats[] = []
    const buildItemStats = calculateItemStats(itemStats)
    const totalStats: TotalStats[] = []

    for (let lvl = 1; lvl <= 18; lvl++) {
      const currentBaseStats = calculateBaseStats(championStats, lvl)
      baseStats.push(currentBaseStats)
      totalStats.push(
        calculateTotalStats(currentBaseStats, buildItemStats, lvl),
      )
    }

    return {
      itemStats,
      championStats,
      buildItemStats: buildItemStats,
      baseStats,
      totalStats,
    }
  }

  const loadUserBuilds = () => {
    const saved = localStorage.getItem('userBuilds')
    if (saved) {
      userBuilds.value = JSON.parse(saved)
    }
  }

  const saveBuild = (build: BuildData) => {
    if (!userBuilds.value.includes(build)) {
      userBuilds.value.push(build)
      localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
    }
  }

  const removeBuild = (fileName: string) => {
    userBuilds.value = userBuilds.value.filter(build => build.name !== fileName)
    localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
  }

  const updateBuildsOrder = (newOrder: BuildData[]) => {
    userBuilds.value = newOrder
    localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
  }

  const resetBuild = () => {
    userBuilds.value = []
    localStorage.removeItem('userBuilds')
  }

  return {
    userBuilds,
    loadUserBuilds,
    saveBuild,
    removeBuild,
    statsCalculator,
    updateBuildsOrder,
    resetBuild,
  }
})
