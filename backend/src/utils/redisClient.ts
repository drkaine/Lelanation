import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const CACHE_TTL = parseInt(process.env.REDIS_CACHE_TTL || "3600"); // TTL par défaut: 1 heure

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Erreur de connexion Redis:", err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connexion Redis établie");
  } catch (error) {
    console.error("Impossible de se connecter à Redis:", error);
  }
};

const redisUtils = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  },

  async set<T>(key: string, value: T, ttl: number = CACHE_TTL): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await redisClient.set(key, stringValue, { EX: ttl });
    } catch (error) {
      console.error(`Erreur lors du stockage de ${key}:`, error);
    }
  },

  async del(...keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression des clés:`, error);
    }
  },

  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(
        `Erreur lors de la suppression des clés avec motif ${pattern}:`,
        error,
      );
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error(
        `Erreur lors de la vérification de l'existence de ${key}:`,
        error,
      );
      return false;
    }
  },
};

export { redisClient, connectRedis, redisUtils };
