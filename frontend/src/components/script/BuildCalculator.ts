import type { BuildStats } from '../../types/build'
import type { Stats, ChampionStats, ItemStats } from '../../types/stat'
import {
  calculateEffectiveArmor,
  calculateEffectiveMR,
  calculateAttackSpeed,
  calculateTenacity,
  calculateSlowResist,
  calculateMovementSpeed,
} from './StatsCalculator'

export function calculateBaseStats(championStats: ChampionStats, lvl: number) {
  return {
    armor: Math.round(
      (championStats.armor ?? 0) + (championStats.armorperlevel ?? 0) * lvl,
    ),
    attackdamage: Math.round(
      (championStats.attackdamage ?? 0) +
        (championStats.attackdamageperlevel ?? 0) * lvl,
    ),
    attackrange: Math.round(championStats.attackrange ?? 0),
    attackspeed:
      Math.round(
        ((championStats.attackspeed ?? 0) +
          (championStats.attackspeedperlevel ?? 0) * lvl) *
          100,
      ) / 100,
    crit: Math.round(
      (championStats.crit ?? 0) + (championStats.critperlevel ?? 0) * lvl,
    ),
    hp: Math.round(
      (championStats.hp ?? 0) + (championStats.hpperlevel ?? 0) * lvl,
    ),
    hpregen: Math.round(
      (championStats.hpregen ?? 0) + (championStats.hpregenperlevel ?? 0) * lvl,
    ),
    movespeed: Math.round(championStats.movespeed ?? 0),
    mp: Math.round(
      (championStats.mp ?? 0) + (championStats.mpperlevel ?? 0) * lvl,
    ),
    mpregen: Math.round(
      (championStats.mpregen ?? 0) + (championStats.mpregenperlevel ?? 0) * lvl,
    ),
    spellblock: Math.round(
      (championStats.spellblock ?? 0) +
        (championStats.spellblockperlevel ?? 0) * lvl,
    ),
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
  }
}

export function calculateItemStats(ItemStats: ItemStats) {
  return {
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
  }
}

export function calculateEffectiveStats(
  baseStats: BuildStats,
  itemStats: BuildStats,
) {
  return {
    effectiveArmor: calculateEffectiveArmor({
      baseArmor: baseStats.armor,
      bonusArmor: 0,
      health: baseStats.hp,
    }),

    effectiveMR: calculateEffectiveMR({
      baseMR: baseStats.spellblock,
      bonusMR: 0,
      health: baseStats.hp,
    }),

    effectiveAS: calculateAttackSpeed({
      baseAS: baseStats.attackspeed,
      asRatio: 1,
      bonusAS: itemStats.attackspeed,
    }),

    effectiveTenacity: calculateTenacity([{ tenacity: baseStats.tenacity }]),
  }
}

export function calculateTotalStats(championStats: Stats, itemStats: Stats) {
  return {
    armor: (championStats.armor + itemStats.armor).toFixed(0),
    attackdamage: (championStats.attackdamage + itemStats.attackdamage).toFixed(
      0,
    ),
    attackrange: (championStats.attackrange + itemStats.attackrange).toFixed(0),
    attackspeed: (championStats.attackspeed + itemStats.attackspeed).toFixed(0),
    crit: (championStats.crit + itemStats.crit).toFixed(0),
    hp: (championStats.hp + itemStats.hp).toFixed(0),
    hpregen: (championStats.hpregen + itemStats.hpregen).toFixed(0),
    movespeed: (championStats.movespeed + itemStats.movespeed).toFixed(0),
    mp: (championStats.mp + itemStats.mp).toFixed(0),
    mpregen: (championStats.mpregen + itemStats.mpregen).toFixed(0),
    spellblock: (championStats.spellblock + itemStats.spellblock).toFixed(0),
    CDR: itemStats.CDR.toFixed(0),
    AP: itemStats.AP.toFixed(0),
    lethality: itemStats.lethality.toFixed(0),
    magicPenetration: itemStats.magicPenetration.toFixed(0),
    tenacity: itemStats.tenacity.toFixed(0),
    omnivamp: itemStats.omnivamp.toFixed(0),
    shield: itemStats.shield.toFixed(0),
    spellvamp: itemStats.spellvamp.toFixed(0),
    armorpen: itemStats.armorpen.toFixed(0),
    magicpen: itemStats.magicpen.toFixed(0),

    EffectiveTenacity: calculateTenacity([{ tenacity: itemStats.tenacity }]),
    EffectiveArmor: calculateEffectiveArmor({
      baseArmor: championStats.armor,
      bonusArmor: itemStats.armor,
      health: championStats.hp + itemStats.hp,
    }),
    EffectiveEffectiveMR: calculateEffectiveMR({
      baseMR: championStats.spellblock,
      bonusMR: itemStats.spellblock,
      health: championStats.hp + itemStats.hp,
    }),
    EffectiveSlowResist: calculateSlowResist({
      baseMS: championStats.movespeed ?? 0,
      bonusMS: itemStats.movespeed ?? 0,
      msMultiplier: 0,
      finalMS: championStats.movespeed + itemStats.movespeed,
      slow: 0,
    }),
    EffectiveAttackSpeed: calculateAttackSpeed({
      baseAS: championStats.attackspeed,
      asRatio: 1,
      bonusAS: itemStats.attackspeed,
    }),
    EffectiveMovementSpeed: calculateMovementSpeed({
      baseMS: championStats.movespeed,
      flatBonusMS: itemStats.movespeed,
      additivePercentMS: [],
      multiplicativePercentMS: [],
      slowRatio: 0,
    }),
  }
}
