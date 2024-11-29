import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Rune, type Shard } from '../components/type'

export const useRuneStore = defineStore('rune', () => {
  const runes = ref<Rune[]>([])
  const shards = ref<Shard>({})
  const selectedRuneImage = ref('')
  const selectedRuneName = ref('')

  const setRunes = (newRunes: Rune[]) => {
    runes.value = newRunes
  }

  const setShards = (newShards: Shard) => {
    shards.value = newShards
  }

  const selectRune = (rune: Rune) => {
    selectedRuneImage.value = rune.icon
    selectedRuneName.value = rune.name
  }

  return {
    runes,
    shards,
    selectedRuneImage,
    selectedRuneName,
    setRunes,
    setShards,
    selectRune,
  }
})
