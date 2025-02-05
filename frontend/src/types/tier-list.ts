export interface TierStats {
  name: string
  score: number
  tier: string
  matchups: number
  pickrate: number
  bestMatchup: string
  worstMatchup: string
}

export interface Tier {
  'S+': string
  S: string
  A: string
  B: string
  C: string
  F: string
}

export const TIER_COLORS: Tier = {
  'S+': '#ffd700',
  S: '#32cd32',
  A: '#4169e1',
  B: '#87ceeb',
  C: '#9370db',
  F: '#ff0000',
} as const

export const TIER_DESCRIPTIONS: Tier = {
  'S+': 'OP / Hidden OP\nROULE SUR SES MATCHUPS',
  S: 'Optimal\nPERFORMANT',
  A: 'Bon Pick / Pick META\nQUELQUES COUNTERS À GÉRER',
  B: 'Correct\nMARCHE DANS LES BONNES GAMES',
  C: 'Difficile\nBEAUCOUP DE MATCHUPS DURS',
  F: 'Hors META\nEXPERT SEULEMENT',
} as const

export type ChampionData = {
  TOP?: string
  JNG?: string
  MID?: string
  ADC?: string
  SUP?: string
  Column2?: string
  Column7: string
  Column8?: string
  Column9?: string
  Column10?: string
  Column11?: string
  Column12?: string
  Column13?: string
  Column14?: string
  Column15?: string
  Column16?: string
  Column19?: string
  Column20?: string
  Column21?: string
  Column24?: string
  Column25?: string
  Column26?: string
} | null

export const roleMapping = {
  TOPLANE: 'TOP',
  JUNGLE: 'JNG',
  MIDLANE: 'MID',
  'ADC-BOT': 'ADC',
  SUPPORT: 'SUP',
} as const
