import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

interface TokenStorage {
  nextPageToken: string;
  lastUpdate: number;
  tokenQuota: number;
  channelId: string;
}

interface VideoStorage {
  videos: Video[];
  lastVideoDate: string;
  channelId: string;
  lastUpdate: number;
}

interface Video {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface YouTubeApiItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export class YoutubeService {
  private readonly API_KEY: string;
  private readonly STORAGE_PATH: string;
  private readonly TOKEN_PATH: string;
  private readonly QUOTA_LIMIT: number;
  private readonly MAX_RESULTS: number;
  private readonly CHECK_INTERVAL = 3600000; // 1 heure en millisecondes

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
      // Ignorer l'erreur si le dossier existe déjà
      if (error instanceof Error && !error.message.includes("EEXIST")) {
        throw error;
      }
    }
  }

  private async loadStorage(): Promise<VideoStorage> {
    try {
      const data = await fs.readFile(this.STORAGE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("ENOENT")) {
        // Fichier n'existe pas encore, retourner un état initial
        return {
          videos: [],
          lastVideoDate: "",
          channelId: "",
          lastUpdate: 0,
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
        // Fichier n'existe pas encore, retourner un état initial
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

  /**
   * Vérifie si de nouvelles vidéos sont disponibles sans télécharger toutes les vidéos
   */
  async checkForNewVideos(channelId: string): Promise<boolean> {
    try {
      const storage = await this.loadStorage();
      
      // Si nous n'avons pas encore de vidéos ou si le dernier check était il y a plus d'une heure
      if (
        !storage.videos.length || 
        !storage.lastVideoDate ||
        Date.now() - storage.lastUpdate > this.CHECK_INTERVAL
      ) {
        return true;
      }
      
      // Récupérer seulement la vidéo la plus récente pour économiser le quota
      const checkUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`;
      
      const response = await fetch(checkUrl);
      
      if (!response.ok) {
        const error = await response.json();
        console.error("Error checking new videos:", error);
        return false;
      }
      
      const data = await response.json();
      
      // Ajouter au quota
      const tokenState = await this.loadTokenState();
      tokenState.tokenQuota += 100; // Coût d'une requête de recherche
      await this.saveTokenState(tokenState);
      
      // Aucun résultat, donc pas de nouvelle vidéo
      if (!data.items?.length) return false;
      
      // Comparer la date de la vidéo la plus récente avec celle que nous avons déjà
      const latestVideoDate = new Date(data.items[0].snippet.publishedAt);
      const storedLatestDate = new Date(storage.lastVideoDate);
      
      // Retourner true si une nouvelle vidéo est sortie
      return latestVideoDate > storedLatestDate;
    } catch (error) {
      console.error("Error checking for new videos:", error);
      return false; // En cas d'erreur, on suppose qu'il n'y a pas de nouvelles vidéos
    }
  }

  async fetchAndStoreVideos(channelId: string): Promise<Video[]> {
    try {
      const storage = await this.loadStorage();
      let tokenState = await this.loadTokenState();

      // Vérifier si de nouvelles vidéos sont disponibles
      const hasNewVideos = await this.checkForNewVideos(channelId);
      if (!hasNewVideos) {
        console.log("No new videos found, returning cached videos");
        return storage.videos;
      }

      if (this.isNewDay(tokenState.lastUpdate)) {
        tokenState = {
          nextPageToken: "",
          lastUpdate: Date.now(),
          tokenQuota: 0,
          channelId,
        };
      }

      if (tokenState.tokenQuota >= this.QUOTA_LIMIT) {
        console.log("Quota limit reached, returning cached videos");
        return storage.videos;
      }

      const baseUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${this.MAX_RESULTS}&type=video`;

      let nextPageToken = tokenState.nextPageToken;
      let newVideos: Video[] = [];

      do {
        const response = await fetch(
          `${baseUrl}${nextPageToken ? "&pageToken=" + nextPageToken : ""}`,
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "Failed to fetch videos");
        }

        const data = await response.json();

        tokenState.tokenQuota += 100;
        tokenState.lastUpdate = Date.now();

        if (!data.items?.length) break;

        newVideos = [
          ...newVideos,
          ...data.items.map((item: YouTubeApiItem) => ({
            ...item,
            id: item.id.videoId,
          })),
        ];

        nextPageToken = data.nextPageToken;
        tokenState.nextPageToken = nextPageToken;

        await this.saveTokenState(tokenState);

        if (tokenState.tokenQuota >= this.QUOTA_LIMIT) break;
      } while (nextPageToken);

      const allVideos = [...storage.videos, ...newVideos];
      const uniqueVideos = Array.from(
        new Map(allVideos.map((video) => [video.id, video])).values(),
      );

      // Sauvegarder les vidéos
      if (uniqueVideos.length > 0) {
        // Trier les vidéos par date de publication (plus récente d'abord)
        const sortedVideos = [...uniqueVideos].sort((a, b) => 
          new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime()
        );
        
        // Sauvegarder avec la date de la vidéo la plus récente
        await this.saveStorage({
          videos: uniqueVideos,
          lastVideoDate: sortedVideos[0].snippet.publishedAt,
          channelId,
          lastUpdate: Date.now(),
        });
      } else {
        await this.saveStorage({
          videos: uniqueVideos,
          lastVideoDate: storage.lastVideoDate || new Date().toISOString(),
          channelId,
          lastUpdate: Date.now(),
        });
      }

      return uniqueVideos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  }

  async getVideos(channelId: string): Promise<Video[]> {
    const storage = await this.loadStorage();
    
    // Vérifier si le cache existe et si c'est pour le bon channelId
    if (storage.channelId === channelId) {
      // Vérifier s'il y a de nouvelles vidéos
      const hasNewVideos = await this.checkForNewVideos(channelId);
      if (!hasNewVideos) {
        return storage.videos;
      }
    }

    // Récupérer de nouvelles données
    return this.fetchAndStoreVideos(channelId);
  }

  async searchVideos(channelId: string, query: string): Promise<Video[]> {
    const storage = await this.loadStorage();
    const videos = storage.videos;

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
}
