import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  type RunesSelection,
  type Rune,
  type SubRune,
} from '../components/script/type'

export const useRuneStore = defineStore('Rune', () => {
  const runesSelection = ref<RunesSelection>({
    principal: null,
    second: null,
    groups: [
      { principal: null, second: null, first: false, two: false },
      { principal: null, second: null, first: false, two: false },
      { principal: null, second: null, first: false, two: false },
      { principal: null, second: null, first: false, two: false },
      { principal: null, second: null, first: false, two: false },
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
    if (type === 'principal') {
      runesSelection.value.groups[groupIndex][type] = subRune
    } else {
      const groupWithFirstTrue = runesSelection.value.groups.find(
        group => group.first === true,
      )
      const groupWithSecondTrue = runesSelection.value.groups.find(
        group => group.two === true,
      )

      console.log(runesSelection.value.groups)

      if (
        runesSelection.value.groups[groupIndex].first ||
        runesSelection.value.groups[groupIndex].two
      ) {
        runesSelection.value.groups[groupIndex][type] = subRune
      } else if (groupWithFirstTrue && !groupWithSecondTrue) {
        runesSelection.value.groups[groupIndex][type] = subRune
        runesSelection.value.groups[groupIndex].two = true
      } else if (groupWithFirstTrue && groupWithSecondTrue) {
        groupWithFirstTrue.first = false
        groupWithFirstTrue.second = null
        groupWithSecondTrue.two = false
        groupWithSecondTrue.first = true
        runesSelection.value.groups[groupIndex][type] = subRune
        runesSelection.value.groups[groupIndex].two = true
      } else {
        runesSelection.value.groups[groupIndex][type] = subRune
        runesSelection.value.groups[groupIndex].first = true
      }
    }
  }

  const resetRunesSelection = () => {
    runesSelection.value = {
      principal: null,
      second: null,
      groups: runesSelection.value.groups.map(() => ({
        principal: null,
        second: null,
        first: false,
        two: false,
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
