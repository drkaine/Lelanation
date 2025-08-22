import { YoutubeService } from "../service/YoutubeService";

async function testAdminInterface() {
  console.log("🎛️ Testing Admin Interface Logic...");

  try {
    const youtubeService = new YoutubeService();

    console.log("\n📊 1. Loading Channels");
    const channels = await youtubeService.getChannels();
    console.log(`   - Found ${channels.length} channels`);

    for (const channel of channels) {
      console.log(`\n📺 ${channel.channelName}:`);
      console.log(`   - ID: ${channel.channelId}`);
      console.log(`   - Videos: ${channel.videoCount}`);
      console.log(
        `   - Is complete: ${channel.isComplete ? "✅ YES" : "❌ NO"}`,
      );
      console.log(
        `   - Last update: ${new Date(channel.lastUpdate).toLocaleString()}`,
      );

      const stats = await youtubeService.getChannelStatistics(
        channel.channelId,
      );
      const videos = await youtubeService.getVideosByChannel(channel.channelId);
      const completionRate = Math.round(
        (videos.length / stats.videoCount) * 100,
      );

      console.log(`   📈 YouTube Stats:`);
      console.log(`      - Total videos: ${stats.videoCount}`);
      console.log(`      - Videos retrieved: ${videos.length}`);
      console.log(`      - Completion: ${completionRate}%`);
      console.log(
        `      - Subscribers: ${stats.subscriberCount.toLocaleString()}`,
      );
      console.log(`      - Views: ${stats.viewCount.toLocaleString()}`);

      if (!channel.isComplete) {
        console.log(`   🔧 Admin Action: Channel needs completion`);
        console.log(
          `      - Missing: ${stats.videoCount - videos.length} videos`,
        );
        console.log(`      - Action: Show "Complete" button`);
      } else {
        console.log(`   ✅ Admin Action: Channel is complete`);
        console.log(`      - Action: Show "Refresh" button only`);
      }

      const needsUpdate = await youtubeService.checkForNewVideos(
        channel.channelId,
      );
      console.log(
        `   🔍 Check for updates: ${needsUpdate ? "🔄 NEEDS UPDATE" : "✅ UP TO DATE"}`,
      );
    }

    console.log("\n🎯 2. Admin Interface Summary");
    const incompleteChannels = channels.filter((c) => !c.isComplete);
    const completeChannels = channels.filter((c) => c.isComplete);

    console.log(`   - Total channels: ${channels.length}`);
    console.log(`   - Complete channels: ${completeChannels.length}`);
    console.log(`   - Incomplete channels: ${incompleteChannels.length}`);

    if (incompleteChannels.length > 0) {
      console.log(`\n⚠️ Channels needing completion:`);
      for (const channel of incompleteChannels) {
        const stats = await youtubeService.getChannelStatistics(
          channel.channelId,
        );
        const videos = await youtubeService.getVideosByChannel(
          channel.channelId,
        );
        const missing = stats.videoCount - videos.length;
        console.log(`   - ${channel.channelName}: ${missing} videos missing`);
      }
    }

    console.log("\n✅ Admin interface test completed!");
  } catch (error) {
    console.error("❌ Admin interface test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testAdminInterface()
    .then(() => {
      console.log("✨ Admin interface test finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Admin interface test failed:", error);
      process.exit(1);
    });
}

export { testAdminInterface };
