import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item, ItemSelection } from '@/types/item'
import type { Stats } from '@/types/stat'

export const useItemStore = defineStore('Item', () => {
  const ItemsSelection = ref<ItemSelection>({
    starter: null,
    core: null,
    situationnel: null,
    boots: null,
    stats: {
      FlatMagicDamageMod: 0,
      FlatCritChanceMod: 0,
      FlatHPRegenMod: 0,
      PercentLifeStealMod: 0,
      FlatSpellBlockMod: 0,
      FlatMovementSpeedMod: 0,
      FlatArmorMod: 0,
      FlatPhysicalDamageMod: 0,
      FlatHPPoolMod: 0,
      PercentMovementSpeedMod: 0,
      PercentAttackSpeedMod: 0,
      PercentArmorMod: 0,
      PercentHealthRegenMod: 0,
      PercentSpellVamp: 0,
      PercentLifeSteal: 0,
      FlatEnergyRegenMod: 0,
      FlatManaRegenMod: 0,
      FlatMPPoolMod: 0,
      FlatAD: 0,
      FlatAP: 0,
      FlatCooldownReduction: 0,
      PercentCooldownReduction: 0,
      FlatLethality: 0,
      FlatOmnivamp: 0,
      PercentOmnivamp: 0,
      FlatShield: 0,
      PercentShield: 0,
      FlatTenacity: 0,
      PercentTenacity: 0,
      FlatSpellVamp: 0,
      FlatHealthRegen: 0,
      PercentHealthRegen: 0,
      FlatArmorPenetration: 0,
      PercentArmorPenetration: 0,
      FlatMagicPenetration: 0,
      PercentMagicPenetration: 0,
      FlatDamageReduction: 0,
      PercentDamageReduction: 0,
      FlatAttackRangeMod: 0,
    },
    gold: {
      base: 0,
      purchasable: false,
      total: 0,
      sell: 0,
    },
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
      const statKey = key as keyof typeof ItemsSelection.value.stats
      if (value !== undefined) {
        ItemsSelection.value.stats[statKey] += value
      }
    }
  }

  const setItemGold = (gold: number) => {
    ItemsSelection.value.gold.total += gold
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
    ItemsSelection.value.gold.total -= gold
  }

  const RemoveItemStat = (stats: Stats) => {
    for (const [key, value] of Object.entries(stats)) {
      const statKey = key as keyof typeof ItemsSelection.value.stats
      if (value !== undefined) {
        if (!ItemsSelection.value.stats[statKey]) {
          ItemsSelection.value.stats[statKey] = 0
        }
        ItemsSelection.value.stats[statKey] -= value
      }
    }
  }

  const resetItemsSelection = () => {
    ItemsSelection.value = {
      starter: null,
      core: null,
      situationnel: null,
      boots: null,
      stats: {
        FlatMagicDamageMod: 0,
        FlatCritChanceMod: 0,
        FlatHPRegenMod: 0,
        PercentLifeStealMod: 0,
        FlatSpellBlockMod: 0,
        FlatMovementSpeedMod: 0,
        FlatArmorMod: 0,
        FlatPhysicalDamageMod: 0,
        FlatHPPoolMod: 0,
        PercentMovementSpeedMod: 0,
        PercentAttackSpeedMod: 0,
        PercentArmorMod: 0,
        PercentHealthRegenMod: 0,
        PercentSpellVamp: 0,
        PercentLifeSteal: 0,
        FlatEnergyRegenMod: 0,
        FlatManaRegenMod: 0,
        FlatMPPoolMod: 0,
        FlatAD: 0,
        FlatAP: 0,
        FlatCooldownReduction: 0,
        PercentCooldownReduction: 0,
        FlatLethality: 0,
        FlatOmnivamp: 0,
        PercentOmnivamp: 0,
        FlatShield: 0,
        PercentShield: 0,
        FlatTenacity: 0,
        PercentTenacity: 0,
        FlatSpellVamp: 0,
        FlatHealthRegen: 0,
        PercentHealthRegen: 0,
        FlatArmorPenetration: 0,
        PercentArmorPenetration: 0,
        FlatMagicPenetration: 0,
        PercentMagicPenetration: 0,
        FlatDamageReduction: 0,
        PercentDamageReduction: 0,
        FlatAttackRangeMod: 0,
      },
      gold: {
        base: 0,
        purchasable: false,
        total: 0,
        sell: 0,
      },
    }
  }

  return {
    ItemsSelection,
    setItemSelection,
    removeItem,
    resetItemsSelection,
  }
})
