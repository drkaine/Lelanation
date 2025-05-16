import type {
  AttackSpeedStats,
  MovementSpeedCalcStats,
  ItemStats,
  ArmorPenetrationReductionParams,
} from '../../types/stat'

/**
 * Reference gold values for stats (gold per stat point)
 */
export const STAT_GOLD_VALUES = {
  attackdamage: 35, // Long Sword: 350g / 10 AD
  abilityhaste: 50, // Glowing Mote: 250g / 5 AH
  AP: 20, // Amplifying Tome: 400g / 20 AP
  armor: 20, // Cloth Armor: 300g / 15 Armor
  spellblock: 20, // Null-Magic Mantle: 400g / 20 MR
  hp: 2.67, // Ruby Crystal: 400g / 150 HP
  mp: 1, // Sapphire Crystal: 300g / 300 MP
  hpregen: 3, // Rejuvenation Bead: 300g / 100% HP5
  mpregen: 4, // Faerie Charm: 200g / 50% MP5
  crit: 40, // Cloak of Agility: 600g / 15% Crit
  attackspeed: 25, // Dagger: 250g / 10% AS
  movespeed: 12, // Boots: 300g / 25 MS
  armorpen: 41.67, // Gold value per 1% armor penetration
  lethality: 30, // Gold value per 1 lethality
}


// export function calculateTenacity(items: TenacityItem[]): number {
//   const tenacityValues = items.map(item => item.tenacity || 0)

//   if (tenacityValues.length === 0) return 0

//   const totalTenacity =
//     1 - tenacityValues.reduce((acc, val) => acc * (1 - val / 100), 1)
//   return Math.min(Math.round(totalTenacity * 100), 100)
// }

// export function calculateEffectiveArmor(stats: ArmorStats) {
//   const totalArmor = stats.baseArmor + stats.bonusArmor

//   const damageReduction = Number(
//     (100 / (100 + Math.max(totalArmor, 0))).toFixed(4),
//   )

//   return {
//     totalArmor,
//     damageReduction: `${(100 - damageReduction * 100).toFixed(1)}%`,
//     effectiveHealth: Math.round(stats.health * (1 + totalArmor / 100)),
//     effectiveHealthMultiplier: (1 + totalArmor / 100).toFixed(2),
//   }
// }

// export function calculateEffectiveMR(stats: MagicResistStats) {
//   const totalMR = stats.baseMR + stats.bonusMR

//   const damageReduction = Number(
//     (100 / (100 + Math.max(totalMR, 0))).toFixed(4),
//   )

//   return {
//     totalMR,
//     damageReduction: `${(100 - damageReduction * 100).toFixed(1)}%`,
//     effectiveHealth: Math.round(stats.health * (1 + totalMR / 100)),
//     effectiveHealthMultiplier: (1 + totalMR / 100).toFixed(2),
//   }
// }

// export function calculateSlowResist(stats: MovementSpeedStats): number {
//   const totalBaseMS = (stats.baseMS + stats.bonusMS) * (1 + stats.msMultiplier)
//   let slowResist: number

//   if (totalBaseMS <= 220) {
//     slowResist =
//       1 - (1 - (stats.finalMS - 110) / (totalBaseMS * 0.5)) / stats.slow
//   } else if (totalBaseMS <= 415) {
//     slowResist = 1 - (1 - stats.finalMS / totalBaseMS) / stats.slow
//   } else if (totalBaseMS <= 490) {
//     slowResist =
//       1 - (1 - (stats.finalMS - 475) / (0.5 * totalBaseMS + 490)) / stats.slow
//   } else {
//     slowResist =
//       1 - (1 - (stats.finalMS - 415) / (0.8 * totalBaseMS + 415)) / stats.slow
//   }

//   return Math.min(Math.max(Math.round(slowResist * 100), 0), 100)
// }

export function calculateAttackSpeed(stats: AttackSpeedStats): number {
  const totalAS = stats.baseAS + stats.asRatio * (stats.bonusAS / 100)

  return Number(Math.min(Math.max(totalAS, 0.2), 2.5).toFixed(2))
}

// export function calculateArmorPenetration(stats: ArmorPenStats): number {
//   let totalArmor = stats.targetBaseArmor + stats.targetBonusArmor
//   let baseArmor = stats.targetBaseArmor
//   let bonusArmor = stats.targetBonusArmor

//   if (totalArmor > 0) {
//     const reductionRatio = stats.flatReduction / totalArmor
//     baseArmor -= stats.targetBaseArmor * reductionRatio
//     bonusArmor -= stats.targetBonusArmor * reductionRatio
//   } else {
//     baseArmor -= stats.flatReduction
//   }

//   if (totalArmor > 0) {
//     baseArmor *= 1 - stats.percentReduction
//     bonusArmor *= 1 - stats.percentReduction
//   }

