export interface Video {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
    channelId: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
}

export interface ChannelInfo {
  channelId: string
  channelName: string
  isComplete: boolean
  lastVideoDate: string
  lastUpdate: number
  videoCount: number
}

export interface CacheData {
  videos: Video[]
  timestamp: number
  channelId: string
}

export interface Tab {
  id: string
  name: string
}

export interface YouTubeApiItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
}
