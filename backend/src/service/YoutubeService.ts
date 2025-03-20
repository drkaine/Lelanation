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

      // Forcer la vérification si nous n'avons pas de vidéos ou de channelId incorrect
      if (
        !storage.videos.length ||
        storage.channelId !== channelId ||
        !storage.lastVideoDate
      ) {
        console.log("Forcing check: no videos or different channel ID");
        return true;
      }

      // Forcer la vérification si le dernier check était il y a plus d'une heure
      if (Date.now() - storage.lastUpdate > this.CHECK_INTERVAL) {
        console.log("Forcing check: last update was too long ago");
        return true;
      }

      console.log("Checking for new videos since:", storage.lastVideoDate);

      // Récupérer seulement la vidéo la plus récente pour économiser le quota
      const checkUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`;

      const response = await fetch(checkUrl);

      if (!response.ok) {
        const error = await response.json();
        console.error("Error checking new videos:", error);
        return true; // En cas d'erreur, on force le refresh pour être sûr
      }

      const data = await response.json();

      // Ajouter au quota
      const tokenState = await this.loadTokenState();
      tokenState.tokenQuota += 100;
      await this.saveTokenState(tokenState);

      // Aucun résultat, on retourne quand même true pour forcer la vérification complète
      if (!data.items?.length) {
        console.log("No items in check response, forcing full check");
        return true;
      }

      // Comparer la date de la vidéo la plus récente avec celle que nous avons déjà
      const latestVideoDate = new Date(data.items[0].snippet.publishedAt);
      const storedLatestDate = new Date(storage.lastVideoDate);

      console.log("Latest video date:", latestVideoDate);
      console.log("Stored latest date:", storedLatestDate);

      return true; // Forcer la vérification complète pour déboguer
    } catch (error) {
      console.error("Error checking for new videos:", error);
      return true; // En cas d'erreur, on force le refresh pour être sûr
    }
  }

  async fetchAndStoreVideos(channelId: string): Promise<Video[]> {
    try {
      console.log("Fetching videos for channel:", channelId);

      const storage = await this.loadStorage();
      let tokenState = await this.loadTokenState();

      // Réinitialiser le token si nous changeons de chaîne
      if (storage.channelId !== channelId) {
        console.log("Channel ID changed, resetting token");
        tokenState.nextPageToken = "";
      }

      // Réinitialiser le quota si c'est un nouveau jour
      if (this.isNewDay(tokenState.lastUpdate)) {
        console.log("New day, resetting quota");
        tokenState = {
          nextPageToken: tokenState.nextPageToken, // Garder le token pour continuer la pagination
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
      let allNewVideos: Video[] = [];
      let pageCount = 0;
      const MAX_PAGES = 10; // Limiter le nombre de pages à récupérer par session

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

        const newVideos = data.items.map((item: YouTubeApiItem) => ({
          ...item,
          id: item.id.videoId,
        }));

        allNewVideos = [...allNewVideos, ...newVideos];

        nextPageToken = data.nextPageToken;
        tokenState.nextPageToken = nextPageToken;
        tokenState.channelId = channelId;

        // Sauvegarder l'état du token après chaque page
        await this.saveTokenState(tokenState);

        pageCount++;

        // Arrêter si on atteint la limite de quota ou le nombre max de pages
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

      // Fusionner avec les vidéos existantes
      // Utiliser un Set pour éviter les doublons
      const videoMap = new Map<string, Video>();

      // D'abord ajouter les vidéos existantes
      storage.videos.forEach((video) => {
        videoMap.set(video.id, video);
      });

      // Puis ajouter/remplacer par les nouvelles
      allNewVideos.forEach((video) => {
        videoMap.set(video.id, video);
      });

      const uniqueVideos = Array.from(videoMap.values());

      console.log(`Total unique videos after merge: ${uniqueVideos.length}`);

      // Trier les vidéos par date (plus récentes d'abord)
      const sortedVideos = uniqueVideos.sort(
        (a, b) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );

      // Sauvegarder les vidéos
      const lastVideoDate =
        sortedVideos.length > 0
          ? sortedVideos[0].snippet.publishedAt
          : storage.lastVideoDate || new Date().toISOString();

      console.log("Last video date:", lastVideoDate);

      await this.saveStorage({
        videos: sortedVideos,
        lastVideoDate,
        channelId,
        lastUpdate: Date.now(),
      });

      return sortedVideos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  }

  async getVideos(channelId: string): Promise<Video[]> {
    try {
      // Force le rafraîchissement pour déboguer
      return this.fetchAndStoreVideos(channelId);
    } catch (error) {
      // En cas d'erreur, retourner le cache s'il existe
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
