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
