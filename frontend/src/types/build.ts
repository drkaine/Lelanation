import type { Champion } from './champion'
import type { RunesSelection } from './rune'
import type { SummonerSelection } from './summoner'
import type { ShardSelection } from './shard'
import type { ItemSelection } from './item'

export interface BuildData {
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
}
