import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  calculateBaseStats,
  calculateItemStats,
  calculateTotalStats,
} from '@/components/script/BuildCalculator'
import type { ChampionStats, ItemStats, Stats, TotalStats } from '@/types/stat'
import type { Build, BuildData } from '@/types/build'

export const useBuildStore = defineStore('build', () => {
  const userBuilds = ref<BuildData[]>([])
  const buildToEdit = ref<BuildData | null>(null)
  const visibleBuild = computed(() =>
    buildToEdit.value?.id ? !buildToEdit.value.id.startsWith('wait_') : false,
  )

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
    userBuilds.value = userBuilds.value.filter(build => build.id !== fileName)
    if (userBuilds.value.length === 0) {
      localStorage.removeItem('userBuilds')
    } else {
      localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
    }
  }

  const updateBuildsOrder = (newOrder: BuildData[]) => {
    userBuilds.value = newOrder
    localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
  }

  const resetBuild = () => {
    userBuilds.value = []
    buildToEdit.value = null
    localStorage.removeItem('userBuilds')
  }

  const setBuildToEdit = (build: BuildData | null) => {
    buildToEdit.value = build
  }

  const updateBuild = (
    updatedBuild: BuildData,
    oldName: string | null = null,
  ) => {
    if (oldName) {
      removeBuild(oldName)
      saveBuild(updatedBuild)
    } else {
      const index = userBuilds.value.findIndex(
        build => build.id === updatedBuild.id,
      )
      if (index !== -1) {
        userBuilds.value[index] = updatedBuild
        localStorage.setItem('userBuilds', JSON.stringify(userBuilds.value))
      }
    }
  }

  return {
    userBuilds,
    visibleBuild,
    buildToEdit,
    loadUserBuilds,
    saveBuild,
    removeBuild,
    statsCalculator,
    updateBuildsOrder,
    resetBuild,
    setBuildToEdit,
    updateBuild,
  }
})
