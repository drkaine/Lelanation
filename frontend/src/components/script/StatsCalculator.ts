import type {
  AttackSpeedStats,
  MovementSpeedCalcStats,
  ItemStats,
  ArmorPenetrationReductionParams,
} from '../../types/stat'
import type { Champion } from '../../types/champion'

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

export function determineAdaptiveForceType(
  champion: Champion | undefined,
  currentBonusAD: number,
  currentAP: number,
): 'AD' | 'AP' {
  if (!champion) return 'AD'

  if (currentBonusAD > currentAP) return 'AD'
  if (currentAP > currentBonusAD) return 'AP'

  const championTags = champion.tags || []

  if (championTags.includes('Mage')) return 'AP'

  if (championTags.includes('Marksman')) return 'AD'

  if (championTags.includes('Assassin')) {
    const info = champion.info || { attack: 0, magic: 0 }
    return info.magic > info.attack ? 'AP' : 'AD'
  }

  const info = champion.info || { attack: 0, magic: 0 }

  if (info.magic > info.attack + 2) return 'AP'

  return 'AD'
}

export function calculateAdaptiveForceBonus(
  adaptiveForcePoints: number,
  type: 'AD' | 'AP',
) {
  if (type === 'AD') {
    return {
      attackdamage: adaptiveForcePoints * 0.6, // 1 point = 0.6 AD
      AP: 0,
    }
  } else {
    return {
      attackdamage: 0,
      AP: adaptiveForcePoints * 1, // 1 point = 1 AP
    }
  }
}

/**
 * Calcule l'attack speed total selon les règles officielles de League of Legends
 *
 * Formule LoL : y = b + (m × x)
 * où :
 * - y = attack speed total
 * - b = attack speed de base (base AS)
 * - m = attack speed ratio (souvent égal à base AS pour la plupart des champions)
 * - x = somme de tous les bonus d'attack speed (en décimal, donc 50% = 0.5)
 *
 * Limites officielles :
 * - Maximum : 3.003 AS (1 attaque toutes les 0.333 secondes)
 * - Minimum : 0.2 AS (1 attaque toutes les 5 secondes)
 *
 */
export function calculateAttackSpeed(stats: AttackSpeedStats): number {
  const asRatio = stats.asRatio || stats.baseAS

  // Formule officielle : totalAS = baseAS + (asRatio × bonusAS)
  // bonusAS est déjà en format décimal (ex: 0.5 pour 50%)
  const totalAS = stats.baseAS + asRatio * stats.bonusAS

  const cappedAS = Math.min(Math.max(totalAS, 0.2), 3.003)

  return Number(cappedAS.toFixed(3))
}

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

  if (flatReduction > 0) {
    if (totalArmor <= 0) {
      totalArmor -= flatReduction
    } else {
      const baseArmorRatio = baseArmor / totalArmor
      const bonusArmorRatio = bonusArmor / totalArmor

      baseArmor -= flatReduction * baseArmorRatio
      bonusArmor -= flatReduction * bonusArmorRatio

      totalArmor = baseArmor + bonusArmor
    }
  }

  if (percentReduction > 0 && totalArmor > 0) {
    const multiplier = 1 - percentReduction / 100
    baseArmor *= multiplier
    bonusArmor *= multiplier
    totalArmor = baseArmor + bonusArmor
  }

  let effectiveArmor = totalArmor

  if (percentPenetration > 0 && effectiveArmor > 0) {
    const multiplier = 1 - percentPenetration / 100
    effectiveArmor = baseArmor * multiplier + bonusArmor * multiplier
  }

  if (percentBonusPenetration > 0 && bonusArmor > 0 && effectiveArmor > 0) {
    const multiplier = 1 - percentBonusPenetration / 100
    effectiveArmor = baseArmor + bonusArmor * multiplier
  }

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

  if (itemStats.FlatMagicDamageMod) {
    goldValue += itemStats.FlatMagicDamageMod * STAT_GOLD_VALUES.AP
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

export function calculateChampionStatsGoldValue(championStats: {
  hp: number
  attackdamage: number
  armor: number
  spellblock: number
  mp: number
  hpregen: number
  mpregen: number
  attackspeed: number
  movespeed: number
}): number {
  let goldValue = 0

  if (championStats.hp) {
    goldValue += championStats.hp * STAT_GOLD_VALUES.hp
  }

  if (championStats.attackdamage) {
    goldValue += championStats.attackdamage * STAT_GOLD_VALUES.attackdamage
  }

  if (championStats.armor) {
    goldValue += championStats.armor * STAT_GOLD_VALUES.armor
  }

  if (championStats.spellblock) {
    goldValue += championStats.spellblock * STAT_GOLD_VALUES.spellblock
  }

  if (championStats.mp) {
    goldValue += championStats.mp * STAT_GOLD_VALUES.mp
  }

  if (championStats.hpregen) {
    goldValue += championStats.hpregen * STAT_GOLD_VALUES.hpregen
  }

  if (championStats.mpregen) {
    goldValue += championStats.mpregen * STAT_GOLD_VALUES.mpregen
  }

  if (championStats.attackspeed > 0) {
    goldValue += championStats.attackspeed * 100 * STAT_GOLD_VALUES.attackspeed
  }

  if (championStats.movespeed > 0) {
    goldValue += championStats.movespeed * STAT_GOLD_VALUES.movespeed
  }

  return Math.round(goldValue)
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

export function calculateShardStatsGoldValue(shardStats: {
  hp: number
  attackdamage: number
  AP: number
  attackspeed: number
  CDR: number
  movespeed: number
  tenacity: number
}): number {
  let goldValue = 0

  if (shardStats.hp > 0) {
    goldValue += shardStats.hp * STAT_GOLD_VALUES.hp
  }

  if (shardStats.attackdamage > 0) {
    goldValue += shardStats.attackdamage * STAT_GOLD_VALUES.attackdamage
  }

  if (shardStats.AP > 0) {
    goldValue += shardStats.AP * STAT_GOLD_VALUES.AP
  }

  if (shardStats.attackspeed > 0) {
    goldValue += shardStats.attackspeed * 100 * STAT_GOLD_VALUES.attackspeed
  }

  if (shardStats.CDR > 0) {
    goldValue += shardStats.CDR * STAT_GOLD_VALUES.abilityhaste
  }

  if (shardStats.movespeed > 0) {
    goldValue += shardStats.movespeed * STAT_GOLD_VALUES.movespeed
  }

  if (shardStats.tenacity > 0) {
    goldValue += shardStats.tenacity * 20
  }

  return Math.round(goldValue)
}
