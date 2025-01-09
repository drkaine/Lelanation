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

export interface ShardSelection {
  principal: Shard | null
  second: Shard | null
  third: Shard | null
}
