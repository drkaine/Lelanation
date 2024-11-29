import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Champion } from '../components/type'

export const useChampionStore = defineStore('champion', () => {
  const selectedChampion = ref<Champion | null>(null)

  const setSelectedChampion = (champion: Champion) => {
    selectedChampion.value = champion
  }

  return { selectedChampion, setSelectedChampion }
})
