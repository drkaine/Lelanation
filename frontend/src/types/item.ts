import type { Image, Gold } from './common'
import type { ItemStats } from './stat'

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
  stats: ItemStats
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

export interface ItemSelection {
  starter: Item[] | null
  core: Item[] | null
  situationnel: Item[] | null
  boots: Item[] | null
  stats: ItemStats
  gold: Gold
}
