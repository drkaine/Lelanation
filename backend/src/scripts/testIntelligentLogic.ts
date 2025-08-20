import { YoutubeService } from "../service/YoutubeService";

async function testIntelligentLogic() {
  console.log("🧠 Testing intelligent YouTube logic...");

  try {
    const youtubeService = new YoutubeService();
    const channelId = "UCz0D_xJRQamxRlTrec5j4oA"; // Lelariva

    console.log(`\n1. Testing channel analysis for: ${channelId}`);

    const needsCheck = await youtubeService.checkForNewVideos(channelId);
    console.log(
      `\n🔍 Check result: ${needsCheck ? "NEEDS UPDATE" : "UP TO DATE"}`,
    );

    console.log(`\n2. Getting current channel info...`);
    const channels = await youtubeService.getChannels();
    const channelInfo = channels.find((c) => c.channelId === channelId);

    if (channelInfo) {
      console.log(`📊 Current channel status:`);
      console.log(`   - Name: ${channelInfo.channelName}`);
      console.log(`   - Videos: ${channelInfo.videoCount}`);
      console.log(`   - Is complete: ${channelInfo.isComplete}`);
      console.log(`   - Last video: ${channelInfo.lastVideoDate}`);
    }

    console.log(`\n3. Getting channel statistics from YouTube API...`);
    const stats = await youtubeService.getChannelStatistics(channelId);
    console.log(`📈 YouTube stats:`);
    console.log(`   - Total videos: ${stats.videoCount}`);
    console.log(`   - Subscribers: ${stats.subscriberCount.toLocaleString()}`);
    console.log(`   - Views: ${stats.viewCount.toLocaleString()}`);

    if (channelInfo) {
      const missing = Math.max(0, stats.videoCount - channelInfo.videoCount);
      console.log(`\n📊 Analysis:`);
      console.log(`   - Videos missing: ${missing}`);
      console.log(
        `   - Completion rate: ${Math.round((channelInfo.videoCount / stats.videoCount) * 100)}%`,
      );

      if (missing === 0) {
        console.log(`   ✅ Channel is COMPLETE!`);
      } else if (missing <= 10) {
        console.log(
          `   🟡 Channel is ALMOST complete (${missing} videos missing)`,
        );
      } else {
        console.log(
          `   🔴 Channel needs significant updates (${missing} videos missing)`,
        );
      }
    }

    console.log("\n🎉 Test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testIntelligentLogic()
    .then(() => {
      console.log("✨ Intelligent logic test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test script failed:", error);
      process.exit(1);
    });
}

export { testIntelligentLogic };
