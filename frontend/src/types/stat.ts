export interface MagicPenStats {
  targetMR: number
  flatReduction: number
  percentReduction: number
  percentPen: number
  flatPen: number
}

export interface ArmorPenStats {
  targetBaseArmor: number
  targetBonusArmor: number
  flatReduction: number
  percentReduction: number
  percentPen: number
  bonusPercentPen: number
  lethality: number
}

export interface AttackSpeedStats {
  baseAS: number
  asRatio: number
  bonusAS: number
}

export interface MovementSpeedStats {
  baseMS: number
  bonusMS: number
  msMultiplier: number
  finalMS: number
  slow: number
}

export interface MagicResistStats {
  baseMR: number
  bonusMR: number
  health: number
}

export interface ArmorStats {
  baseArmor: number
  bonusArmor: number
  health: number
}

export interface TenacityItem {
  tenacity?: number
}

export interface MovementSpeedCalcStats {
  baseMS: number
  flatBonusMS: number
  additivePercentMS: number[]
  multiplicativePercentMS: number[]
  slowRatio: number
}

export interface ItemStats {
  FlatMagicDamageMod?: number | null
  FlatCritChanceMod?: number | null
  FlatHPRegenMod?: number | null
  PercentLifeStealMod?: number | null
  FlatSpellBlockMod?: number | null
  FlatMovementSpeedMod?: number | null
  FlatArmorMod?: number | null
  FlatPhysicalDamageMod?: number | null
  FlatHPPoolMod?: number | null
  PercentMovementSpeedMod?: number | null
  PercentAttackSpeedMod?: number | null
  PercentArmorMod?: number | null
  PercentHealthRegenMod?: number | null
  PercentSpellVamp?: number | null
  PercentLifeSteal?: number | null
  FlatEnergyRegenMod?: number | null
  FlatManaRegenMod?: number | null
  FlatMPPoolMod?: number | null
  FlatAD?: number | null
  FlatAP?: number | null
  FlatCooldownReduction?: number | null
  PercentCooldownReduction?: number | null
  FlatLethality?: number | null
  FlatOmnivamp?: number | null
  PercentOmnivamp?: number | null
  FlatShield?: number | null
  PercentShield?: number | null
  FlatTenacity?: number | null
  PercentTenacity?: number | null
  FlatSpellVamp?: number | null
  FlatHealthRegen?: number | null
  PercentHealthRegen?: number | null
  FlatArmorPenetration?: number | null
  PercentArmorPenetration?: number | null
  FlatMagicPenetration?: number | null
  PercentMagicPenetration?: number | null
  FlatDamageReduction?: number | null
  PercentDamageReduction?: number | null
  FlatAttackRangeMod?: number | null
}

export interface ChampionStats {
  hp: number
  hpperlevel: number
  mp: number
  mpperlevel: number
  movespeed: number
  armor: number
  armorperlevel: number
  spellblock: number
  spellblockperlevel: number
  attackrange: number
  hpregen: number
  hpregenperlevel: number
  mpregen: number
  mpregenperlevel: number
  crit: number
  critperlevel: number
  attackdamage: number
  attackdamageperlevel: number
  attackspeedperlevel: number
  attackspeed: number
  lvl?: number
}

export interface Stats {
  hp: number
  mp: number
  movespeed: number
  armor: number
  spellblock: number
  attackrange: number
  hpregen: number
  mpregen: number
  crit: number
  attackdamage: number
  attackspeed: number
  CDR: number
  AP: number
  lethality: number
  magicPenetration: number
  tenacity: number
  omnivamp: number
  shield: number
  spellvamp: number
  armorpen: number
  magicpen: number
  lvl: number
}

export interface TotalStats {
  hp: string
  mp: string
  movespeed: string
  armor: string
  spellblock: string
  attackrange: string
  hpregen: string
  mpregen: string
  crit: string
  attackdamage: string
  attackspeed: string
  CDR: string
  AP: string
  lethality: string
  magicPenetration: string
  tenacity: string
  omnivamp: string
  shield: string
  spellvamp: string
  armorpen: string
  magicpen: string
  effectiveArmor: {
    totalArmor: number
    damageReduction: string
    effectiveHealth: number
    effectiveHealthMultiplier: string
  }
  effectiveMR: {
    damageReduction: string
    effectiveHealth: number
    totalMR: number
    effectiveHealthMultiplier: string
  }
  effectiveAS: number
  effectiveTenacity: number
  effectiveMovementSpeed: number
  lvl: number
}

export interface ArmorPenetrationReductionParams {
  baseArmor: number
  bonusArmor: number
  flatReduction: number
  percentReduction: number
  percentPenetration: number
  percentBonusPenetration: number
  lethality: number
}

export interface ExtendedStats extends Stats {
  armorDamageReductionPercent?: number
  magicDamageReductionPercent?: number
  physicalEffectiveHealth?: number
  magicalEffectiveHealth?: number
  averageEffectiveHealth?: number
  mixedEffectiveHealth?: number
  goldValue?: number
  goldEfficiency?: number
}

export interface ExtendedTotalStats extends TotalStats {
  armorDamageReductionPercent: string
  magicDamageReductionPercent: string
  physicalEffectiveHealth: string
  magicalEffectiveHealth: string
  averageEffectiveHealth: string
  mixedEffectiveHealth: string
  goldValue: string
  goldEfficiency: string
}
