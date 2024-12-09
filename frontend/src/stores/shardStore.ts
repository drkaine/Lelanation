import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type ShardSelection, type Shard } from '../components/script/type'

export const useShardStore = defineStore('Shard', () => {
  const shardsSelection = ref<ShardSelection>({
    principal: null,
    second: null,
    third: null,
  })

  const setShardSelection = (
    type: 'principal' | 'second' | 'third',
    shard: Shard | null,
  ) => {
    shardsSelection.value[type] = shard
  }

  const resetShardsSelection = () => {
    shardsSelection.value = {
      principal: null,
      second: null,
      third: null,
    }
  }

  return {
    shardsSelection,
    setShardSelection,
    resetShardsSelection,
  }
})
