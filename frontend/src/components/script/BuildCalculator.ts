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

  const baseStats: ExtendedStats = {
    armor: Math.round(
      (championStats.armor ?? 0) +
        (championStats.armorperlevel ?? 0) * levelMultiplier,
    ),
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
    hp: Math.round(
      (championStats.hp ?? 0) +
        (championStats.hpperlevel ?? 0) * levelMultiplier,
    ),
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
    spellblock: Math.round(
      (championStats.spellblock ?? 0) +
        (championStats.spellblockperlevel ?? 0) * levelMultiplier,
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
    lvl: lvl,
    armorDamageReductionPercent: 0,
    magicDamageReductionPercent: 0,
    physicalEffectiveHealth: 0,
    magicalEffectiveHealth: 0,
    averageEffectiveHealth: 0,
  }

  const armor = baseStats.armor
  const spellblock = baseStats.spellblock
  const health = baseStats.hp

  baseStats.armorDamageReductionPercent =
    calculateArmorDamageReductionPercent(armor)
  baseStats.magicDamageReductionPercent =
    calculateMagicDamageReductionPercent(spellblock)
  baseStats.physicalEffectiveHealth = calculatePhysicalEffectiveHealth(
    health,
    armor,
  )
  baseStats.magicalEffectiveHealth = calculateMagicalEffectiveHealth(
    health,
    spellblock,
  )
  baseStats.averageEffectiveHealth =
    (baseStats.physicalEffectiveHealth + baseStats.magicalEffectiveHealth) / 2

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
  const totalStats = {
    hp: Number(championStats.hp + itemStats.hp).toFixed(0),
    attackdamage: Number(
      championStats.attackdamage + itemStats.attackdamage,
    ).toFixed(0),
    attackrange: Number(
      championStats.attackrange + itemStats.attackrange,
    ).toFixed(0),
    attackspeed: Number(
      championStats.attackspeed + itemStats.attackspeed,
    ).toFixed(2),
    crit: Number(championStats.crit + itemStats.crit).toFixed(0),
    mp: Number(championStats.mp + itemStats.mp).toFixed(0),
    movespeed: Number(championStats.movespeed + itemStats.movespeed).toFixed(0),
    hpregen: Number(championStats.hpregen + itemStats.hpregen).toFixed(0),
    mpregen: Number(championStats.mpregen + itemStats.mpregen).toFixed(0),
    spellblock: Number(championStats.spellblock + itemStats.spellblock).toFixed(
      0,
    ),
    armor: Number(championStats.armor + itemStats.armor).toFixed(0),
    CDR: Number(itemStats.CDR).toFixed(0),
    AP: Number(itemStats.AP).toFixed(0),
    lethality: Number(itemStats.lethality).toFixed(0),
    magicPenetration: Number(itemStats.magicPenetration).toFixed(0),
    tenacity: Number(itemStats.tenacity).toFixed(0),
    omnivamp: Number(itemStats.omnivamp).toFixed(0),
    shield: Number(itemStats.shield).toFixed(0),
    spellvamp: Number(itemStats.spellvamp).toFixed(0),
    armorpen: Number(itemStats.armorpen).toFixed(0),
    magicpen: Number(itemStats.magicpen).toFixed(0),
    lvl: lvl,

    // Objets complexes conformes à TotalStats
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

    // Objets structurés pour effectiveArmor et effectiveMR
    effectiveArmor: {
      totalArmor: Number(championStats.armor + itemStats.armor),
      damageReduction: calculateArmorDamageReductionPercent(
        Number(championStats.armor + itemStats.armor),
      ).toFixed(1),
      effectiveHealth: calculatePhysicalEffectiveHealth(
        Number(championStats.hp + itemStats.hp),
        Number(championStats.armor + itemStats.armor),
      ),
      effectiveHealthMultiplier: (
        1 +
        Number(championStats.armor + itemStats.armor) / 100
      ).toFixed(2),
    },

    effectiveMR: {
      totalMR: Number(championStats.spellblock + itemStats.spellblock),
      damageReduction: calculateMagicDamageReductionPercent(
        Number(championStats.spellblock + itemStats.spellblock),
      ).toFixed(1),
      effectiveHealth: calculateMagicalEffectiveHealth(
        Number(championStats.hp + itemStats.hp),
        Number(championStats.spellblock + itemStats.spellblock),
      ),
      effectiveHealthMultiplier: (
        1 +
        Number(championStats.spellblock + itemStats.spellblock) / 100
      ).toFixed(2),
    },
  }

  const totalArmor = Number(totalStats.armor)
  const totalSpellblock = Number(totalStats.spellblock)
  const totalHealth = Number(totalStats.hp)

  // Ajouter les propriétés supplémentaires en tant qu'attributs personnalisés
  // Ces propriétés ne sont pas dans le type TotalStats mais sont utiles pour l'affichage
  const extendedStats = totalStats as ExtendedTotalStats

  extendedStats.armorDamageReductionPercent =
    calculateArmorDamageReductionPercent(totalArmor).toFixed(1)
  extendedStats.magicDamageReductionPercent =
    calculateMagicDamageReductionPercent(totalSpellblock).toFixed(1)
  extendedStats.physicalEffectiveHealth = calculatePhysicalEffectiveHealth(
    totalHealth,
    totalArmor,
  ).toFixed(0)
  extendedStats.magicalEffectiveHealth = calculateMagicalEffectiveHealth(
    totalHealth,
    totalSpellblock,
  ).toFixed(0)
  extendedStats.averageEffectiveHealth = (
    (Number(extendedStats.physicalEffectiveHealth) +
      Number(extendedStats.magicalEffectiveHealth)) /
    2
  ).toFixed(0)

  extendedStats.mixedEffectiveHealth = calculateMixedEffectiveHealth(
    totalHealth,
    totalArmor,
    totalSpellblock,
    50,
    50,
    0,
  ).toFixed(0)

  extendedStats.goldValue = (itemStats.goldValue || 0).toString()
  extendedStats.goldEfficiency = (itemStats.goldEfficiency || 0).toString()

  return extendedStats
}
