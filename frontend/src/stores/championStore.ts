import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Champion, ChampionSkillsOrder } from '@/types/champion'
import i18n from '@/i18n'
import { type I18nInternal } from '@/i18n'

export const useChampionStore = defineStore('champion', () => {
  const selectedChampion = ref<Champion | null>(null)
  const champions = ref<Champion[]>([])
  const championSkillsOrder = ref({
    A: [] as number[],
    Z: [] as number[],
    E: [] as number[],
    R: [] as number[],
  })
  const i18nInstance = i18n as unknown as I18nInternal

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
    const locale = i18nInstance.global.locale

    try {
      let championsModule

      if (locale === 'en') {
        championsModule = await import(
          '@/assets/files/data/en/championFull.json'
        )
      } else {
        championsModule = await import('@/assets/files/data/championFull.json')
      }

      champions.value = Object.values(championsModule.default.data)
    } catch (error) {
      console.error(
        `[ChampionStore] Failed to load champion data for locale ${locale}:`,
        error,
      )
      try {
        const defaultModule = await import(
          '@/assets/files/data/championFull.json'
        )
        champions.value = Object.values(defaultModule.default.data)
      } catch (fallbackError) {
        console.error(
          '[ChampionStore] Fallback loading also failed:',
          fallbackError,
        )
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', () => {
      loadChampions()
    })
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
