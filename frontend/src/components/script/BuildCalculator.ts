import type { BuildStats } from '../../types/build'
import type { ChampionStats } from '../../types/champion'
import type { Stats } from '../../types/stat'
import {
  calculateEffectiveArmor,
  calculateEffectiveMR,
  calculateAttackSpeed,
  calculateTenacity,
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
  }
}

export function calculateItemStats(ItemStats: Stats) {
  console.log(ItemStats)
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

// export function calculateTotalStats(baseStats: BuildStats, itemStats: BuildStats) {
//     const effectiveHealth = calculateEffectiveStats(baseStats, itemStats);

//     return {
//       physicalEffectiveHealth: effectiveHealth.physicalBase + effectiveHealth.physicalItems,
//       magicalEffectiveHealth: effectiveHealth.magicalBase + effectiveHealth.magicalItems,
//       armor: baseStats.armor + itemStats.armor,
//       attackdamage: baseStats.attackdamage + itemStats.attackdamage,
//       attackrange: baseStats.attackrange + itemStats.attackrange,
//       attackspeed: +(baseStats.attackspeed + itemStats.attackspeed).toFixed(2),
//       crit: baseStats.crit + itemStats.crit,
//       hp: baseStats.hp + itemStats.hp,
//       hpregen: baseStats.hpregen + itemStats.hpregen,
//       movespeed: baseStats.movespeed + itemStats.movespeed,
//       mp: baseStats.mp + itemStats.mp,
//       mpregen: baseStats.mpregen + itemStats.mpregen,
//       spellblock: baseStats.spellblock + itemStats.spellblock,
//       CDR: (itemStats.CDR || 0),
//       AP: (itemStats.AP || 0),
//       lethality: (itemStats.lethality || 0),
//       magicPenetration: (itemStats.magicPenetration || 0),
//       tenacity: (itemStats.tenacity || 0)
//     };
//   }

//   export function parseItemStats(itemStats: any): BuildStats {
//     return {
//       armor: +(itemStats?.FlatArmorMod ?? 0),
//       attackdamage: +(itemStats?.FlatPhysicalDamageMod ?? 0),
//       attackrange: +(itemStats?.FlatAttackRangeMod ?? 0),
//       attackspeed: +((itemStats?.PercentAttackSpeedMod ?? 0) * 100),
//       crit: +(itemStats?.FlatCritChanceMod ?? 0),
//       hp: +(itemStats?.FlatHPPoolMod ?? 0),
//       hpregen: +(itemStats?.FlatHPRegenMod ?? 0),
//       movespeed: +(itemStats?.FlatMovementSpeedMod ?? 0),
//       mp: +(itemStats?.FlatMPPoolMod ?? 0),
//       mpregen: +(itemStats?.FlatManaRegenMod ?? 0),
//       spellblock: +(itemStats?.FlatSpellBlockMod ?? 0),
//       CDR: +(itemStats?.FlatCooldownReduction ?? 0),
//       AP: +(itemStats?.FlatAP ?? 0),
//       lethality: +(itemStats?.FlatLethality ?? 0),
//       magicPenetration: +(itemStats?.FlatMagicPenetration ?? 0),
//       tenacity: +(itemStats?.FlatTenacity ?? 0),
//       armorperlevel: +(itemStats?.FlatArmorMod ?? 0),
//       attackdamageperlevel: +(itemStats?.FlatPhysicalDamageMod ?? 0),
//       attackspeedperlevel: +((itemStats?.PercentAttackSpeedMod ?? 0) * 100),
//       critperlevel: +(itemStats?.FlatCritChanceMod ?? 0),
//       hpperlevel: +(itemStats?.FlatHPPoolMod ?? 0),
//       hpregenperlevel: +(itemStats?.FlatHPRegenMod ?? 0),
//       mpperlevel: +(itemStats?.FlatMPPoolMod ?? 0),
//       mpregenperlevel: +(itemStats?.FlatManaRegenMod ?? 0),
//       spellblockperlevel: +(itemStats?.FlatSpellBlockMod ?? 0),
//       lvl: 1
//     };
//   }
