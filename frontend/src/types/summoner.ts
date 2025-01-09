import type { Image } from './common'

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

export interface SummonerSelection {
  principal: Summoner | null
  second: Summoner | null
}
