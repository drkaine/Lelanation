import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

async function maintainRedisCache() {
  console.log("=== Maintenance du cache Redis ===");

  const client = createClient({ url: REDIS_URL });

  try {
    await client.connect();
    console.log("Connexion à Redis établie");

    const infoBeforeCleanup = await client.info("memory");
    console.log("État avant nettoyage:");
    console.log(infoBeforeCleanup);

    const totalKeysBefore = await client.dbSize();
    console.log(`Nombre total de clés avant nettoyage: ${totalKeysBefore}`);

    const patterns = [
      "cache:*",
      "builds:*",
      "builds:lelariva:*",
      "analytics:*",
    ];

    for (const pattern of patterns) {
      const keys = await client.keys(pattern);
      console.log(`Clés correspondant à ${pattern}: ${keys.length}`);
    }

    const keysToDelete = await client.keys("analytics:*");
    if (keysToDelete.length > 0) {
      console.log(`Suppression de ${keysToDelete.length} clés d'analytics...`);
      await client.del(keysToDelete);
      console.log("Suppression terminée.");
    }

    console.log("Exécution du processus d'expiration...");
    const expiredKeys = await client.sendCommand([
      "SCAN",
      "0",
      "COUNT",
      "1000",
      "TYPE",
      "string",
      "MATCH",
      "*",
    ]);
    console.log(`Clés analysées pour expiration: ${expiredKeys}`);

    const infoAfterCleanup = await client.info("memory");
    const totalKeysAfter = await client.dbSize();

    console.log("\nÉtat après nettoyage:");
    console.log(infoAfterCleanup);
    console.log(`Nombre total de clés après nettoyage: ${totalKeysAfter}`);
    console.log(
      `Différence: ${totalKeysBefore - totalKeysAfter} clés supprimées`,
    );
  } catch (error) {
    console.error("Erreur lors de la maintenance du cache Redis:", error);
  } finally {
    await client.quit();
    console.log("Maintenance du cache Redis terminée");
  }
}

/**
 * Vide complètement le cache Redis
 * À utiliser lors des déploiements pour garantir la cohérence des données
 */
export const flushRedisCache = async (): Promise<void> => {
  try {
    console.log("Vidage complet du cache Redis...");
    const client = createClient({ url: REDIS_URL });
    await client.connect();
    await client.flushAll();
    await client.quit();
    console.log("Cache Redis vidé avec succès");
  } catch (error) {
    console.error("Erreur lors du vidage du cache Redis:", error);
    throw error;
  }
};

if (require.main === module) {
  maintainRedisCache()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Erreur:", err);
      process.exit(1);
    });
}

export default maintainRedisCache;
