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
  stats: Stats
  spells: Spell[]
  passive: Passive
  recommended: RecommendedItem[]
}

export interface Item {
  name: string
  description: string
  colloq: string
  plaintext: string
  into?: string[]
  from?: string[]
  consumed?: boolean
  depth?: number
  specialRecipe?: number
  image: Image
  gold: Gold
  tags: string[]
  maps: { [mapId: string]: boolean }
  stats: Stats
}

export interface Rune {
  id: number
  key: string
  icon: string
  name: string
  slots: {
    runes: SubRune[]
  }[]
}

export interface SubRune {
  id: number
  key: string
  icon: string
  name: string
  shortDesc: string
  longDesc: string
}

export interface Shard {
  type: string
  description: string
  image: string
}

export interface ShardColumn {
  [index: number]: Shard[]
}

export interface ShardsData {
  data: ShardColumn[]
}

export interface Summoner {
  id: string
  name: string
  description: string
  tooltip: string
  maxrank: number
  cooldown: number[]
  cooldownBurn: string
  cost: number[]
  costBurn: string
  datavalues: Record<string, number>
  effect: (number[] | null)[]
  effectBurn: (string | null)[]
  vars: string[]
  key: string
  summonerLevel: number
  modes: string[]
  costType: string
  maxammo: string
  range: number[]
  rangeBurn: string
  image: Image
  resource: string
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

export interface Stats {
  hp?: number
  hpperlevel?: number
  mp?: number
  mpperlevel?: number
  armor?: number
  armorperlevel?: number
  spellblock?: number
  spellblockperlevel?: number
  attackrange?: number
  hpregen?: number
  hpregenperlevel?: number
  mpregen?: number
  mpregenperlevel?: number
  crit?: number
  critperlevel?: number
  attackdamage?: number
  attackdamageperlevel?: number
  attackspeedperlevel?: number
  attackspeed?: number
  [key: string]: number | undefined
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

export interface Passive {
  name: string
  description: string
  image: Image
}

export interface Image {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

export interface Gold {
  base: number
  purchasable: boolean
  total: number
  sell: number
}

export interface RecommendedItem {
  champion: string
  title: string
  map: string
  mode: string
  type: string
  customTag?: string
  blocks: Block[]
}

export interface Block {
  type: string
  items: Items[]
  recMath?: boolean
  minSummonerLevel?: number
  maxSummonerLevel?: number
}

export interface Items {
  id: number
  count: number
  hideCount: boolean
  requiredChampion?: string
}

export interface SummonerSelection {
  principal: Summoner | null
  second: Summoner | null
}

export interface ShardSelection {
  principal: Shard | null
  second: Shard | null
  third: Shard | null
}

export interface GroupSelection {
  principal: SubRune | null
  second: SubRune | null
  first: boolean
  two: boolean
}

export interface RunesSelection {
  principal: Rune | null
  second: Rune | null
  groups: GroupSelection[]
}
