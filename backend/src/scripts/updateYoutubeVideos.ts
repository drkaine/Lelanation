import { YoutubeService } from "../service/YoutubeService";
import type { Video, ChannelInfo } from "../types";

interface UpdateResult {
  success: boolean;
  videosAdded: number;
  totalVideos: number;
  channelName: string;
  lastVideoDate: string;
}

/**
 * Met à jour les vidéos YouTube pour une chaîne spécifique
 */
async function updateYoutubeVideos(channelId: string): Promise<UpdateResult> {
  const youtubeService = new YoutubeService();

  try {
    console.log(`🔄 Mise à jour des vidéos pour la chaîne: ${channelId}`);

    // Récupérer les informations actuelles de la chaîne
    const channels = await youtubeService.getChannels();
    const channelInfo = channels.find(
      (c: ChannelInfo) => c.channelId === channelId,
    );

    if (!channelInfo) {
      throw new Error(`Chaîne ${channelId} non trouvée`);
    }

    const initialVideoCount = channelInfo.videoCount;
    console.log(`📊 État initial: ${initialVideoCount} vidéos`);

    // Récupérer les nouvelles vidéos
    await youtubeService.fetchAndStoreVideos(channelId);

    // Récupérer les informations mises à jour
    const updatedChannels = await youtubeService.getChannels();
    const updatedChannelInfo = updatedChannels.find(
      (c: ChannelInfo) => c.channelId === channelId,
    );

    if (!updatedChannelInfo) {
      throw new Error("Impossible de récupérer les informations mises à jour");
    }

    const videosAdded = updatedChannelInfo.videoCount - initialVideoCount;

    console.log(`✅ Mise à jour terminée:`);
    console.log(`   - Vidéos ajoutées: ${videosAdded}`);
    console.log(`   - Total vidéos: ${updatedChannelInfo.videoCount}`);
    console.log(`   - Dernière vidéo: ${updatedChannelInfo.lastVideoDate}`);

    return {
      success: true,
      videosAdded,
      totalVideos: updatedChannelInfo.videoCount,
      channelName: updatedChannelInfo.channelName,
      lastVideoDate: updatedChannelInfo.lastVideoDate,
    };
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour:`, error);
    return {
      success: false,
      videosAdded: 0,
      totalVideos: 0,
      channelName: "",
      lastVideoDate: "",
    };
  }
}

/**
 * Met à jour toutes les chaînes YouTube
 */
async function updateAllYoutubeChannels(): Promise<void> {
  const youtubeService = new YoutubeService();

  try {
    console.log("🎬 Mise à jour de toutes les chaînes YouTube...");

    const channels = await youtubeService.getChannels();
    console.log(`📋 ${channels.length} chaînes trouvées`);

    const results: UpdateResult[] = [];

    for (const channel of channels) {
      console.log(`\n--- ${channel.channelName} ---`);
      const result = await updateYoutubeVideos(channel.channelId);
      results.push(result);

      // Pause entre les chaînes pour éviter de dépasser les quotas
      if (channels.length > 1) {
        console.log("⏳ Pause de 2 secondes...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // Résumé final
    console.log("\n📊 Résumé de la mise à jour:");
    results.forEach((result, index) => {
      const status = result.success ? "✅" : "❌";
      console.log(
        `${status} ${channels[index].channelName}: ${result.videosAdded} vidéos ajoutées`,
      );
    });

    const totalVideosAdded = results.reduce(
      (sum, result) => sum + result.videosAdded,
      0,
    );
    console.log(`\n🎉 Total: ${totalVideosAdded} vidéos ajoutées`);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour globale:", error);
    throw error;
  }
}

/**
 * Affiche les statistiques des chaînes YouTube
 */
async function displayYoutubeStats(): Promise<void> {
  const youtubeService = new YoutubeService();

  try {
    console.log("📊 Statistiques des chaînes YouTube:");

    const channels = await youtubeService.getChannels();

    if (channels.length === 0) {
      console.log("❌ Aucune chaîne trouvée");
      return;
    }

    for (const channel of channels) {
      console.log(`\n📺 ${channel.channelName}:`);
      console.log(`   - ID: ${channel.channelId}`);
      console.log(`   - Vidéos: ${channel.videoCount}`);
      console.log(`   - Complète: ${channel.isComplete ? "✅ OUI" : "❌ NON"}`);
      console.log(`   - Dernière vidéo: ${channel.lastVideoDate}`);
      console.log(
        `   - Dernière mise à jour: ${new Date(channel.lastUpdate).toLocaleString("fr-FR")}`,
      );

      // Afficher les 3 dernières vidéos
      const videos = await youtubeService.getVideosByChannel(channel.channelId);
      if (videos.length > 0) {
        console.log(`   - 3 dernières vidéos:`);
        videos.slice(0, 3).forEach((video: Video, index: number) => {
          const date = new Date(video.snippet.publishedAt);
          console.log(`     ${index + 1}. ${video.snippet.title}`);
          console.log(
            `        ${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString("fr-FR")}`,
          );
        });
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'affichage des statistiques:", error);
    throw error;
  }
}

// Point d'entrée principal
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "update": {
      const channelId = args[1];
      if (channelId) {
        updateYoutubeVideos(channelId)
          .then((result) => {
            if (result.success) {
              console.log("✅ Mise à jour terminée avec succès");
              process.exit(0);
            } else {
              console.log("❌ Mise à jour échouée");
              process.exit(1);
            }
          })
          .catch((error) => {
            console.error("💥 Erreur:", error);
            process.exit(1);
          });
      } else {
        updateAllYoutubeChannels()
          .then(() => {
            console.log("✅ Mise à jour globale terminée");
            process.exit(0);
          })
          .catch((error) => {
            console.error("💥 Erreur:", error);
            process.exit(1);
          });
      }
      break;
    }

    case "stats":
      displayYoutubeStats()
        .then(() => {
          console.log("✅ Affichage des statistiques terminé");
          process.exit(0);
        })
        .catch((error) => {
          console.error("💥 Erreur:", error);
          process.exit(1);
        });
      break;

    default:
      console.log("📖 Utilisation:");
      console.log(
        "  npm run youtube:update [channelId]  - Mettre à jour une chaîne ou toutes les chaînes",
      );
      console.log(
        "  npm run youtube:stats               - Afficher les statistiques",
      );
      process.exit(0);
  }
}

export { updateYoutubeVideos, updateAllYoutubeChannels, displayYoutubeStats };
