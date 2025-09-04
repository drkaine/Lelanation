import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import type {
  Video,
  VideoStorage,
  TokenStorage,
  YouTubeApiItem,
  ChannelInfo,
} from "../types";
import { youtubeUpdateNotifier } from "../websocket/YouTubeUpdateNotifier";

dotenv.config();

export class YoutubeService {
  private readonly API_KEY: string;
  private readonly STORAGE_PATH: string;
  private readonly TOKEN_PATH: string;
  private readonly QUOTA_LIMIT: number;
  private readonly MAX_RESULTS: number;
  private readonly CHECK_INTERVAL = 3600000; // 1 heure en millisecondes
  private readonly COMPLETE_THRESHOLD = 5000; // Nombre de vidéos pour considérer une chaîne comme complète

  constructor() {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error(
        "YOUTUBE_API_KEY is not defined in environment variables",
      );
    }

    this.API_KEY = process.env.YOUTUBE_API_KEY;
    this.STORAGE_PATH = path.join(
      __dirname,
      "../../../frontend/src/assets/files/data/youtube.json",
    );
    this.TOKEN_PATH = path.join(
      __dirname,
      "../../../frontend/src/assets/files/data/token-state.json",
    );
    this.QUOTA_LIMIT = 10000;
    this.MAX_RESULTS = 50;

    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    try {
      const dataDir = path.dirname(this.STORAGE_PATH);
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      if (error instanceof Error && !error.message.includes("EEXIST")) {
        throw error;
      }
    }
  }

  private async loadStorage(): Promise<VideoStorage> {
    try {
      const data = await fs.readFile(this.STORAGE_PATH, "utf-8");
      const parsed = JSON.parse(data);

      if (!parsed.metadata) {
        parsed.metadata = {
          totalVideosKnown: {},
          hasAllOldVideos: {},
          lastStatsUpdate: {},
        };
      }

      return parsed;
    } catch (error) {
      if (error instanceof Error && error.message.includes("ENOENT")) {
        return {
          videos: [],
          channels: [],
          lastUpdate: 0,
          metadata: {
            totalVideosKnown: {},
            hasAllOldVideos: {},
            lastStatsUpdate: {},
          },
        };
      }
      throw error;
    }
  }

  private async loadTokenState(): Promise<TokenStorage> {
    try {
      const data = await fs.readFile(this.TOKEN_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("ENOENT")) {
        return {
          nextPageToken: "",
          lastUpdate: 0,
          tokenQuota: 0,
          channelId: "",
        };
      }
      throw error;
    }
  }

  private async saveStorage(data: VideoStorage): Promise<void> {
    await fs.writeFile(this.STORAGE_PATH, JSON.stringify(data, null, 2));
  }

  private async saveTokenState(data: TokenStorage): Promise<void> {
    await fs.writeFile(this.TOKEN_PATH, JSON.stringify(data, null, 2));
  }

  private isNewDay(lastUpdate: number): boolean {
    const now = new Date();
    const last = new Date(lastUpdate);
    return now.getUTCDate() !== last.getUTCDate();
  }

  async getChannelId(username: string): Promise<string> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&q=${username}&type=channel&part=id`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to fetch channel ID");
      }

      const data = await response.json();

      if (!data.items?.length) throw new Error("Channel not found");

      const tokenState = await this.loadTokenState();
      tokenState.tokenQuota += 100;
      await this.saveTokenState(tokenState);

      return data.items[0].id.channelId;
    } catch (error) {
      console.error("Error getting channel ID:", error);
      throw error;
    }
  }

  async checkForNewVideos(channelId: string): Promise<boolean> {
    try {
      const storage = await this.loadStorage();
      const channelInfo = storage.channels.find(
        (c) => c.channelId === channelId,
      );

      if (!channelInfo) {
        console.log("Channel not found, forcing check");
        return true;
      }

      // Si la chaîne est marquée comme complète, ne pas chercher de nouvelles vidéos
      if (channelInfo.isComplete) {
        console.log(
          `✅ Channel ${channelInfo.channelName} is complete, no need to check for new videos`,
        );
        return false;
      }

      if (Date.now() - channelInfo.lastUpdate > this.CHECK_INTERVAL) {
        console.log("Forcing check: last update was too long ago");
        return true;
      }

      const hasAllOldVideos =
        storage.metadata.hasAllOldVideos[channelId] ?? false;
      const totalVideosKnown =
        storage.metadata.totalVideosKnown[channelId] ?? 0;

      console.log(`📊 Channel analysis for ${channelInfo.channelName}:`);
      console.log(`   - Videos in storage: ${channelInfo.videoCount}`);
      console.log(`   - Total videos known: ${totalVideosKnown}`);
      console.log(`   - Has all old videos: ${hasAllOldVideos}`);
      console.log(`   - Is marked complete: ${channelInfo.isComplete}`);

      if (hasAllOldVideos) {
        console.log(
          "✅ Channel has all old videos, checking for new videos only",
        );
        return this.checkForNewVideosOnly(channelId, channelInfo.lastVideoDate);
      } else {
        console.log("⏳ Channel missing old videos, need to fetch more");
        return true;
      }
    } catch (error) {
      console.error("Error checking for new videos:", error);
      return true;
    }
  }

  private async checkForNewVideosOnly(
    channelId: string,
    lastVideoDate: string,
  ): Promise<boolean> {
    try {
      console.log("Checking for new videos since:", lastVideoDate);

      const checkUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video&publishedAfter=${lastVideoDate}`;

      const response = await fetch(checkUrl);

      if (!response.ok) {
        const error = await response.json();
        console.error("Error checking new videos:", error);
        return true;
      }

      const data = await response.json();

      const tokenState = await this.loadTokenState();
      tokenState.tokenQuota += 100;
      await this.saveTokenState(tokenState);

      if (!data.items?.length) {
        console.log("No new videos found");
        return false;
      }

      console.log("New videos found, updating");
      return true;
    } catch (error) {
      console.error("Error checking for new videos only:", error);
      return true;
    }
  }

  private cleanHtmlEntities(text: string): string {
    if (!text) return "";

    return text
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");
  }

  private cleanVideoData(video: Video): Video {
    if (!video || !video.snippet) return video;

    return {
      ...video,
      snippet: {
        ...video.snippet,
        title: this.cleanHtmlEntities(video.snippet.title),
        description: this.cleanHtmlEntities(video.snippet.description),
      },
    };
  }

  async cleanExistingData(): Promise<void> {
    try {
      const storage = await this.loadStorage();

      if (!storage.videos || !storage.videos.length) {
        console.log("No videos to clean");
        return;
      }

      console.log(`Cleaning ${storage.videos.length} videos`);

      const cleanedVideos = storage.videos.map((video) =>
        this.cleanVideoData(video),
      );

      await this.saveStorage({
        ...storage,
        videos: cleanedVideos,
      });

      console.log("Videos cleaned successfully");
    } catch (error) {
      console.error("Error cleaning video data:", error);
      throw error;
    }
  }

  async fetchAndStoreVideos(channelId: string): Promise<Video[]> {
    try {
      console.log("Fetching videos for channel:", channelId);

      const storage = await this.loadStorage();
      let tokenState = await this.loadTokenState();
      let channelInfo = storage.channels.find((c) => c.channelId === channelId);

      if (!channelInfo) {
        console.log("Channel not found, creating new channel info");
        try {
          const channelName = await this.getChannelName(channelId);
          channelInfo = {
            channelId,
            channelName,
            isComplete: false,
            lastVideoDate: "",
            lastUpdate: Date.now(),
            videoCount: 0,
          };
          storage.channels.push(channelInfo);
        } catch {
          console.log("Error getting channel name, using default");
          channelInfo = {
            channelId,
            channelName: "Unknown Channel",
            isComplete: false,
            lastVideoDate: "",
            lastUpdate: Date.now(),
            videoCount: 0,
          };
          storage.channels.push(channelInfo);
        }
      }

      if (tokenState.channelId !== channelId) {
        console.log("Channel ID changed, resetting token");
        tokenState.nextPageToken = "";
      }

      if (this.isNewDay(tokenState.lastUpdate)) {
        console.log("New day, resetting quota");
        tokenState = {
          nextPageToken: tokenState.nextPageToken,
          lastUpdate: Date.now(),
          tokenQuota: 0,
          channelId,
        };
      }

      // Vérifier si on a des vidéos en cache et si la chaîne est marquée comme complète
      const cachedVideos = storage.videos.filter((v) =>
        this.isVideoFromChannel(v, channelId),
      );

      if (channelInfo.isComplete && cachedVideos.length > 0) {
        console.log("Channel marked as complete, checking for new videos only");
        // Vérifier s'il y a de nouvelles vidéos depuis la dernière
        const latestVideo = cachedVideos[0];
        const checkUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5&type=video&publishedAfter=${latestVideo.snippet.publishedAt}`;

        try {
          const response = await fetch(checkUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
              console.log(`Found ${data.items.length} new videos, updating...`);
              // Continuer avec la récupération complète
            } else {
              console.log("No new videos found, returning cached videos");
              return cachedVideos;
            }
          }
        } catch {
          console.log(
            "Error checking for new videos, proceeding with full fetch",
          );
        }
      }

      if (tokenState.tokenQuota >= this.QUOTA_LIMIT) {
        console.log("Quota limit reached, returning cached videos");
        return cachedVideos;
      }

      const baseUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${this.MAX_RESULTS}&type=video`;

      let nextPageToken = tokenState.nextPageToken;
      let allNewVideos: Video[] = [];
      let pageCount = 0;
      const MAX_PAGES = 10;

      console.log("Starting with page token:", nextPageToken || "none");

      do {
        console.log(
          `Fetching page ${pageCount + 1}${nextPageToken ? " with token: " + nextPageToken : ""}`,
        );

        const response = await fetch(
          `${baseUrl}${nextPageToken ? "&pageToken=" + nextPageToken : ""}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(
            errorData.error?.message ||
              `Failed to fetch videos: ${response.status}`,
          );
        }

        const data = await response.json();

        console.log(`Received ${data.items?.length || 0} videos`);

        tokenState.tokenQuota += 100;
        tokenState.lastUpdate = Date.now();

        if (!data.items?.length) {
          console.log("No items in response, breaking loop");
          break;
        }

        const newVideos = data.items.map((item: YouTubeApiItem) => {
          const video = {
            ...item,
            id: item.id.videoId,
            snippet: {
              ...item.snippet,
              channelId: channelId,
            },
          };

          return this.cleanVideoData(video);
        });

        allNewVideos = [...allNewVideos, ...newVideos];

        nextPageToken = data.nextPageToken;
        tokenState.nextPageToken = nextPageToken;
        tokenState.channelId = channelId;

        await this.saveTokenState(tokenState);

        pageCount++;

        if (
          tokenState.tokenQuota >= this.QUOTA_LIMIT ||
          pageCount >= MAX_PAGES
        ) {
          console.log(
            tokenState.tokenQuota >= this.QUOTA_LIMIT
              ? "Quota limit reached, stopping pagination"
              : "Max pages reached, stopping pagination",
          );
          break;
        }
      } while (nextPageToken);

      console.log(`Total new videos fetched: ${allNewVideos.length}`);

      const videoMap = new Map<string, Video>();

      storage.videos.forEach((video) => {
        videoMap.set(video.id, video);
      });

      allNewVideos.forEach((video) => {
        videoMap.set(video.id, video);
      });

      const uniqueVideos = Array.from(videoMap.values());

      console.log(`Total unique videos after merge: ${uniqueVideos.length}`);

      const sortedVideos = uniqueVideos.sort(
        (a, b) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );

      const lastVideoDate =
        sortedVideos.length > 0
          ? sortedVideos[0].snippet.publishedAt
          : channelInfo.lastVideoDate || new Date().toISOString();

      console.log("Last video date:", lastVideoDate);

      channelInfo.lastVideoDate = lastVideoDate;
      channelInfo.lastUpdate = Date.now();
      channelInfo.videoCount = sortedVideos.length;

      await this.checkChannelCompleteness(
        channelInfo,
        channelInfo.videoCount,
        storage,
      );

      await this.saveStorage({
        videos: sortedVideos,
        channels: storage.channels,
        lastUpdate: Date.now(),
        metadata: storage.metadata,
      });

      // Notifier les clients WebSocket de la mise à jour
      const videosAdded = sortedVideos.length - storage.videos.length;
      if (videosAdded > 0) {
        youtubeUpdateNotifier.notifyUpdate({
          channelId: channelInfo.channelId,
          channelName: channelInfo.channelName,
          videosAdded,
          totalVideos: sortedVideos.length,
          lastVideoDate: lastVideoDate,
        });
      }

      return sortedVideos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  }

  async getVideos(channelId: string): Promise<Video[]> {
    try {
      return this.fetchAndStoreVideos(channelId);
    } catch (error) {
      const storage = await this.loadStorage();
      if (storage.videos.length > 0) {
        console.warn("Error fetching new videos, using cache:", error);
        return storage.videos;
      }
      throw error;
    }
  }

  async searchVideos(channelId: string, query: string): Promise<Video[]> {
    const storage = await this.loadStorage();
    const videos = storage.videos.filter((v) =>
      this.isVideoFromChannel(v, channelId),
    );

    if (!query.trim()) return videos;

    const searchTerms = query.toLowerCase().split(" ");
    return videos.filter((video) => {
      const title = video.snippet.title.toLowerCase();
      const description = video.snippet.description.toLowerCase();
      return searchTerms.every(
        (term) => title.includes(term) || description.includes(term),
      );
    });
  }

  async getChannelName(channelId: string): Promise<string> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${this.API_KEY}&id=${channelId}&part=snippet`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to fetch channel name");
      }

      const data = await response.json();

      if (!data.items?.length) throw new Error("Channel not found");

      const tokenState = await this.loadTokenState();
      tokenState.tokenQuota += 1;
      await this.saveTokenState(tokenState);

      return data.items[0].snippet.title;
    } catch (error) {
      console.error("Error getting channel name:", error);
      return channelId;
    }
  }

  async getChannelStatistics(channelId: string): Promise<{
    name: string;
    videoCount: number;
    subscriberCount: number;
    viewCount: number;
  }> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${this.API_KEY}&id=${channelId}&part=snippet,statistics`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error?.message || "Failed to fetch channel statistics",
        );
      }

      const data = await response.json();

      if (!data.items?.length) throw new Error("Channel not found");

      const channel = data.items[0];
      const tokenState = await this.loadTokenState();
      tokenState.tokenQuota += 1;
      await this.saveTokenState(tokenState);

      return {
        name: channel.snippet.title,
        videoCount: parseInt(channel.statistics.videoCount) || 0,
        subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
        viewCount: parseInt(channel.statistics.viewCount) || 0,
      };
    } catch (error) {
      console.error("Error getting channel statistics:", error);
      throw error;
    }
  }

  private isVideoFromChannel(video: Video, channelId: string): boolean {
    return video.snippet.channelId === channelId;
  }

  async addChannel(channelId: string): Promise<void> {
    try {
      const storage = await this.loadStorage();

      const existingChannel = storage.channels.find(
        (c) => c.channelId === channelId,
      );
      if (existingChannel) {
        console.log(`Channel ${channelId} already exists`);
        return;
      }

      const stats = await this.getChannelStatistics(channelId);

      const newChannel: ChannelInfo = {
        channelId,
        channelName: stats.name,
        isComplete: false,
        lastVideoDate: "",
        lastUpdate: Date.now(),
        videoCount: 0,
      };

      storage.channels.push(newChannel);
      await this.saveStorage(storage);

      console.log(`Channel ${stats.name} (${channelId}) added successfully`);
      console.log(`- Total videos on channel: ${stats.videoCount}`);
      console.log(`- Subscribers: ${stats.subscriberCount.toLocaleString()}`);
      console.log(`- Total views: ${stats.viewCount.toLocaleString()}`);
    } catch (error) {
      console.error("Error adding channel:", error);
      throw error;
    }
  }

  async getChannels(): Promise<ChannelInfo[]> {
    const storage = await this.loadStorage();
    return storage.channels;
  }

  async getVideosByChannel(channelId: string): Promise<Video[]> {
    const storage = await this.loadStorage();
    return storage.videos.filter((v) => this.isVideoFromChannel(v, channelId));
  }

  async getAllVideos(): Promise<Video[]> {
    const storage = await this.loadStorage();
    return storage.videos;
  }

  async forceCompleteChannel(
    channelId: string,
  ): Promise<{ success: boolean; videosAdded: number; totalVideos: number }> {
    console.log(`🚀 Force completing channel: ${channelId}`);

    try {
      const storage = await this.loadStorage();
      const channelInfo = storage.channels.find(
        (c) => c.channelId === channelId,
      );

      if (!channelInfo) {
        throw new Error("Channel not found");
      }

      const stats = await this.getChannelStatistics(channelId);
      const videosNeeded = stats.videoCount - channelInfo.videoCount;

      console.log(
        `📊 Target: ${stats.videoCount} videos, Current: ${channelInfo.videoCount}, Need: ${videosNeeded}`,
      );

      if (videosNeeded <= 0) {
        console.log("✅ Channel is already complete!");
        return {
          success: true,
          videosAdded: 0,
          totalVideos: channelInfo.videoCount,
        };
      }

      const initialVideoCount = channelInfo.videoCount;
      let attempts = 0;
      const maxAttempts = 5;

      while (
        channelInfo.videoCount < stats.videoCount &&
        attempts < maxAttempts
      ) {
        attempts++;
        console.log(
          `🔄 Attempt ${attempts}/${maxAttempts}: Fetching more videos...`,
        );

        const videos = await this.fetchAndStoreVideos(channelId);
        const newVideoCount = videos.length;

        if (newVideoCount === channelInfo.videoCount) {
          console.log("⚠️ No new videos found, stopping attempts");
          break;
        }

        console.log(`📈 Progress: ${newVideoCount}/${stats.videoCount} videos`);
      }

      const videosAdded = channelInfo.videoCount - initialVideoCount;

      console.log(`🎯 Force completion result:`);
      console.log(`   - Videos added: ${videosAdded}`);
      console.log(`   - Total videos: ${channelInfo.videoCount}`);
      console.log(`   - Target: ${stats.videoCount}`);
      console.log(`   - Is complete: ${channelInfo.isComplete}`);

      return {
        success: true,
        videosAdded,
        totalVideos: channelInfo.videoCount,
      };
    } catch (error) {
      console.error("❌ Error force completing channel:", error);
      throw error;
    }
  }

  private async checkChannelCompleteness(
    channelInfo: ChannelInfo,
    currentVideoCount: number,
    storage: VideoStorage,
  ): Promise<void> {
    try {
      const stats = await this.getChannelStatistics(channelInfo.channelId);
      const totalVideosOnChannel = stats.videoCount;

      storage.metadata.totalVideosKnown[channelInfo.channelId] =
        totalVideosOnChannel;
      storage.metadata.lastStatsUpdate[channelInfo.channelId] = Date.now();

      const videosForThisChannel = storage.videos.filter(
        (v) => v.snippet.channelId === channelInfo.channelId,
      );
      channelInfo.videoCount = videosForThisChannel.length;

      const hasAllVideos = currentVideoCount >= totalVideosOnChannel;
      const reachedThreshold = currentVideoCount >= this.COMPLETE_THRESHOLD;

      if (hasAllVideos || reachedThreshold) {
        channelInfo.isComplete = true;
        storage.metadata.hasAllOldVideos[channelInfo.channelId] = hasAllVideos;

        console.log(
          `✅ Channel ${channelInfo.channelName} marked as complete:`,
        );
        console.log(`   - Videos retrieved: ${currentVideoCount}`);
        console.log(`   - Total videos on channel: ${totalVideosOnChannel}`);
        console.log(`   - Has all videos: ${hasAllVideos}`);
        console.log(`   - Reached threshold: ${reachedThreshold}`);
      } else {
        channelInfo.isComplete = false;
        storage.metadata.hasAllOldVideos[channelInfo.channelId] = false;

        console.log(`⏳ Channel ${channelInfo.channelName} not complete yet:`);
        console.log(
          `   - Videos retrieved: ${currentVideoCount}/${totalVideosOnChannel}`,
        );
        console.log(
          `   - Still need: ${Math.max(0, totalVideosOnChannel - currentVideoCount)} more videos`,
        );
      }
    } catch (error) {
      console.error("Error checking channel completeness:", error);
      if (currentVideoCount >= this.COMPLETE_THRESHOLD) {
        channelInfo.isComplete = true;
        storage.metadata.hasAllOldVideos[channelInfo.channelId] = true;
        console.log(
          `⚠️ Channel ${channelInfo.channelName} marked as complete with ${currentVideoCount} videos (fallback method)`,
        );
      }
    }
  }
}
