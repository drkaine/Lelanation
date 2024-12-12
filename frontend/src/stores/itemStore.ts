import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  type Item,
  type ItemSelection,
  type Stats,
} from '../components/script/type'

export const useItemStore = defineStore('Item', () => {
  const ItemsSelection = ref<ItemSelection>({
    starter: null,
    core: null,
    situationnel: null,
    boots: null,
  })

  const ItemsStats = ref<Stats>({})

  const ItemsGold = ref<{ total: number }>({
    total: 0,
  })

  // type: 'starter' | 'core' | 'situationnel' | 'boots',
  const setItemSelection = (Item: Item) => {
    if (!ItemsSelection.value['core']) {
      ItemsSelection.value['core'] = [Item]
    } else if (ItemsSelection.value['core'].length > 11) {
      RemoveItemStat(ItemsSelection.value['core'][11].stats)
      removeItemGold(ItemsSelection.value['core'][11].gold.total)
      ItemsSelection.value['core'][11] = Item
    } else {
      ItemsSelection.value['core'].push(Item)
    }
    setItemStats(Item.stats)
    setItemGold(Item.gold.total)
  }

  const setItemStats = (stats: Stats) => {
    for (const [key, value] of Object.entries(stats)) {
      if (value !== undefined) {
        if (!ItemsStats.value[key]) {
          ItemsStats.value[key] = 0
        }
        ItemsStats.value[key] += value
      }
    }
  }

  const setItemGold = (gold: number) => {
    if (!ItemsGold.value.total) {
      ItemsGold.value.total = gold
    } else {
      ItemsGold.value.total += gold
    }
  }

  const removeItem = (index: number) => {
    if (ItemsSelection.value['core']) {
      RemoveItemStat(ItemsSelection.value['core'][index].stats)
      removeItemGold(ItemsSelection.value['core'][index].gold.total)
      ItemsSelection.value['core'] = ItemsSelection.value['core'].filter(
        (_, indexTarget) => indexTarget !== index,
      )
    }
  }

  const removeItemGold = (gold: number) => {
    if (ItemsGold.value.total) {
      ItemsGold.value.total -= gold
    }
  }

  const RemoveItemStat = (stats: Stats) => {
    for (const [key, value] of Object.entries(stats)) {
      if (value !== undefined) {
        if (ItemsStats.value[key]) {
          ItemsStats.value[key] -= value
        }
      }
    }
  }

  const resetItemsSelection = () => {
    ItemsSelection.value = {
      starter: null,
      core: null,
      situationnel: null,
      boots: null,
    }
  }

  return {
    ItemsSelection,
    ItemsStats,
    ItemsGold,
    setItemSelection,
    removeItem,
    resetItemsSelection,
  }
})
