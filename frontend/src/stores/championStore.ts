import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Champion } from '@/types/champion'

export const useChampionStore = defineStore('champion', () => {
  const selectedChampion = ref<Champion | null>(null)

  const setSelectedChampion = (champion: Champion) => {
    selectedChampion.value = champion
  }

  const resetChampionSelection = () => {
    selectedChampion.value = null
  }

  return { selectedChampion, setSelectedChampion, resetChampionSelection }
})
