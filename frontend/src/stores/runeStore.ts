import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RunesSelection, Rune, SubRune } from '@/types/rune'

export const useRuneStore = defineStore('Rune', () => {
  const runesSelection = ref<RunesSelection>({
    principal: null,
    second: null,
    runeSecond: [null, null],
    groups: [
      { principal: null, second: null },
      { principal: null, second: null },
      { principal: null, second: null },
      { principal: null, second: null },
      { principal: null, second: null },
    ],
  })

  const setRuneSelection = (
    type: 'principal' | 'second',
    rune: Rune | null,
  ) => {
    runesSelection.value[type] = rune
  }

  const setGroupRuneSelection = (
    groupIndex: number,
    type: 'principal' | 'second',
    subRune: SubRune | null,
  ) => {
    if (type === 'second') {
      runesSelection.value.runeSecond[groupIndex] = subRune
    }
    runesSelection.value.groups[groupIndex][type] = subRune
  }

  const resetRunesSelection = () => {
    runesSelection.value = {
      principal: null,
      second: null,
      runeSecond: [null, null],
      groups: runesSelection.value.groups.map(() => ({
        principal: null,
        second: null,
      })),
    }
  }

  return {
    runesSelection,
    setRuneSelection,
    setGroupRuneSelection,
    resetRunesSelection,
  }
})
