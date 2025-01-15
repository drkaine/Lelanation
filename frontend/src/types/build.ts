import type { Champion } from './champion'
import type { RunesSelection } from './rune'
import type { SummonerSelection } from './summoner'
import type { ShardSelection } from './shard'
import type { ItemSelection } from './item'
import type { ItemStats, ChampionStats, Stats, TotalStats } from './stat'

export interface BuildData {
  id?: string
  name: string
  description: string
  version: string
  sheet: {
    champion: Champion
    runes: RunesSelection
    summoners: SummonerSelection
    shards: ShardSelection
    items: ItemSelection
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
