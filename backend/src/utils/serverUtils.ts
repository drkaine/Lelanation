import { redisClient, isRedisAvailable } from './redisClient';

/**
 * Classe utilitaire pour gérer la santé du serveur et ses composants externes
 */
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
      maxReconnectAttempts: 10
    };

    // Configurer les écouteurs d'événements Redis
    this.setupRedisListeners();
  }

  /**
   * Configure les écouteurs d'événements Redis pour suivre l'état de la connexion
   */
  private setupRedisListeners() {
    redisClient.on('connect', () => {
      console.log('Redis socket connecté');
    });

    redisClient.on('ready', () => {
      console.log('Redis client prêt et connecté');
      this.redisStatus.isConnected = true;
      this.redisStatus.lastConnected = new Date();
      this.redisStatus.reconnectAttempts = 0;
    });

    redisClient.on('error', (err) => {
      this.redisStatus.isConnected = false;
      console.error('Erreur Redis:', err);
    });

    redisClient.on('end', () => {
      this.redisStatus.isConnected = false;
      console.warn('Connexion Redis terminée');
    });
  }

  /**
   * Vérifie si Redis est utilisable
   */
  public isRedisAvailable(): boolean {
    return isRedisAvailable();
  }

  /**
   * Teste la connexion Redis avec un ping
   */
  public async testRedisConnection(): Promise<boolean> {
    try {
      if (!this.isRedisAvailable()) {
        return false;
      }

      const pong = await redisClient.ping();
      return pong === 'PONG';
    } catch (error) {
      console.error('Erreur lors du test de connexion Redis:', error);
      return false;
    }
  }

  /**
   * Récupère l'état de Redis sous forme de rapport
   */
  public getRedisStatus() {
    return {
      ...this.redisStatus,
      isCurrentlyConnected: this.isRedisAvailable()
    };
  }

  /**
   * Essaie de reconnecter Redis si déconnecté
   */
  public async tryReconnectRedis(): Promise<boolean> {
    if (this.isRedisAvailable()) {
      return true;
    }

    if (this.redisStatus.reconnectAttempts >= this.redisStatus.maxReconnectAttempts) {
      console.error(`Abandon de la reconnexion Redis après ${this.redisStatus.reconnectAttempts} tentatives`);
      return false;
    }

    try {
      this.redisStatus.reconnectAttempts++;
      console.log(`Tentative de reconnexion Redis (${this.redisStatus.reconnectAttempts}/${this.redisStatus.maxReconnectAttempts})...`);
      
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      
      return await this.testRedisConnection();
    } catch (error) {
      console.error('Erreur lors de la tentative de reconnexion Redis:', error);
      return false;
    }
  }
}

export const serverHealth = new ServerHealth(); 