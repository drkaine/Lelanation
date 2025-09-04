import { YoutubeService } from "../service/YoutubeService";

async function forceCompleteAllChannels() {
  console.log("🎬 Starting force completion for all YouTube channels...");

  try {
    const youtubeService = new YoutubeService();

    // Récupérer toutes les chaînes
    const channels = await youtubeService.getChannels();

    if (channels.length === 0) {
      console.log("❌ No channels found in the system");
      return;
    }

    console.log(`📊 Found ${channels.length} channels to complete:`);
    channels.forEach((channel, index) => {
      console.log(
        `   ${index + 1}. ${channel.channelName} (${channel.channelId})`,
      );
      console.log(`      - Current videos: ${channel.videoCount}`);
      console.log(
        `      - Is complete: ${channel.isComplete ? "✅ YES" : "❌ NO"}`,
      );
    });

    console.log("\n🔄 Starting force completion process...\n");

    for (const channel of channels) {
      console.log(`\n🎯 Force completing channel: ${channel.channelName}`);
      console.log(`   📍 Channel ID: ${channel.channelId}`);
      console.log(`   📊 Current videos: ${channel.videoCount}`);

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
          console.log(`   🔄 Forcing completion...`);

          // Forcer la complétion de la chaîne
          await youtubeService.forceCompleteChannel(channel.channelId);
          console.log(`   ✅ Completion process finished`);
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

          const finalMissing = stats.videoCount - updatedChannel.videoCount;
          if (finalMissing > 0) {
            console.log(
              `   ⚠️  Still missing: ${finalMissing.toLocaleString()} videos`,
            );
          } else {
            console.log(`   🎉 All videos retrieved!`);
          }
        }
      } catch (error) {
        console.error(
          `   ❌ Error completing channel ${channel.channelName}:`,
          error,
        );
        console.log(`   ⏭️  Continuing with next channel...`);
      }

      // Pause entre les chaînes pour éviter de dépasser les limites API
      if (channels.indexOf(channel) < channels.length - 1) {
        console.log(`   ⏳ Waiting 3 seconds before next channel...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    console.log("\n🎉 All channels force completion completed!");

    // Afficher le résumé final
    const finalChannels = await youtubeService.getChannels();
    console.log("\n📊 Final summary:");
    finalChannels.forEach((channel, index) => {
      console.log(`   ${index + 1}. ${channel.channelName}:`);
      console.log(`      - Videos: ${channel.videoCount}`);
      console.log(`      - Complete: ${channel.isComplete ? "✅" : "❌"}`);
    });
  } catch (error) {
    console.error("❌ Error in forceCompleteAllChannels:", error);
    throw error;
  }
}

if (require.main === module) {
  forceCompleteAllChannels()
    .then(() => {
      console.log(
        "🎉 All channels force completion process completed successfully",
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Failed to force complete all channels:", error);
      process.exit(1);
    });
}

export { forceCompleteAllChannels };
