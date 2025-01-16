import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Champion } from '@/types/champion'

export const useChampionStore = defineStore('champion', () => {
  const selectedChampion = ref<Champion | null>(null)
  const champions = ref<Champion[]>([])

  const setSelectedChampion = (champion: Champion) => {
    selectedChampion.value = champion
  }

  const resetChampionSelection = () => {
    selectedChampion.value = null
  }

  const loadChampions = async () => {
    const { data } = await import(
      /* webpackChunkName: "champion-data" */ '@/assets/files/championFull.json'
    )
    champions.value = Object.values(data)
  }

  return {
    champions,
    selectedChampion,
    setSelectedChampion,
    resetChampionSelection,
    loadChampions,
  }
})
