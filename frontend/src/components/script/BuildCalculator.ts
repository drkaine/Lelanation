import type {
  ChampionStats,
  ItemStats,
  ExtendedStats,
  ExtendedTotalStats,
} from '../../types/stat'
import {
  calculateAttackSpeed,
  calculateMovementSpeed,
  calculateArmorDamageReductionPercent,
  calculateMagicDamageReductionPercent,
  calculatePhysicalEffectiveHealth,
  calculateMagicalEffectiveHealth,
  calculateItemGoldValue,
  calculateMixedEffectiveHealth,
} from './StatsCalculator'

export function calculateBaseStats(
  championStats: ChampionStats,
  lvl: number,
): ExtendedStats {
  const levelMultiplier = lvl > 1 ? lvl - 1 : 0

  const armor = Math.round(
    (championStats.armor ?? 0) +
      (championStats.armorperlevel ?? 0) * levelMultiplier,
  )
  const spellblock = Math.round(
    (championStats.spellblock ?? 0) +
      (championStats.spellblockperlevel ?? 0) * levelMultiplier,
  )
  const health = Math.round(
    (championStats.hp ?? 0) + (championStats.hpperlevel ?? 0) * levelMultiplier,
  )

  const armorDamageReductionPercent =
    calculateArmorDamageReductionPercent(armor)
  const magicDamageReductionPercent =
    calculateMagicDamageReductionPercent(spellblock)
  const physicalEffectiveHealth = calculatePhysicalEffectiveHealth(
    health,
    armor,
  )
  const magicalEffectiveHealth = calculateMagicalEffectiveHealth(
    health,
    spellblock,
  )
  const averageEffectiveHealth =
    (physicalEffectiveHealth + magicalEffectiveHealth) / 2

  const baseStats: ExtendedStats = {
    armor,
    attackdamage: Math.round(
      (championStats.attackdamage ?? 0) +
        (championStats.attackdamageperlevel ?? 0) * levelMultiplier,
    ),
    attackrange: Math.round(championStats.attackrange ?? 0),
    attackspeed:
      Math.round(
        ((championStats.attackspeed ?? 0) +
          (championStats.attackspeedperlevel ?? 0) * levelMultiplier) *
          100,
      ) / 100,
    crit: Math.round(
      (championStats.crit ?? 0) +
        (championStats.critperlevel ?? 0) * levelMultiplier,
    ),
    hp: health,
    hpregen: Math.round(
      (championStats.hpregen ?? 0) +
        (championStats.hpregenperlevel ?? 0) * levelMultiplier,
    ),
    movespeed: Math.round(championStats.movespeed ?? 0),
    mp: Math.round(
      (championStats.mp ?? 0) +
        (championStats.mpperlevel ?? 0) * levelMultiplier,
    ),
    mpregen: Math.round(
      (championStats.mpregen ?? 0) +
        (championStats.mpregenperlevel ?? 0) * levelMultiplier,
    ),
    spellblock,
    CDR: 0,
    AP: 0,
    lethality: 0,
    magicPenetration: 0,
    tenacity: 0,
    omnivamp: 0,
    shield: 0,
    spellvamp: 0,
    armorpen: 0,
    magicpen: 0,
    lvl: lvl,

    armorDamageReductionPercent:
      Math.round(armorDamageReductionPercent * 10) / 10,
    magicDamageReductionPercent:
      Math.round(magicDamageReductionPercent * 10) / 10,
    physicalEffectiveHealth: Math.round(physicalEffectiveHealth),
    magicalEffectiveHealth: Math.round(magicalEffectiveHealth),
    averageEffectiveHealth: Math.round(averageEffectiveHealth),
  }

  return baseStats
}

