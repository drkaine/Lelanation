import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type RunesSelection } from '../components/type'

export const useRuneStore = defineStore('Rune', () => {
  const runesSelection = ref<RunesSelection>({
    principal: -1,
    second: -1,
    groups: [
      { principal: -1, second: -1 },
      { principal: -1, second: -1 },
      { principal: -1, second: -1 },
      { principal: -1, second: -1 },
      { principal: -1, second: -1 },
    ],
  })

  const setRuneSelection = (type: 'principal' | 'second', index: number) => {
    runesSelection.value[type] = index
  }

  const setGroupRuneSelection = (
    groupIndex: number,
    type: 'principal' | 'second',
    index: number,
  ) => {
    if (runesSelection.value.groups[groupIndex]) {
      runesSelection.value.groups[groupIndex][type] = index
    }
  }

  return {
    runesSelection,
    setRuneSelection,
    setGroupRuneSelection,
  }
})
