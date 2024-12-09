import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type SummonerSelection, type Summoner } from '../components/script/type'

export const useSummonerStore = defineStore('Summoner', () => {
  const summonerSelection = ref<SummonerSelection>({
    principal: null,
    second: null,
  })

  const setSummonerSelection = (
    type: 'principal' | 'second',
    summoner: Summoner | null,
  ) => {
    summonerSelection.value[type] = summoner
  }

  const resetSummonersSelection = () => {
    summonerSelection.value = {
      principal: null,
      second: null,
    }
  }

  return {
    summonerSelection,
    setSummonerSelection,
    resetSummonersSelection,
  }
})
