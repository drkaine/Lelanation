import type {
  ChampionStats,
  ItemStats,
  ExtendedStats,
  ExtendedTotalStats,
} from '../../types/stat'
import type { Champion } from '../../types/champion'
import type { ShardSelection } from '../../types/shard'
import {
  calculateAttackSpeed,
  calculateMovementSpeed,
  calculateArmorDamageReductionPercent,
  calculateMagicDamageReductionPercent,
  calculatePhysicalEffectiveHealth,
  calculateMagicalEffectiveHealth,
  calculateItemGoldValue,
  calculateMixedEffectiveHealth,
  determineAdaptiveForceType,
  calculateAdaptiveForceBonus,
  calculateChampionStatsGoldValue,
  calculateShardStatsGoldValue,
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

  const baseAttackSpeed = championStats.attackspeed ?? 0
  const bonusAttackSpeedFromLevel =
    ((championStats.attackspeedperlevel ?? 0) * levelMultiplier) / 100

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

  const attackdamage = Math.round(
    (championStats.attackdamage ?? 0) +
      (championStats.attackdamageperlevel ?? 0) * levelMultiplier,
  )
  const attackspeed = Number(
    (baseAttackSpeed + baseAttackSpeed * bonusAttackSpeedFromLevel).toFixed(3),
  )
  const movespeed = Math.round(championStats.movespeed ?? 0)
  const mp = Math.round(
    (championStats.mp ?? 0) + (championStats.mpperlevel ?? 0) * levelMultiplier,
  )
  const hpregen = Math.round(
    (championStats.hpregen ?? 0) +
      (championStats.hpregenperlevel ?? 0) * levelMultiplier,
  )
  const mpregen = Math.round(
    (championStats.mpregen ?? 0) +
      (championStats.mpregenperlevel ?? 0) * levelMultiplier,
  )

  const baseStats: ExtendedStats = {
    armor,
    attackdamage,
    attackrange: Math.round(championStats.attackrange ?? 0),
    attackspeed,
    crit: Math.round(
      (championStats.crit ?? 0) +
        (championStats.critperlevel ?? 0) * levelMultiplier,
    ),
    hp: health,
    hpregen,
    movespeed,
    mp,
    mpregen,
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
    goldValue: 0,
    goldEfficiency: 0,
  }

  const baseStatsLvl1 = {
    hp: championStats.hp ?? 0,
    attackdamage: championStats.attackdamage ?? 0,
    armor: championStats.armor ?? 0,
    spellblock: championStats.spellblock ?? 0,
    mp: championStats.mp ?? 0,
    hpregen: championStats.hpregen ?? 0,
    mpregen: championStats.mpregen ?? 0,
    attackspeed: championStats.attackspeed ?? 0,
    movespeed: championStats.movespeed ?? 0,
  }

  baseStats.goldValue = calculateChampionStatsGoldValue({
    hp: health - baseStatsLvl1.hp,
    attackdamage: attackdamage - baseStatsLvl1.attackdamage,
    armor: armor - baseStatsLvl1.armor,
    spellblock: spellblock - baseStatsLvl1.spellblock,
    mp: mp - baseStatsLvl1.mp,
    hpregen: hpregen - baseStatsLvl1.hpregen,
    mpregen: mpregen - baseStatsLvl1.mpregen,
    attackspeed: attackspeed - baseStatsLvl1.attackspeed,
    movespeed: 0,
  })

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
    attackspeed: (ItemStats.PercentAttackSpeedMod ?? 0) / 100,
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
    AP: ItemStats.FlatMagicDamageMod ?? 0,
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

  if (itemStats.armor > 0) {
    itemStats.armorDamageReductionPercent =
      calculateArmorDamageReductionPercent(itemStats.armor)
  }

  if (itemStats.spellblock > 0) {
    itemStats.magicDamageReductionPercent =
      calculateMagicDamageReductionPercent(itemStats.spellblock)
  }

  if (itemStats.hp > 0) {
    itemStats.physicalEffectiveHealth = calculatePhysicalEffectiveHealth(
      itemStats.hp,
      itemStats.armor,
    )
    itemStats.magicalEffectiveHealth = calculateMagicalEffectiveHealth(
      itemStats.hp,
      itemStats.spellblock,
    )
    itemStats.averageEffectiveHealth =
      (itemStats.physicalEffectiveHealth + itemStats.magicalEffectiveHealth) / 2
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
  originalChampionStats?: ChampionStats,
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

  const baseAttackSpeedRatio =
    originalChampionStats?.attackspeed ?? championStats.attackspeed

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
      asRatio: baseAttackSpeedRatio,
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
  extendedStats.goldValue = Math.round(
    (championStats.goldValue || 0) + (itemStats.goldValue || 0),
  ).toString()
  extendedStats.goldEfficiency = Math.round(
    itemStats.goldEfficiency || 0,
  ).toString()
  extendedStats.goldCost = '0'

  return extendedStats
}

export function calculateShardStats(
  shards: ShardSelection | undefined,
  champion: Champion | undefined,
  currentBonusAD: number,
  currentAP: number,
  level: number,
) {
  if (!shards)
    return {
      hp: 0,
      attackdamage: 0,
      AP: 0,
      attackspeed: 0,
      CDR: 0,
      movespeed: 0,
      tenacity: 0,
    }

  const stats = {
    hp: 0,
    attackdamage: 0,
    AP: 0,
    attackspeed: 0,
    CDR: 0,
    movespeed: 0,
    tenacity: 0,
  }

  const adaptiveType = determineAdaptiveForceType(
    champion,
    currentBonusAD,
    currentAP,
  )

  if (shards.principal?.description === '+9 Force adaptative') {
    const bonus = calculateAdaptiveForceBonus(9, adaptiveType)
    stats.attackdamage += bonus.attackdamage
    stats.AP += bonus.AP
  } else if (shards.principal?.description === "+10% vitesse d'attaque") {
    stats.attackspeed += 0.1
  } else if (
    shards.principal?.description === '+10%  accélération de compétence'
  ) {
    stats.CDR += 8 // 8 AH = ~8% CDR
  }

  if (shards.second?.description === '+9 Force adaptative') {
    const bonus = calculateAdaptiveForceBonus(9, adaptiveType)
    stats.attackdamage += bonus.attackdamage
    stats.AP += bonus.AP
  } else if (shards.second?.description === '+2% vitesse de déplacement') {
    stats.movespeed += 2
  } else if (shards.second?.description === '+10-180 PV (selon niveau)') {
    stats.hp += 10 + ((180 - 10) * (level - 1)) / 17
  }

  if (shards.third?.description === '+65 PV') {
    stats.hp += 65
  } else if (
    shards.third?.description ===
    '+10% Ténacitée et réduction de ralentissement'
  ) {
    stats.tenacity += 10
  } else if (shards.third?.description === '+10-180 PV (selon niveau)') {
    stats.hp += 10 + ((180 - 10) * (level - 1)) / 17
  }

  return stats
}

export function calculateTotalStatsWithShards(
  championStats: ExtendedStats,
  itemStats: ExtendedStats,
  shardStats: {
    hp: number
    attackdamage: number
    AP: number
    attackspeed: number
    CDR: number
    movespeed: number
    tenacity: number
  },
  lvl: number,
  originalChampionStats?: ChampionStats,
): ExtendedTotalStats {
  const totalArmor = Math.round(championStats.armor + itemStats.armor)
  const totalSpellblock = Math.round(
    championStats.spellblock + itemStats.spellblock,
  )
  const totalHealth = Math.round(
    championStats.hp + itemStats.hp + shardStats.hp,
  )

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

  const baseAttackSpeedRatio =
    originalChampionStats?.attackspeed ?? championStats.attackspeed

  const totalStats = {
    hp: totalHealth.toString(),
    attackdamage: Math.round(
      championStats.attackdamage +
        itemStats.attackdamage +
        shardStats.attackdamage,
    ).toString(),
    attackrange: Math.round(
      championStats.attackrange + itemStats.attackrange,
    ).toString(),
    attackspeed: (
      Math.round(
        (championStats.attackspeed +
          itemStats.attackspeed +
          shardStats.attackspeed) *
          100,
      ) / 100
    ).toFixed(2),
    crit: Math.round(championStats.crit + itemStats.crit).toString(),
    mp: Math.round(championStats.mp + itemStats.mp).toString(),
    movespeed: Math.round(
      championStats.movespeed + itemStats.movespeed + shardStats.movespeed,
    ).toString(),
    hpregen: Math.round(championStats.hpregen + itemStats.hpregen).toString(),
    mpregen: Math.round(championStats.mpregen + itemStats.mpregen).toString(),
    spellblock: totalSpellblock.toString(),
    armor: totalArmor.toString(),
    CDR: Math.round(itemStats.CDR + shardStats.CDR).toString(),
    AP: Math.round(itemStats.AP + shardStats.AP).toString(),
    lethality: Math.round(itemStats.lethality).toString(),
    magicPenetration: Math.round(itemStats.magicPenetration).toString(),
    tenacity: Math.round(itemStats.tenacity + shardStats.tenacity).toString(),
    omnivamp: Math.round(itemStats.omnivamp).toString(),
    shield: Math.round(itemStats.shield).toString(),
    spellvamp: Math.round(itemStats.spellvamp).toString(),
    armorpen: Math.round(itemStats.armorpen).toString(),
    magicpen: Math.round(itemStats.magicpen).toString(),
    lvl: lvl,

    effectiveAS: calculateAttackSpeed({
      baseAS: championStats.attackspeed,
      asRatio: baseAttackSpeedRatio,
      bonusAS: itemStats.attackspeed + shardStats.attackspeed,
    }),
    effectiveTenacity: 0,
    effectiveMovementSpeed: calculateMovementSpeed({
      baseMS: championStats.movespeed,
      flatBonusMS: itemStats.movespeed + shardStats.movespeed,
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
  const shardGoldValue = calculateShardStatsGoldValue(shardStats)

  extendedStats.goldValue = Math.round(
    (championStats.goldValue || 0) +
      (itemStats.goldValue || 0) +
      shardGoldValue,
  ).toString()
  extendedStats.goldEfficiency = Math.round(
    itemStats.goldEfficiency || 0,
  ).toString()
  extendedStats.goldCost = '0'

  return extendedStats
}