//   if (totalArmor > 0) {
//     baseArmor *= 1 - stats.percentPen
//     bonusArmor *= 1 - stats.percentPen
//     bonusArmor *= 1 - stats.bonusPercentPen
//   }

//   totalArmor = baseArmor + bonusArmor
//   totalArmor = Math.max(totalArmor - stats.lethality, 0)

//   return Math.round(totalArmor)
// }

// export function calculateMagicPenetration(stats: MagicPenStats): number {
//   let totalMR = stats.targetMR

//   totalMR -= stats.flatReduction

//   if (totalMR > 0) {
//     totalMR *= 1 - stats.percentReduction
//   }

//   if (totalMR > 0) {
//     totalMR *= 1 - stats.percentPen
//   }

//   if (totalMR > 0) {
//     totalMR = Math.max(totalMR - stats.flatPen, 0)
//   }

//   return Math.round(totalMR)
// }

export function calculateMovementSpeed(stats: MovementSpeedCalcStats): number {
  const flatMS = stats.baseMS + stats.flatBonusMS
  const additivePercent =
    1 + stats.additivePercentMS.reduce((sum, bonus) => sum + bonus, 0)
  const multiplicativePercent = stats.multiplicativePercentMS.reduce(
    (product, bonus) => product * (1 + bonus),
    1,
  )
  const slowMultiplier = 1 - (stats.slowRatio || 0)

  const rawMS =
    flatMS * additivePercent * slowMultiplier * multiplicativePercent

  if (rawMS <= 0) {
    return Math.round(110 + rawMS * 0.01)
  } else if (rawMS < 220) {
    return Math.round(110 + rawMS * 0.5)
  } else if (rawMS <= 415) {
    return Math.round(rawMS)
  } else if (rawMS <= 490) {
    return Math.round(rawMS * 0.8 + 83)
  } else {
    return Math.round(rawMS * 0.5 + 230)
  }
}

/**
 * Calculates the effective armor after applying all penetration and reduction effects
 * in the correct order:
 * 1. Flat armor reduction
 * 2. Percentage armor reduction
 * 3. Percentage armor penetration
 * 4. Lethality (flat armor penetration)
 *
 */
export function calculateArmorAfterPenetration({
  baseArmor,
  bonusArmor,
  flatReduction = 0,
  percentReduction = 0,
  percentPenetration = 0,
  percentBonusPenetration = 0,
  lethality = 0,
}: ArmorPenetrationReductionParams): number {
  let totalArmor = baseArmor + bonusArmor

  // Step 1: Apply flat armor reduction (distributed proportionally)
  if (flatReduction > 0) {
    if (totalArmor <= 0) {
      // If total armor is already 0 or less, apply all reduction to it
      totalArmor -= flatReduction
    } else {
      const baseArmorRatio = baseArmor / totalArmor
      const bonusArmorRatio = bonusArmor / totalArmor

      baseArmor -= flatReduction * baseArmorRatio
      bonusArmor -= flatReduction * bonusArmorRatio

      totalArmor = baseArmor + bonusArmor
    }
  }

  // Step 2: Apply percentage armor reduction
  if (percentReduction > 0 && totalArmor > 0) {
    const multiplier = 1 - percentReduction / 100
    baseArmor *= multiplier
    bonusArmor *= multiplier
    totalArmor = baseArmor + bonusArmor
  }

  // For damage calculation, we create an effective armor value
  // The actual armor of the target doesn't change from this point forward
  let effectiveArmor = totalArmor

  // Step 3: Apply percentage armor penetration
  if (percentPenetration > 0 && effectiveArmor > 0) {
    const multiplier = 1 - percentPenetration / 100
    effectiveArmor = baseArmor * multiplier + bonusArmor * multiplier
  }

  // Step 4: Apply percentage bonus armor penetration
  if (percentBonusPenetration > 0 && bonusArmor > 0 && effectiveArmor > 0) {
    const multiplier = 1 - percentBonusPenetration / 100
    effectiveArmor = baseArmor + bonusArmor * multiplier
  }

  // Step 5: Apply lethality (flat armor penetration)
  if (lethality > 0 && effectiveArmor > 0) {
    effectiveArmor = Math.max(0, effectiveArmor - lethality)
  }

  return effectiveArmor
}

export function calculateCumulativePercentArmorReduction(
  reductions: number[],
): number {
  if (reductions.length === 0) return 0

  let cumulativeReduction = 0

  for (const reduction of reductions) {
    // Formula: CumulativeReduction = r1 + r2 - r1*r2
    cumulativeReduction =
      cumulativeReduction + reduction - cumulativeReduction * reduction
  }

  return cumulativeReduction
}

