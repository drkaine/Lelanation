import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChampionStore = defineStore('champion', () => {
  const selectedChampionImage = ref('')
  const selectedChampionName = ref('')

  return { selectedChampionImage, selectedChampionName }
})
