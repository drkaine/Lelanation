import { Request } from "express";

export interface Champion {
  image: {
    full: string;
  };
  spells: Array<{
    id: string;
  }>;
  passive: {
    image: {
      full: string;
    };
  };
}

export interface Item {
  image: {
    full: string;
  };
}

export interface Summoner {
  image: {
    full: string;
  };
}

export interface RuneSlot {
  icon: string;
  id: number;
}

export interface RunePath {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: Array<{ runes: RuneSlot[] }>;
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export interface ChampionData {
  champion?: string;
  TOP?: string;
  JNG?: string;
  MID?: string;
  SUP?: string;
  "Counter highlight"?: string;
  Couleur?: string;
  "Rappel Tech"?: string;
  Lane?: string;
  id?: string;
  "ORDER BY"?: string;
  WINRATE?: string | number;
  PICKRATE?: string | number;
  PRO?: string;
  LIMIT?: string | number;
  Custom?: string;
  [key: string]: unknown;
}

export interface TierListData {
  GRAPH: ChampionData[];
  TOPLANE: ChampionData[];
  JUNGLE: ChampionData[];
  MIDLANE: ChampionData[];
  "ADC-BOT": ChampionData[];
  SUPPORT: ChampionData[];
  TierList: ChampionData[];
  Resultats: ChampionData[];
}

export interface TokenStorage {
  nextPageToken: string;
  lastUpdate: number;
  tokenQuota: number;
  channelId: string;
}

export interface ChannelInfo {
  channelId: string;
  channelName: string;
  isComplete: boolean;
  lastVideoDate: string;
  lastUpdate: number;
  videoCount: number;
}

export interface VideoStorage {
  videos: Video[];
  channels: ChannelInfo[];
  lastUpdate: number;
  metadata: {
    totalVideosKnown: Record<string, number>;
    hasAllOldVideos: Record<string, boolean>;
    lastStatsUpdate: Record<string, number>;
  };
}

export interface Video {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export interface YouTubeApiItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}
