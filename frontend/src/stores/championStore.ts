import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Champion, ChampionSkillsOrder } from '@/types/champion'

export const useChampionStore = defineStore('champion', () => {
  const selectedChampion = ref<Champion | null>(null)
  const champions = ref<Champion[]>([])
  const championSkillsOrder = ref({
    A: [] as number[],
    Z: [] as number[],
    E: [] as number[],
    R: [] as number[],
  })

  const setSelectedChampion = (champion: Champion) => {
    selectedChampion.value = champion
  }

  const setChampionSkillsOrder = (skillOrder: ChampionSkillsOrder) => {
    championSkillsOrder.value = skillOrder
  }

  const resetChampionSelection = () => {
    selectedChampion.value = null
    championSkillsOrder.value = {
      A: [],
      Z: [],
      E: [],
      R: [],
    }
  }

  const loadChampions = async () => {
    const { data } = await import('@/assets/files/data/championFull.json')
    champions.value = Object.values(data)
  }

  return {
    champions,
    selectedChampion,
    setSelectedChampion,
    resetChampionSelection,
    loadChampions,
    championSkillsOrder,
    setChampionSkillsOrder,
  }
})
