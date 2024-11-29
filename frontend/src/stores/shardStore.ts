import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type ShardSelection } from '../components/type'

export const useShardStore = defineStore('Shard', () => {
  const shardsSelection = ref<ShardSelection>({
    principal: '',
    second: '',
    third: '',
  })

  const setShardSelection = (
    type: 'principal' | 'second' | 'third',
    index: string,
  ) => {
    shardsSelection.value[type] = index
  }

  const resetShardsSelection = () => {
    shardsSelection.value = {
      principal: '',
      second: '',
      third: '',
    }
  }

  return {
    shardsSelection,
    setShardSelection,
    resetShardsSelection,
  }
})
