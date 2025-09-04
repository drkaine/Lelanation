import { YoutubeService } from "../service/YoutubeService";

async function showChannelsStatus() {
  console.log("📊 YouTube Channels Status Report");
  console.log("=".repeat(50));

  try {
    console.log("🔧 Initializing YouTube service...");
    const youtubeService = new YoutubeService();

    // Récupérer toutes les chaînes
    console.log("📋 Loading channels...");
    const channels = await youtubeService.getChannels();
    console.log(`✅ Loaded ${channels.length} channels`);

    if (channels.length === 0) {
      console.log("❌ No channels found in the system");
      return;
    }

    console.log(`\n📋 Found ${channels.length} channels in the system:\n`);

    let totalVideosInStorage = 0;
    let completeChannels = 0;
    let incompleteChannels = 0;

    for (const channel of channels) {
      console.log(`🎬 ${channel.channelName}`);
      console.log(`   📍 Channel ID: ${channel.channelId}`);
      console.log(
        `   📊 Videos in storage: ${channel.videoCount.toLocaleString()}`,
      );
      console.log(`   ✅ Is complete: ${channel.isComplete ? "YES" : "NO"}`);
      console.log(
        `   📅 Last update: ${new Date(channel.lastUpdate).toLocaleString()}`,
      );
      console.log(`   🎥 Last video date: ${channel.lastVideoDate}`);

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
        const completionRate = Math.round(
          (channel.videoCount / stats.videoCount) * 100,
        );

        console.log(`   📊 Status:`);
        console.log(
          `      - Missing videos: ${missingVideos.toLocaleString()}`,
        );
        console.log(`      - Completion rate: ${completionRate}%`);

        if (missingVideos > 0) {
          console.log(`      - Status: ⚠️  INCOMPLETE`);
          incompleteChannels++;
        } else {
          console.log(`      - Status: ✅ COMPLETE`);
          completeChannels++;
        }

        totalVideosInStorage += channel.videoCount;
      } catch (error) {
        console.log(`   ❌ Error fetching YouTube stats: ${error}`);
        incompleteChannels++;
      }

      console.log(""); // Ligne vide pour séparer les chaînes
    }

    // Résumé global
    console.log("=".repeat(50));
    console.log("📊 GLOBAL SUMMARY");
    console.log("=".repeat(50));
    console.log(`📺 Total channels: ${channels.length}`);
    console.log(`✅ Complete channels: ${completeChannels}`);
    console.log(`⚠️  Incomplete channels: ${incompleteChannels}`);
    console.log(
      `🎥 Total videos in storage: ${totalVideosInStorage.toLocaleString()}`,
    );
    console.log(
      `📈 Completion rate: ${Math.round((completeChannels / channels.length) * 100)}%`,
    );

    // Recommandations
    console.log("\n💡 RECOMMENDATIONS:");
    if (incompleteChannels > 0) {
      console.log(
        `   🔄 Run 'npm run youtube:force-complete-all' to complete all channels`,
      );
    } else {
      console.log(
        `   ✅ All channels are complete! Run 'npm run youtube:update-all' for regular updates`,
      );
    }
  } catch (error) {
    console.error("❌ Error in showChannelsStatus:", error);
    throw error;
  }
}

if (require.main === module) {
  showChannelsStatus()
    .then(() => {
      console.log("\n🎉 Status report completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Failed to show channels status:", error);
      process.exit(1);
    });
}

export { showChannelsStatus };
