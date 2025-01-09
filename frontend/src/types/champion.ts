import type { Image } from './common'
import type { RecommendedItem } from './item'

export interface Champion {
  id: string
  key: string
  name: string
  title: string
  image: Image
  skins: Skin[]
  lore: string
  blurb: string
  allytips: string[]
  enemytips: string[]
  tags: string[]
  partype: string
  info: Info
  stats: ChampionStats
  spells: Spell[]
  passive: Passive
  recommended: RecommendedItem[]
}

export interface Passive {
  name: string
  description: string
  image: Image
}

export interface Skin {
  id: string
  num: number
  name: string
  chromas: boolean
}

export interface Info {
  attack: number
  defense: number
  magic: number
  difficulty: number
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
}

export interface Spell {
  id: string
  name: string
  description: string
  tooltip: string
  leveltip?: LevelTip
  maxrank: number
  cooldown: number[]
  cooldownBurn: string
  cost: number[]
  costBurn: string
  datavalues: Record<string, number>
  effect: (number | number[] | null)[]
  effectBurn: (string | null)[]
  vars: Var[]
  costType: string
  maxammo: string
  range: number[]
  rangeBurn: string
  image: Image
  resource: string
}

export interface LevelTip {
  label: string[]
  effect: string[]
}

export interface Var {
  key: string
  link: string
  coeff: number[]
}
