import { YoutubeService } from "../service/YoutubeService";

async function fixChannelCompleteness() {
  console.log("🔧 Fixing channel completeness status...");

  try {
    const youtubeService = new YoutubeService();
    const storage = await youtubeService["loadStorage"]();

    console.log("📊 Current state:");
    console.log(`   - Total videos in storage: ${storage.videos.length}`);
    console.log(`   - Number of channels: ${storage.channels.length}`);

    let hasChanges = false;

    for (const channel of storage.channels) {
      console.log(`\n📺 ${channel.channelName}:`);
      console.log(`   - Channel ID: ${channel.channelId}`);
      console.log(`   - Current video count: ${channel.videoCount}`);
      console.log(`   - Current isComplete: ${channel.isComplete}`);

      const videosForThisChannel = storage.videos.filter(
        (v) => v.snippet.channelId === channel.channelId,
      );
      const realVideoCount = videosForThisChannel.length;

      console.log(`   - Real video count: ${realVideoCount}`);

      const stats = await youtubeService.getChannelStatistics(
        channel.channelId,
      );
      console.log(`   - Total videos on YouTube: ${stats.videoCount}`);

      const shouldBeComplete = realVideoCount >= stats.videoCount;
      const completionRate = Math.round(
        (realVideoCount / stats.videoCount) * 100,
      );

      console.log(`   - Completion rate: ${completionRate}%`);
      console.log(`   - Should be complete: ${shouldBeComplete}`);

      if (channel.videoCount !== realVideoCount) {
        console.log(
          `   🔧 Fixing video count: ${channel.videoCount} → ${realVideoCount}`,
        );
        channel.videoCount = realVideoCount;
        hasChanges = true;
      }

      if (channel.isComplete !== shouldBeComplete) {
        console.log(
          `   🔧 Fixing completeness: ${channel.isComplete} → ${shouldBeComplete}`,
        );
        channel.isComplete = shouldBeComplete;
        storage.metadata.hasAllOldVideos[channel.channelId] = shouldBeComplete;
        hasChanges = true;
      }

      storage.metadata.totalVideosKnown[channel.channelId] = stats.videoCount;
      storage.metadata.lastStatsUpdate[channel.channelId] = Date.now();

      console.log(
        `   - Final status: ${channel.isComplete ? "✅ COMPLETE" : "❌ INCOMPLETE"}`,
      );
    }

    if (hasChanges) {
      console.log("\n💾 Saving corrected data...");
      await youtubeService["saveStorage"](storage);
      console.log("✅ Channel completeness fixed successfully!");
    } else {
      console.log("\n✅ No corrections needed!");
    }

    console.log("\n📋 Final Summary:");
    for (const channel of storage.channels) {
      const videosForThisChannel = storage.videos.filter(
        (v) => v.snippet.channelId === channel.channelId,
      );
      const stats = storage.metadata.totalVideosKnown[channel.channelId] || 0;
      const completionRate = Math.round(
        (videosForThisChannel.length / stats) * 100,
      );

      console.log(
        `   - ${channel.channelName}: ${videosForThisChannel.length}/${stats} (${completionRate}%) - ${channel.isComplete ? "✅" : "❌"}`,
      );
    }
  } catch (error) {
    console.error("❌ Error fixing channel completeness:", error);
    throw error;
  }
}

if (require.main === module) {
  fixChannelCompleteness()
    .then(() => {
      console.log("🎉 Channel completeness fix completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Channel completeness fix failed:", error);
      process.exit(1);
    });
}

export { fixChannelCompleteness };