export function calculateItemStats(
  ItemStats: ItemStats & { price?: number },
): ExtendedStats {
  const itemStats: ExtendedStats = {
    armor: Math.round(
      (ItemStats.FlatArmorMod ?? 0) *
        (1 + (ItemStats.PercentArmorMod ?? 0) / 100),
    ),
    attackdamage: ItemStats.FlatPhysicalDamageMod ?? 0,
    attackrange: ItemStats.FlatAttackRangeMod ?? 0,
    attackspeed: Math.round((ItemStats.PercentAttackSpeedMod ?? 0) * 100) / 100,
    crit: ItemStats.FlatCritChanceMod ?? 0,
    hp: Math.round(
      (ItemStats.FlatHPPoolMod ?? 0) *
        (1 +
          ((ItemStats.PercentHealthRegen ?? 0) +
            (ItemStats.PercentHealthRegenMod ?? 0)) /
            100),
    ),
    hpregen: Math.round(
      ((ItemStats.FlatHealthRegen ?? 0) + (ItemStats.FlatHPRegenMod ?? 0)) *
        (1 + (ItemStats.PercentHealthRegen ?? 0) / 100),
    ),
    movespeed: Math.round(
      (ItemStats.FlatMovementSpeedMod ?? 0) *
        (1 + (ItemStats.PercentMovementSpeedMod ?? 0) / 100),
    ),
    mp: ItemStats.FlatMPPoolMod ?? 0,
    mpregen: ItemStats.FlatManaRegenMod ?? 0,
    spellblock: ItemStats.FlatSpellBlockMod ?? 0,
    CDR: ItemStats.FlatCooldownReduction ?? 0,
    AP: ItemStats.FlatAP ?? 0,
    lethality: ItemStats.FlatLethality ?? 0,
    magicPenetration: Math.round(
      (ItemStats.FlatMagicPenetration ?? 0) *
        (1 + (ItemStats.PercentMagicPenetration ?? 0) / 100),
    ),
    tenacity: Math.round(
      (ItemStats.FlatTenacity ?? 0) *
        (1 + (ItemStats.PercentTenacity ?? 0) / 100),
    ),
    omnivamp: Math.round(
      (ItemStats.FlatOmnivamp ?? 0) *
        (1 + (ItemStats.PercentOmnivamp ?? 0) / 100),
    ),
    shield: Math.round(
      (ItemStats.FlatShield ?? 0) * (1 + (ItemStats.PercentShield ?? 0) / 100),
    ),
    spellvamp: Math.round(
      (ItemStats.FlatSpellVamp ?? 0) *
        (1 + (ItemStats.PercentSpellVamp ?? 0) / 100),
    ),
    armorpen: Math.round(
      (ItemStats.FlatArmorPenetration ?? 0) *
        (1 + (ItemStats.PercentArmorPenetration ?? 0) / 100),
    ),
    magicpen: Math.round(
      (ItemStats.FlatMagicPenetration ?? 0) *
        (1 + (ItemStats.PercentMagicPenetration ?? 0) / 100),
    ),
    lvl: 0,

    goldValue: 0,
    goldEfficiency: 0,
    armorDamageReductionPercent: 0,
    magicDamageReductionPercent: 0,
    physicalEffectiveHealth: 0,
    magicalEffectiveHealth: 0,
    averageEffectiveHealth: 0,
  }

  itemStats.goldValue = calculateItemGoldValue(ItemStats)
  const itemPrice = ItemStats.price ?? 0
  if (itemPrice > 0) {
    itemStats.goldEfficiency = (itemStats.goldValue / itemPrice) * 100
  }

  return itemStats
}

