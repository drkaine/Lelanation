import { redisClient, isRedisAvailable } from "./redisClient";

class ServerHealth {
  private redisStatus: {
    isConnected: boolean;
    lastConnected: Date | null;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  };

  constructor() {
    this.redisStatus = {
      isConnected: false,
      lastConnected: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 10,
    };

    this.setupRedisListeners();
  }

  private setupRedisListeners() {
    redisClient.on("connect", () => {
      console.log("Redis socket connecté");
    });

    redisClient.on("ready", () => {
      console.log("Redis client prêt et connecté");
      this.redisStatus.isConnected = true;
      this.redisStatus.lastConnected = new Date();
      this.redisStatus.reconnectAttempts = 0;
    });

    redisClient.on("error", (err) => {
      this.redisStatus.isConnected = false;
      console.error("Erreur Redis:", err);
    });

    redisClient.on("end", () => {
      this.redisStatus.isConnected = false;
      console.warn("Connexion Redis terminée");
    });
  }

  public isRedisAvailable(): boolean {
    return isRedisAvailable();
  }

  public async testRedisConnection(): Promise<boolean> {
    try {
      if (!this.isRedisAvailable()) {
        return false;
      }

      const pong = await redisClient.ping();
      return pong === "PONG";
    } catch (error) {
      console.error("Erreur lors du test de connexion Redis:", error);
      return false;
    }
  }

  public getRedisStatus() {
    return {
      ...this.redisStatus,
      isCurrentlyConnected: this.isRedisAvailable(),
    };
  }

  public async tryReconnectRedis(): Promise<boolean> {
    if (this.isRedisAvailable()) {
      return true;
    }

    if (
      this.redisStatus.reconnectAttempts >=
      this.redisStatus.maxReconnectAttempts
    ) {
      console.error(
        `Abandon de la reconnexion Redis après ${this.redisStatus.reconnectAttempts} tentatives`,
      );
      return false;
    }

    try {
      this.redisStatus.reconnectAttempts++;
      console.log(
        `Tentative de reconnexion Redis (${this.redisStatus.reconnectAttempts}/${this.redisStatus.maxReconnectAttempts})...`,
      );

      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      return await this.testRedisConnection();
    } catch (error) {
      console.error("Erreur lors de la tentative de reconnexion Redis:", error);
      return false;
    }
  }
}

export const serverHealth = new ServerHealth();
