import type { Champion } from './champion'
import type { RunesSelection } from './rune'
import type { SummonerSelection } from './summoner'
import type { ShardSelection } from './shard'
import type { ItemSelection } from './item'
import type { ItemStats, ChampionStats, Stats, TotalStats } from './stat'
import type { ChampionSkillsOrder } from './champion'

export interface BuildData {
  id?: string
  roles: string[]
  name: string
  author: string
  description: string
  visible: boolean
  version: string
  sheet: {
    champion: Champion
    runes: RunesSelection
    summoners: SummonerSelection
    shards: ShardSelection
    items: ItemSelection
    skillOrder: ChampionSkillsOrder
  }
  buildStats: Build
}

export interface Build {
  itemStats: ItemStats
  championStats: ChampionStats
  baseStats: Stats[]
  buildItemStats: Stats
  totalStats: TotalStats[]
}

export interface BuildProps {
  editMode: boolean
  fileName?: string
}
