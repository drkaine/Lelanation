import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const CACHE_TTL = parseInt(process.env.REDIS_CACHE_TTL || "3600"); // TTL par défaut: 1 heure

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

class LocalCacheStore {
  private store: Map<string, CacheEntry<unknown>>;
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.store = new Map();
    this.maxSize = maxSize;
  }

  set<T>(key: string, value: T, ttl: number): void {
    if (this.store.size >= this.maxSize) {
      const iterator = this.store.keys();
      const oldestKey = iterator.next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    const expiry = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiry });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    if (entry.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  del(key: string): void {
    this.store.delete(key);
  }

  delByPattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));

    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  exists(key: string): boolean {
    const entry = this.store.get(key);
    return !!entry && entry.expiry >= Date.now();
  }
}

const localCache = new LocalCacheStore();

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 50, 2000);
      console.log(
        `Tentative de reconnexion Redis (${retries + 1}) dans ${delay}ms...`,
      );
      return delay;
    },
    keepAlive: true,
    keepAliveInitialDelay: 5000,
    connectTimeout: 20000,
    noDelay: true,
  },
  pingInterval: 30000,
});

redisClient.on("error", (err) => {
  console.error("Erreur de connexion Redis:", err.message || err);
  if (err.message && err.message.includes("Socket closed unexpectedly")) {
    console.log("Reconnexion Redis automatique en cours...");
  }
});

redisClient.on("reconnecting", () => {
  console.log("Reconnexion à Redis en cours...");
});

redisClient.on("connect", () => {
  console.log("Socket Redis connecté");
});

redisClient.on("ready", () => {
  console.log("Client Redis prêt");
});

redisClient.on("end", () => {
  console.log("Connexion Redis fermée");
});

const connectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      console.log("Redis déjà connecté");
      return true;
    }

    await redisClient.connect();
    console.log("Connexion Redis établie");

    const pong = await redisClient.ping();
    console.log(`Test de connexion Redis: ${pong}`);

    return true;
  } catch (error) {
    console.error("Impossible de se connecter à Redis:", error);
    return false;
  }
};

const isRedisAvailable = () => {
  try {
    return redisClient.isReady && redisClient.isOpen;
  } catch (error) {
    console.warn("Erreur lors de la vérification de l'état Redis:", error);
    return false;
  }
};

const checkRedisHealth = async (): Promise<boolean> => {
  try {
    if (!isRedisAvailable()) {
      return false;
    }
    const pong = await redisClient.ping();
    return pong === "PONG";
  } catch (error) {
    console.warn("Test de santé Redis échoué:", error);
    return false;
  }
};

const redisUtils = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (isRedisAvailable()) {
        const data = await redisClient.get(key);
        return data ? (JSON.parse(data) as T) : null;
      } else {
        console.log(
          `Redis indisponible, utilisation du cache local pour GET ${key}`,
        );
        return localCache.get(key) as T | null;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return localCache.get(key) as T | null;
    }
  },

  async set<T>(key: string, value: T, ttl: number = CACHE_TTL): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      localCache.set(key, JSON.parse(stringValue), ttl);

      if (isRedisAvailable()) {
        await redisClient.set(key, stringValue, { EX: ttl });
      } else {
        console.log(
          `Redis indisponible, mise en cache uniquement locale pour ${key}`,
        );
      }
    } catch (error) {
      console.error(`Erreur lors du stockage de ${key}:`, error);
      try {
        localCache.set(key, JSON.parse(JSON.stringify(value)), ttl);
      } catch (e) {
        console.error(`Impossible d'utiliser le cache local pour ${key}:`, e);
      }
    }
  },

  async del(...keys: string[]): Promise<void> {
    try {
      if (keys.length === 0) return;

      console.log(`Suppression des clés du cache: ${keys.join(", ")}`);
      keys.forEach((key) => localCache.del(key));

      if (isRedisAvailable() && keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Clés supprimées de Redis: ${keys.join(", ")}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression des clés:`, error);
    }
  },

  async delByPattern(pattern: string): Promise<void> {
    try {
      console.log(`Tentative de suppression des clés avec motif: ${pattern}`);
      localCache.delByPattern(pattern);

      if (isRedisAvailable()) {
        const keys = await redisClient.keys(pattern);
        console.log(
          `Clés Redis trouvées pour le motif ${pattern}: ${keys.length > 0 ? keys.join(", ") : "aucune"}`,
        );

        if (keys.length > 0) {
          await redisClient.del(keys);
          console.log(
            `${keys.length} clés supprimées de Redis pour le motif ${pattern}`,
          );
        }
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
      if (isRedisAvailable()) {
        const result = await redisClient.exists(key);
        return result === 1;
      } else {
        return localCache.exists(key);
      }
    } catch (error) {
      console.error(
        `Erreur lors de la vérification de l'existence de ${key}:`,
        error,
      );
      return localCache.exists(key);
    }
  },
};

const gracefulShutdown = async (): Promise<void> => {
  try {
    if (redisClient.isOpen) {
      console.log("Fermeture gracieuse de la connexion Redis...");
      await redisClient.quit();
      console.log("Connexion Redis fermée proprement");
    }
  } catch (error) {
    console.error("Erreur lors de la fermeture Redis:", error);
    try {
      await redisClient.disconnect();
    } catch (disconnectError) {
      console.error(
        "Erreur lors de la déconnexion forcée Redis:",
        disconnectError,
      );
    }
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGUSR2", gracefulShutdown);

export {
  redisClient,
  connectRedis,
  redisUtils,
  isRedisAvailable,
  checkRedisHealth,
  gracefulShutdown,
};
