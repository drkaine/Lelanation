import { YoutubeService } from "../service/YoutubeService";

async function updateAllChannels() {
  console.log("🎬 Starting update for all YouTube channels...");

  try {
    const youtubeService = new YoutubeService();

    // Récupérer toutes les chaînes
    const channels = await youtubeService.getChannels();

    if (channels.length === 0) {
      console.log("❌ No channels found in the system");
      return;
    }

    console.log(`📊 Found ${channels.length} channels to update:`);
    channels.forEach((channel, index) => {
      console.log(
        `   ${index + 1}. ${channel.channelName} (${channel.channelId})`,
      );
    });

    console.log("\n🔄 Starting update process...\n");

    for (const channel of channels) {
      console.log(`\n🎯 Processing channel: ${channel.channelName}`);
      console.log(`   📍 Channel ID: ${channel.channelId}`);
      console.log(`   📊 Current videos: ${channel.videoCount}`);
      console.log(`   ✅ Is complete: ${channel.isComplete ? "YES" : "NO"}`);

      try {
        // Récupérer les statistiques actuelles de YouTube
        const stats = await youtubeService.getChannelStatistics(
          channel.channelId,
        );
        console.log(`   📈 YouTube stats:`);
        console.log(
          `      - Total videos: ${stats.videoCount.toLocaleString()}`,
        );
        console.log(
          `      - Subscribers: ${stats.subscriberCount.toLocaleString()}`,
        );
        console.log(`      - Total views: ${stats.viewCount.toLocaleString()}`);

        const missingVideos = stats.videoCount - channel.videoCount;

        if (missingVideos > 0) {
          console.log(
            `   ⚠️  Missing videos: ${missingVideos.toLocaleString()}`,
          );

          if (channel.isComplete) {
            console.log(
              `   🔄 Channel marked as complete, checking for new videos only...`,
            );
            // Si la chaîne est marquée comme complète, chercher seulement les nouvelles vidéos
            const newVideos = await youtubeService.fetchAndStoreVideos(
              channel.channelId,
            );
            console.log(`   ✅ Found ${newVideos.length} new videos`);
          } else {
            console.log(`   🔄 Channel incomplete, forcing completion...`);
            // Si la chaîne n'est pas complète, forcer la complétion
            await youtubeService.forceCompleteChannel(channel.channelId);
            console.log(`   ✅ Completion process finished`);
          }
        } else {
          console.log(`   ✅ No missing videos detected`);
        }

        // Recharger les informations de la chaîne après mise à jour
        const updatedChannels = await youtubeService.getChannels();
        const updatedChannel = updatedChannels.find(
          (c) => c.channelId === channel.channelId,
        );

        if (updatedChannel) {
          console.log(`   📊 Updated status:`);
          console.log(`      - Videos: ${updatedChannel.videoCount}`);
          console.log(
            `      - Is complete: ${updatedChannel.isComplete ? "✅ YES" : "❌ NO"}`,
          );
          console.log(
            `      - Last update: ${new Date(updatedChannel.lastUpdate).toLocaleString()}`,
          );
        }
      } catch (error) {
        console.error(
          `   ❌ Error updating channel ${channel.channelName}:`,
          error,
        );
        console.log(`   ⏭️  Continuing with next channel...`);
      }

      // Pause entre les chaînes pour éviter de dépasser les limites API
      if (channels.indexOf(channel) < channels.length - 1) {
        console.log(`   ⏳ Waiting 2 seconds before next channel...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("\n🎉 All channels update completed!");

    // Afficher le résumé final
    const finalChannels = await youtubeService.getChannels();
    console.log("\n📊 Final summary:");
    finalChannels.forEach((channel, index) => {
      console.log(`   ${index + 1}. ${channel.channelName}:`);
      console.log(`      - Videos: ${channel.videoCount}`);
      console.log(`      - Complete: ${channel.isComplete ? "✅" : "❌"}`);
    });
  } catch (error) {
    console.error("❌ Error in updateAllChannels:", error);
    throw error;
  }
}

if (require.main === module) {
  updateAllChannels()
    .then(() => {
      console.log("🎉 All channels update process completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Failed to update all channels:", error);
      process.exit(1);
    });
}

export { updateAllChannels };