export function calculateTotalStats(
  championStats: ExtendedStats,
  itemStats: ExtendedStats,
  lvl: number,
): ExtendedTotalStats {
  const totalArmor = Math.round(championStats.armor + itemStats.armor)
  const totalSpellblock = Math.round(
    championStats.spellblock + itemStats.spellblock,
  )
  const totalHealth = Math.round(championStats.hp + itemStats.hp)

  const armorDamageReductionPercent =
    calculateArmorDamageReductionPercent(totalArmor)
  const magicDamageReductionPercent =
    calculateMagicDamageReductionPercent(totalSpellblock)
  const physicalEffectiveHealth = calculatePhysicalEffectiveHealth(
    totalHealth,
    totalArmor,
  )
  const magicalEffectiveHealth = calculateMagicalEffectiveHealth(
    totalHealth,
    totalSpellblock,
  )
  const averageEffectiveHealth =
    (physicalEffectiveHealth + magicalEffectiveHealth) / 2
  const mixedEffectiveHealth = calculateMixedEffectiveHealth(
    totalHealth,
    totalArmor,
    totalSpellblock,
    50, // 50% physical damage
    50, // 50% magic damage
    0, // 0% true damage
  )

  const totalStats = {
    hp: totalHealth.toString(),
    attackdamage: Math.round(
      championStats.attackdamage + itemStats.attackdamage,
    ).toString(),
    attackrange: Math.round(
      championStats.attackrange + itemStats.attackrange,
    ).toString(),
    attackspeed: (
      Math.round((championStats.attackspeed + itemStats.attackspeed) * 100) /
      100
    ).toFixed(2),
    crit: Math.round(championStats.crit + itemStats.crit).toString(),
    mp: Math.round(championStats.mp + itemStats.mp).toString(),
    movespeed: Math.round(
      championStats.movespeed + itemStats.movespeed,
    ).toString(),
    hpregen: Math.round(championStats.hpregen + itemStats.hpregen).toString(),
    mpregen: Math.round(championStats.mpregen + itemStats.mpregen).toString(),
    spellblock: totalSpellblock.toString(),
    armor: totalArmor.toString(),
    CDR: Math.round(itemStats.CDR).toString(),
    AP: Math.round(itemStats.AP).toString(),
    lethality: Math.round(itemStats.lethality).toString(),
    magicPenetration: Math.round(itemStats.magicPenetration).toString(),
    tenacity: Math.round(itemStats.tenacity).toString(),
    omnivamp: Math.round(itemStats.omnivamp).toString(),
    shield: Math.round(itemStats.shield).toString(),
    spellvamp: Math.round(itemStats.spellvamp).toString(),
    armorpen: Math.round(itemStats.armorpen).toString(),
    magicpen: Math.round(itemStats.magicpen).toString(),
    lvl: lvl,

    effectiveAS: calculateAttackSpeed({
      baseAS: championStats.attackspeed,
      asRatio: 1,
      bonusAS: itemStats.attackspeed,
    }),
    effectiveTenacity: 0,
    effectiveMovementSpeed: calculateMovementSpeed({
      baseMS: championStats.movespeed,
      flatBonusMS: itemStats.movespeed,
      additivePercentMS: [],
      multiplicativePercentMS: [],
      slowRatio: 0,
    }),

    effectiveArmor: {
      totalArmor: totalArmor,
      damageReduction: (
        Math.round(armorDamageReductionPercent * 10) / 10
      ).toFixed(1),
      effectiveHealth: Math.round(physicalEffectiveHealth),
      effectiveHealthMultiplier: (
        Math.round((1 + totalArmor / 100) * 100) / 100
      ).toFixed(2),
    },

    effectiveMR: {
      totalMR: totalSpellblock,
      damageReduction: (
        Math.round(magicDamageReductionPercent * 10) / 10
      ).toFixed(1),
      effectiveHealth: Math.round(magicalEffectiveHealth),
      effectiveHealthMultiplier: (
        Math.round((1 + totalSpellblock / 100) * 100) / 100
      ).toFixed(2),
    },
  }

  const extendedStats = totalStats as ExtendedTotalStats

  extendedStats.armorDamageReductionPercent = (
    Math.round(armorDamageReductionPercent * 10) / 10
  ).toFixed(1)
  extendedStats.magicDamageReductionPercent = (
    Math.round(magicDamageReductionPercent * 10) / 10
  ).toFixed(1)
  extendedStats.physicalEffectiveHealth = Math.round(
    physicalEffectiveHealth,
  ).toString()
  extendedStats.magicalEffectiveHealth = Math.round(
    magicalEffectiveHealth,
  ).toString()
  extendedStats.averageEffectiveHealth = Math.round(
    averageEffectiveHealth,
  ).toString()
  extendedStats.mixedEffectiveHealth =
    Math.round(mixedEffectiveHealth).toString()
  extendedStats.goldValue = Math.round(itemStats.goldValue || 0).toString()
  extendedStats.goldEfficiency = Math.round(
    itemStats.goldEfficiency || 0,
  ).toString()

  return extendedStats
}
