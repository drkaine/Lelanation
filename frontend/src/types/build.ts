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

export interface BuildStats {
  hp: number
  armor: number
  spellblock: number
  attackdamage: number
  attackrange: number
  attackspeed: number
  crit: number
  hpregen: number
  movespeed: number
  mp: number
  mpregen: number
  CDR?: number
  AP?: number
  lethality?: number
  magicPenetration?: number
  tenacity?: number
  lvl: number
}
