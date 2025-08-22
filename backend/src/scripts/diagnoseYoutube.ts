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
 * Affiche un diagnostic des données YouTube sans utiliser l'API
 */
async function diagnoseYoutubeData(): Promise<void> {
  try {
    console.log("🔍 Diagnostic des données YouTube...");

    const storagePath = path.join(
      __dirname,
      "../../../frontend/src/assets/files/data/youtube.json",
    );

    // Charger les données
    const data = await fs.readFile(storagePath, "utf-8");
    const storage: YoutubeStorage = JSON.parse(data);

    console.log(`\n📊 Données stockées:`);
    console.log(`   - Total vidéos: ${storage.videos.length}`);
    console.log(`   - Chaînes: ${storage.channels.length}`);
    console.log(
      `   - Dernière mise à jour: ${new Date(storage.lastUpdate).toLocaleString("fr-FR")}`,
    );

    // Analyser chaque chaîne
    for (const channel of storage.channels) {
      console.log(`\n📺 ${channel.channelName}:`);
      console.log(`   - ID: ${channel.channelId}`);
      console.log(`   - Vidéos stockées: ${channel.videoCount}`);
      console.log(`   - Complète: ${channel.isComplete ? "✅ OUI" : "❌ NON"}`);
      console.log(`   - Dernière vidéo: ${channel.lastVideoDate}`);
      console.log(
        `   - Dernière mise à jour: ${new Date(channel.lastUpdate).toLocaleString("fr-FR")}`,
      );

      // Compter les vidéos de cette chaîne
      const channelVideos = storage.videos.filter(
        (v) => v.snippet.channelId === channel.channelId,
      );
      console.log(`   - Vidéos réelles: ${channelVideos.length}`);

      // Afficher les 3 dernières vidéos
      if (channelVideos.length > 0) {
        const sortedVideos = channelVideos.sort(
          (a, b) =>
            new Date(b.snippet.publishedAt).getTime() -
            new Date(a.snippet.publishedAt).getTime(),
        );

        console.log(`   - 3 dernières vidéos:`);
        sortedVideos.slice(0, 3).forEach((video, index) => {
          const date = new Date(video.snippet.publishedAt);
          console.log(`     ${index + 1}. ${video.snippet.title}`);
          console.log(
            `        ${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString("fr-FR")}`,
          );
        });
      }

      // Vérifier les métadonnées
      const totalKnown = storage.metadata.totalVideosKnown[channel.channelId];
      const hasAllOld = storage.metadata.hasAllOldVideos[channel.channelId];

      if (totalKnown) {
        console.log(`   - Vidéos connues sur YouTube: ${totalKnown}`);
        console.log(
          `   - A toutes les anciennes vidéos: ${hasAllOld ? "✅ OUI" : "❌ NON"}`,
        );
      }
    }

    // Vérifier les dates incorrectes
    const incorrectDates = storage.videos.filter((v) =>
      v.snippet.publishedAt.startsWith("2025"),
    );

    if (incorrectDates.length > 0) {
      console.log(
        `\n⚠️ Attention: ${incorrectDates.length} vidéos ont des dates incorrectes (2025)`,
      );
    } else {
      console.log(`\n✅ Toutes les dates sont correctes`);
    }

    console.log("\n🎉 Diagnostic terminé!");
  } catch (error) {
    console.error("❌ Erreur lors du diagnostic:", error);
    throw error;
  }
}

// Point d'entrée
if (require.main === module) {
  diagnoseYoutubeData()
    .then(() => {
      console.log("\n✅ Diagnostic terminé avec succès");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Diagnostic échoué:", error);
      process.exit(1);
    });
}

export { diagnoseYoutubeData };
