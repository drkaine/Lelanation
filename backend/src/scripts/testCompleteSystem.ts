import { YoutubeService } from "../service/YoutubeService";

async function testCompleteSystem() {
  console.log("🧪 Testing complete YouTube system...");

  try {
    const youtubeService = new YoutubeService();
    const channelId = "UCz0D_xJRQamxRlTrec5j4oA"; // Lelariva

    console.log(`\n📊 1. Initial Analysis`);
    const initialChannels = await youtubeService.getChannels();
    const initialChannel = initialChannels.find(
      (c) => c.channelId === channelId,
    );

    if (initialChannel) {
      const stats = await youtubeService.getChannelStatistics(channelId);
      console.log(`   - Channel: ${initialChannel.channelName}`);
      console.log(`   - Videos in storage: ${initialChannel.videoCount}`);
      console.log(`   - Total on YouTube: ${stats.videoCount}`);
      console.log(
        `   - Missing: ${Math.max(0, stats.videoCount - initialChannel.videoCount)}`,
      );
      console.log(`   - Is complete: ${initialChannel.isComplete}`);
    }

    console.log(`\n🔍 2. Intelligent Check`);
    const needsUpdate = await youtubeService.checkForNewVideos(channelId);
    console.log(`   - Needs update: ${needsUpdate ? "YES" : "NO"}`);

    if (needsUpdate) {
      console.log(`\n🔄 3. Regular Update`);
      const videos = await youtubeService.fetchAndStoreVideos(channelId);
      console.log(`   - Total videos after update: ${videos.length}`);

      const updatedChannels = await youtubeService.getChannels();
      const updatedChannel = updatedChannels.find(
        (c) => c.channelId === channelId,
      );

      if (updatedChannel) {
        const stats = await youtubeService.getChannelStatistics(channelId);
        const stillMissing = Math.max(
          0,
          stats.videoCount - updatedChannel.videoCount,
        );

        console.log(
          `   - Videos now: ${updatedChannel.videoCount}/${stats.videoCount}`,
        );
        console.log(`   - Still missing: ${stillMissing}`);
        console.log(`   - Is complete: ${updatedChannel.isComplete}`);

        if (stillMissing > 0 && stillMissing <= 20) {
          console.log(
            `\n🚀 4. Force Completion (${stillMissing} videos missing)`,
          );
          const forceResult =
            await youtubeService.forceCompleteChannel(channelId);

          console.log(`   - Videos added: ${forceResult.videosAdded}`);
          console.log(`   - Final total: ${forceResult.totalVideos}`);
          console.log(`   - Success: ${forceResult.success}`);
        }
      }
    } else {
      console.log(`   ✅ Channel is up to date!`);
    }

    console.log(`\n📈 5. Final Status`);
    const finalChannels = await youtubeService.getChannels();
    const finalChannel = finalChannels.find((c) => c.channelId === channelId);

    if (finalChannel) {
      const stats = await youtubeService.getChannelStatistics(channelId);
      const completionRate = Math.round(
        (finalChannel.videoCount / stats.videoCount) * 100,
      );

      console.log(
        `   - Final videos: ${finalChannel.videoCount}/${stats.videoCount} (${completionRate}%)`,
      );
      console.log(
        `   - Is complete: ${finalChannel.isComplete ? "✅ YES" : "❌ NO"}`,
      );
      console.log(
        `   - Status: ${completionRate >= 100 ? "🎯 PERFECT" : completionRate >= 99 ? "🟢 EXCELLENT" : completionRate >= 95 ? "🟡 GOOD" : "🔴 NEEDS WORK"}`,
      );
    }

    console.log("\n🎉 Complete system test finished!");
  } catch (error) {
    console.error("❌ Complete system test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testCompleteSystem()
    .then(() => {
      console.log("✨ Complete system test finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Complete system test failed:", error);
      process.exit(1);
    });
}

export { testCompleteSystem };
