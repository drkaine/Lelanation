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
 * Corrige définitivement les dates incorrectes dans les données YouTube
 */
async function fixYoutubeDates(): Promise<void> {
  try {
    console.log("🔧 Correction définitive des dates YouTube...");

    const storagePath = path.join(
      __dirname,
      "../../../frontend/src/assets/files/data/youtube.json",
    );

    // Charger les données
    const data = await fs.readFile(storagePath, "utf-8");
    const storage: YoutubeStorage = JSON.parse(data);

    console.log(`\n📊 Données avant correction:`);
    console.log(`   - Total vidéos: ${storage.videos.length}`);

    // Corriger les dates incorrectes (2025 -> 2024)
    let correctedCount = 0;

    storage.videos.forEach((video) => {
      if (video.snippet.publishedAt.startsWith("2025")) {
        const originalDate = video.snippet.publishedAt;
        video.snippet.publishedAt = originalDate.replace("2025", "2024");
        correctedCount++;
      }
    });

    console.log(`\n🔧 Correction des dates:`);
    console.log(`   - ${correctedCount} dates corrigées (2025 → 2024)`);

    // Mettre à jour les informations des chaînes
    for (const channel of storage.channels) {
      const channelVideos = storage.videos.filter(
        (v) => v.snippet.channelId === channel.channelId,
      );

      if (channelVideos.length > 0) {
        // Trier par date de publication
        const sortedVideos = channelVideos.sort(
          (a, b) =>
            new Date(b.snippet.publishedAt).getTime() -
            new Date(a.snippet.publishedAt).getTime(),
        );

        // Mettre à jour les informations de la chaîne
        channel.videoCount = channelVideos.length;
        channel.lastVideoDate = sortedVideos[0].snippet.publishedAt;
        channel.lastUpdate = Date.now();

        console.log(`\n📺 ${channel.channelName}:`);
        console.log(`   - Vidéos: ${channel.videoCount}`);
        console.log(`   - Dernière vidéo: ${channel.lastVideoDate}`);
      }
    }

    // Sauvegarder les corrections
    storage.lastUpdate = Date.now();
    await fs.writeFile(storagePath, JSON.stringify(storage, null, 2));

    // Vérification finale
    const finalData = await fs.readFile(storagePath, "utf-8");
    const finalStorage: YoutubeStorage = JSON.parse(finalData);

    const stillIncorrect = finalStorage.videos.filter((v) =>
      v.snippet.publishedAt.startsWith("2025"),
    );

    console.log(`\n✅ Vérification finale:`);
    console.log(
      `   - Vidéos avec dates encore incorrectes: ${stillIncorrect.length}`,
    );

    if (stillIncorrect.length === 0) {
      console.log(`   - ✅ Toutes les dates sont maintenant correctes!`);
    } else {
      console.log(
        `   - ⚠️ Il reste ${stillIncorrect.length} vidéos avec des dates incorrectes`,
      );
    }

    // Afficher les 5 dernières vidéos de Lelariva
    const lelarivaVideos = finalStorage.videos
      .filter((v) => v.snippet.channelId === "UCz0D_xJRQamxRlTrec5j4oA")
      .sort(
        (a, b) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );

    console.log(`\n🎬 5 dernières vidéos Lelariva:`);
    lelarivaVideos.slice(0, 5).forEach((video, index) => {
      const date = new Date(video.snippet.publishedAt);
      console.log(`${index + 1}. ${video.snippet.title}`);
      console.log(
        `   ${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString("fr-FR")}`,
      );
    });

    console.log("\n🎉 Correction terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de la correction:", error);
    throw error;
  }
}

// Point d'entrée
if (require.main === module) {
  fixYoutubeDates()
    .then(() => {
      console.log("\n✅ Correction terminée avec succès");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Correction échouée:", error);
      process.exit(1);
    });
}

export { fixYoutubeDates };
