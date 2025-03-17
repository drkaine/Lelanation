export interface Video {
  id: string
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
