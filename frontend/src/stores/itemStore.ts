import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Item, type ItemSelection } from '../components/type'

export const useItemStore = defineStore('Item', () => {
  const ItemsSelection = ref<ItemSelection>({
    starter: null,
    core: null,
    situationnel: null,
    boots: null,
  })
  // type: 'starter' | 'core' | 'situationnel' | 'boots',
  const setItemSelection = (Item: Item) => {
    if (!ItemsSelection.value['core']) {
      ItemsSelection.value['core'] = [Item]
    } else if (ItemsSelection.value['core'].length > 11) {
      ItemsSelection.value['core'][11] = Item
    } else {
      ItemsSelection.value['core'].push(Item)
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
    setItemSelection,
    resetItemsSelection,
  }
})
