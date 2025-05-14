import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const CACHE_TTL = parseInt(process.env.REDIS_CACHE_TTL || "3600"); // TTL par défaut: 1 heure

// Mémoire locale pour le fallback quand Redis n'est pas disponible
// Conçue pour dégradation gracieuse du service, pas pour remplacer Redis
class LocalCacheStore {
  private store: Map<string, { value: any; expiry: number }>;
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.store = new Map();
    this.maxSize = maxSize;
  }

  set(key: string, value: any, ttl: number): void {
    // Éviter de dépasser la taille maximale
    if (this.store.size >= this.maxSize) {
      // Stratégie simple: supprimer l'entrée la plus ancienne
      const iterator = this.store.keys();
      const oldestKey = iterator.next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    const expiry = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiry });
  }

  get(key: string): any {
    const entry = this.store.get(key);
    
    if (!entry) return null;
    
    // Vérifier si l'entrée a expiré
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
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  exists(key: string): boolean {
    return this.store.has(key) && this.store.get(key)!.expiry >= Date.now();
  }
}

// Créer l'instance du cache local
const localCache = new LocalCacheStore();

// Configuration robuste pour le client Redis
const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 50, 2000);
      console.log(`Tentative de reconnexion Redis (${retries + 1}) dans ${delay}ms...`);
      return delay;
    },
    keepAlive: true,
    keepAliveInitialDelay: 5000,
    connectTimeout: 10000,
  },
});

// Gestionnaires d'événements améliorés
redisClient.on("error", (err) => {
  console.error("Erreur de connexion Redis:", err);
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
    await redisClient.connect();
    console.log("Connexion Redis établie");
    
    // Ping pour vérifier la connexion
    const pong = await redisClient.ping();
    console.log(`Test de connexion Redis: ${pong}`);
    
    return true;
  } catch (error) {
    console.error("Impossible de se connecter à Redis:", error);
    return false;
  }
};

// Helper pour vérifier si Redis est disponible
const isRedisAvailable = () => {
  return redisClient.isReady && redisClient.isOpen;
};

const redisUtils = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (isRedisAvailable()) {
        const data = await redisClient.get(key);
        return data ? (JSON.parse(data) as T) : null;
      } else {
        // Fallback vers le cache local
        console.log(`Redis indisponible, utilisation du cache local pour GET ${key}`);
        return localCache.get(key) as T | null;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      // En cas d'erreur, essayer le cache local
      return localCache.get(key) as T | null;
    }
  },

  async set<T>(key: string, value: T, ttl: number = CACHE_TTL): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      // Toujours mettre en cache localement
      localCache.set(key, JSON.parse(stringValue), ttl);
      
      if (isRedisAvailable()) {
        await redisClient.set(key, stringValue, { EX: ttl });
      } else {
        console.log(`Redis indisponible, mise en cache uniquement locale pour ${key}`);
      }
    } catch (error) {
      console.error(`Erreur lors du stockage de ${key}:`, error);
      // S'assurer que le cache local est mis à jour même en cas d'erreur Redis
      try {
        localCache.set(key, JSON.parse(JSON.stringify(value)), ttl);
      } catch (e) {
        console.error(`Impossible d'utiliser le cache local pour ${key}:`, e);
      }
    }
  },

  async del(...keys: string[]): Promise<void> {
    try {
      // Supprimer du cache local
      keys.forEach(key => localCache.del(key));
      
      if (isRedisAvailable() && keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression des clés:`, error);
    }
  },

  async delByPattern(pattern: string): Promise<void> {
    try {
      // Supprimer du cache local
      localCache.delByPattern(pattern);
      
      if (isRedisAvailable()) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(keys);
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
        // Fallback vers le cache local
        return localCache.exists(key);
      }
    } catch (error) {
      console.error(
        `Erreur lors de la vérification de l'existence de ${key}:`,
        error,
      );
      // Fallback vers le cache local
      return localCache.exists(key);
    }
  },
};

export { redisClient, connectRedis, redisUtils, isRedisAvailable };
