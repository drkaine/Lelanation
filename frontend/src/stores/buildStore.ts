import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  calculateBaseStats,
  calculateItemStats,
  calculateTotalStats,
} from '@/components/script/BuildCalculator'
import type { ChampionStats, ItemStats, Stats, TotalStats } from '@/types/stat'
import type { Build } from '@/types/build'

export const useBuildStore = defineStore('build', () => {
  const userBuilds = ref<string[]>([])

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

  const saveBuild = (fileName: string) => {
    if (!userBuilds.value.includes(fileName)) {
      userBuilds.value.push(fileName)
      localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
    }
  }

  const removeBuild = (fileName: string) => {
    userBuilds.value = userBuilds.value.filter(build => build !== fileName)
    localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
  }

  return {
    userBuilds,
    loadUserBuilds,
    saveBuild,
    removeBuild,
    statsCalculator,
  }
})
