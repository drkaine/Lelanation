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