export function calculateItemGoldValue(itemStats: ItemStats): number {
  let goldValue = 0

  if (itemStats.FlatPhysicalDamageMod) {
    goldValue += itemStats.FlatPhysicalDamageMod * STAT_GOLD_VALUES.attackdamage
  }

  if (itemStats.FlatCooldownReduction) {
    goldValue += itemStats.FlatCooldownReduction * STAT_GOLD_VALUES.abilityhaste
  }

  if (itemStats.FlatAP) {
    goldValue += itemStats.FlatAP * STAT_GOLD_VALUES.AP
  }

  if (itemStats.FlatArmorMod) {
    goldValue += itemStats.FlatArmorMod * STAT_GOLD_VALUES.armor
  }

  if (itemStats.FlatSpellBlockMod) {
    goldValue += itemStats.FlatSpellBlockMod * STAT_GOLD_VALUES.spellblock
  }

  if (itemStats.FlatHPPoolMod) {
    goldValue += itemStats.FlatHPPoolMod * STAT_GOLD_VALUES.hp
  }

  if (itemStats.FlatMPPoolMod) {
    goldValue += itemStats.FlatMPPoolMod * STAT_GOLD_VALUES.mp
  }

  if (itemStats.FlatHPRegenMod) {
    goldValue += itemStats.FlatHPRegenMod * STAT_GOLD_VALUES.hpregen
  }

  if (itemStats.FlatManaRegenMod) {
    goldValue += itemStats.FlatManaRegenMod * STAT_GOLD_VALUES.mpregen
  }

  if (itemStats.FlatCritChanceMod) {
    goldValue += itemStats.FlatCritChanceMod * 100 * STAT_GOLD_VALUES.crit 
  }

  if (itemStats.PercentAttackSpeedMod) {
    goldValue +=
      itemStats.PercentAttackSpeedMod * 100 * STAT_GOLD_VALUES.attackspeed 
  }

  if (itemStats.FlatMovementSpeedMod) {
    goldValue += itemStats.FlatMovementSpeedMod * STAT_GOLD_VALUES.movespeed
  }

  return goldValue
}

export function calculateGoldEfficiency(
  itemStats: ItemStats,
  itemPrice: number,
): number {
  if (itemPrice <= 0) return 0

  const goldValue = calculateItemGoldValue(itemStats)
  return (goldValue / itemPrice) * 100
}

export function calculateArmorDamageReduction(
  rawDamage: number,
  armor: number,
): number {
  // Armor formula: postMitigationDamage = rawDamage / (1 + armor/100)
  return rawDamage / (1 + armor / 100)
}

export function calculateArmorDamageReductionPercent(armor: number): number {
  // Damage reduction percentage: (armor / (100 + armor)) * 100
  return (armor / (100 + armor)) * 100
}

export function calculateMagicDamageReduction(
  rawDamage: number,
  magicResist: number,
): number {
  // Magic resist formula: postMitigationDamage = rawDamage / (1 + magicResist/100)
  return rawDamage / (1 + magicResist / 100)
}

export function calculateMagicDamageReductionPercent(
  magicResist: number,
): number {
  // Damage reduction percentage: (magicResist / (100 + magicResist)) * 100
  return (magicResist / (100 + magicResist)) * 100
}

export function calculateSlowResistance(
  baseMS: number,
  bonusMS: number,
  msMultiplier: number,
  finalMS: number,
  slow: number,
): number {
  if (slow === 0) return 0

  const rawMS = (baseMS + bonusMS) * (1 + msMultiplier)

  if (rawMS <= 220) {
    // Formula 1: MS ≤ 220
    return 1 - (1 - (finalMS - 110) / (rawMS * 0.5)) / slow
  } else if (rawMS <= 415) {
    // Formula 2: 220 ≤ MS ≤ 415
    return 1 - (1 - finalMS / rawMS) / slow
  } else if (rawMS <= 490) {
    // Formula 3: 415 ≤ MS ≤ 490
    return 1 - (1 - (finalMS - 475) / (0.5 * rawMS + 490)) / slow
  } else {
    // Formula 4: MS ≥ 490
    return 1 - (1 - (finalMS - 415) / (0.8 * rawMS + 415)) / slow
  }
}

export function calculatePhysicalEffectiveHealth(
  health: number,
  armor: number,
): number {
  return health * (1 + 0.01 * armor)
}

export function calculateMagicalEffectiveHealth(
  health: number,
  mr: number,
): number {
  return health * (1 + 0.01 * mr)
}

export function calculateMixedEffectiveHealth(
  health: number,
  armor: number,
  mr: number,
  physicalDamage: number,
  magicDamage: number,
  trueDamage: number = 0,
): number {
  const totalDamage = physicalDamage + magicDamage + trueDamage
  if (totalDamage === 0) return health

  const effectiveDamage =
    physicalDamage / (1 + 0.01 * armor) +
    magicDamage / (1 + 0.01 * mr) +
    trueDamage

  return health * (totalDamage / effectiveDamage)
}

