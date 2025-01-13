import type {
  TenacityItem,
  ArmorStats,
  MagicResistStats,
  MovementSpeedStats,
  AttackSpeedStats,
  ArmorPenStats,
  MagicPenStats,
  MovementSpeedCalcStats,
} from '../../types/stat'

export function calculateTenacity(items: TenacityItem[]): number {
  const tenacityValues = items.map(item => item.tenacity || 0)

  if (tenacityValues.length === 0) return 0

  const totalTenacity =
    1 - tenacityValues.reduce((acc, val) => acc * (1 - val / 100), 1)
  return Math.min(Math.round(totalTenacity * 100), 100)
}

export function calculateEffectiveArmor(stats: ArmorStats) {
  const totalArmor = stats.baseArmor + stats.bonusArmor

  const damageReduction = Number(
    (100 / (100 + Math.max(totalArmor, 0))).toFixed(4),
  )

  return {
    totalArmor,
    damageReduction: `${(100 - damageReduction * 100).toFixed(1)}%`,
    effectiveHealth: Math.round(stats.health * (1 + totalArmor / 100)),
    effectiveHealthMultiplier: (1 + totalArmor / 100).toFixed(2),
  }
}

export function calculateEffectiveMR(stats: MagicResistStats) {
  const totalMR = stats.baseMR + stats.bonusMR

  const damageReduction = Number(
    (100 / (100 + Math.max(totalMR, 0))).toFixed(4),
  )

  return {
    totalMR,
    damageReduction: `${(100 - damageReduction * 100).toFixed(1)}%`,
    effectiveHealth: Math.round(stats.health * (1 + totalMR / 100)),
    effectiveHealthMultiplier: (1 + totalMR / 100).toFixed(2),
  }
}

export function calculateSlowResist(stats: MovementSpeedStats): number {
  const totalBaseMS = (stats.baseMS + stats.bonusMS) * (1 + stats.msMultiplier)
  let slowResist: number

  if (totalBaseMS <= 220) {
    slowResist =
      1 - (1 - (stats.finalMS - 110) / (totalBaseMS * 0.5)) / stats.slow
  } else if (totalBaseMS <= 415) {
    slowResist = 1 - (1 - stats.finalMS / totalBaseMS) / stats.slow
  } else if (totalBaseMS <= 490) {
    slowResist =
      1 - (1 - (stats.finalMS - 475) / (0.5 * totalBaseMS + 490)) / stats.slow
  } else {
    slowResist =
      1 - (1 - (stats.finalMS - 415) / (0.8 * totalBaseMS + 415)) / stats.slow
  }

  return Math.min(Math.max(Math.round(slowResist * 100), 0), 100)
}

export function calculateAttackSpeed(stats: AttackSpeedStats): number {
  const totalAS = stats.baseAS + stats.asRatio * (stats.bonusAS / 100)

  return Number(Math.min(Math.max(totalAS, 0.2), 2.5).toFixed(2))
}

export function calculateArmorPenetration(stats: ArmorPenStats): number {
  let totalArmor = stats.targetBaseArmor + stats.targetBonusArmor
  let baseArmor = stats.targetBaseArmor
  let bonusArmor = stats.targetBonusArmor

  if (totalArmor > 0) {
    const reductionRatio = stats.flatReduction / totalArmor
    baseArmor -= stats.targetBaseArmor * reductionRatio
    bonusArmor -= stats.targetBonusArmor * reductionRatio
  } else {
    baseArmor -= stats.flatReduction
  }

  if (totalArmor > 0) {
    baseArmor *= 1 - stats.percentReduction
    bonusArmor *= 1 - stats.percentReduction
  }

  if (totalArmor > 0) {
    baseArmor *= 1 - stats.percentPen
    bonusArmor *= 1 - stats.percentPen
    bonusArmor *= 1 - stats.bonusPercentPen
  }

  totalArmor = baseArmor + bonusArmor
  totalArmor = Math.max(totalArmor - stats.lethality, 0)

  return Math.round(totalArmor)
}

export function calculateMagicPenetration(stats: MagicPenStats): number {
  let totalMR = stats.targetMR

  totalMR -= stats.flatReduction

  if (totalMR > 0) {
    totalMR *= 1 - stats.percentReduction
  }

  if (totalMR > 0) {
    totalMR *= 1 - stats.percentPen
  }

  if (totalMR > 0) {
    totalMR = Math.max(totalMR - stats.flatPen, 0)
  }

  return Math.round(totalMR)
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
