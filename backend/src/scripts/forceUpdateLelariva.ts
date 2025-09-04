import fs from "fs/promises";
import path from "path";
import type { Video, ChannelInfo } from "../types";

interface YoutubeStorage {
  videos: Video[];
  channels: ChannelInfo[];
  lastUpdate: number;
  metadata: {
    totalVideosKnown: Record<string, number>;
    hasAllOldVideos: Record<string, boolean>;
    lastStatsUpdate: Record<string, number>;
  };
}

/**
 * Force la mise à jour de la chaîne Lelariva en réinitialisant son statut
 */
async function forceUpdateLelariva(): Promise<void> {
  try {
    console.log("🔄 Force update de la chaîne Lelariva...");

    const storagePath = path.join(
      __dirname,
      "../../../frontend/src/assets/files/data/youtube.json",
    );

    // Charger les données
    const data = await fs.readFile(storagePath, "utf-8");
    const storage: YoutubeStorage = JSON.parse(data);

    // Trouver la chaîne Lelariva
    const lelarivaChannel = storage.channels.find(
      (c) => c.channelId === "UCz0D_xJRQamxRlTrec5j4oA",
    );

    if (!lelarivaChannel) {
      throw new Error("Chaîne Lelariva non trouvée");
    }

    console.log(`📺 État actuel de Lelariva:`);
    console.log(`   - Nom: ${lelarivaChannel.channelName}`);
    console.log(`   - Vidéos: ${lelarivaChannel.videoCount}`);
    console.log(
      `   - Complète: ${lelarivaChannel.isComplete ? "✅ OUI" : "❌ NON"}`,
    );
    console.log(`   - Dernière vidéo: ${lelarivaChannel.lastVideoDate}`);

    // Réinitialiser le statut de la chaîne
    lelarivaChannel.isComplete = false;
    lelarivaChannel.lastUpdate = Date.now();

    // Réinitialiser les métadonnées
    storage.metadata.hasAllOldVideos[lelarivaChannel.channelId] = false;
    storage.metadata.lastStatsUpdate[lelarivaChannel.channelId] = Date.now();

    // Sauvegarder les modifications
    storage.lastUpdate = Date.now();
    await fs.writeFile(storagePath, JSON.stringify(storage, null, 2));

    console.log(`\n✅ Chaîne Lelariva réinitialisée:`);
    console.log(`   - isComplete: ${lelarivaChannel.isComplete}`);
    console.log(
      `   - Dernière mise à jour: ${new Date(lelarivaChannel.lastUpdate).toLocaleString("fr-FR")}`,
    );

    console.log(`\n🎯 Maintenant vous pouvez exécuter:`);
    console.log(`   npm run youtube:update UCz0D_xJRQamxRlTrec5j4oA`);
    console.log(`   ou`);
    console.log(
      `   npx ts-node src/scripts/updateYoutubeVideos.ts update UCz0D_xJRQamxRlTrec5j4oA`,
    );
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation:", error);
    throw error;
  }
}

// Point d'entrée
if (require.main === module) {
  forceUpdateLelariva()
    .then(() => {
      console.log("\n✅ Réinitialisation terminée avec succès");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Réinitialisation échouée:", error);
      process.exit(1);
    });
}

export { forceUpdateLelariva };
