import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type SummonerSelection } from '../components/type'

export const useSummonerStore = defineStore('Summoner', () => {
  const summonerSelection = ref<SummonerSelection>({
    principal: -1,
    second: -1,
  })

  const setSummonerSelection = (
    type: 'principal' | 'second',
    index: number,
  ) => {
    summonerSelection.value[type] = index
  }

  return {
    summonerSelection,
    setSummonerSelection,
  }
})
