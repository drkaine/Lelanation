import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStepStore = defineStore('Step', () => {
  const step = ref<'champion' | 'rune' | 'item' | 'info' | 'build'>('champion')

  const setStepSelection = (
    type: 'champion' | 'rune' | 'item' | 'info' | 'build',
  ) => {
    step.value = type
  }

  return {
    step,
    setStepSelection,
  }
})
