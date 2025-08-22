import { YoutubeService } from "../service/YoutubeService";

async function fixVideoCounts() {
  console.log("🔧 Fixing video counts per channel...");

  try {
    const youtubeService = new YoutubeService();
    const storage = await youtubeService["loadStorage"]();

    console.log(`📊 Current state:`);
    console.log(`   - Total videos in storage: ${storage.videos.length}`);
    console.log(`   - Number of channels: ${storage.channels.length}`);

    for (const channel of storage.channels) {
      const videosForChannel = storage.videos.filter(
        (v) => v.snippet.channelId === channel.channelId,
      );
      const oldCount = channel.videoCount;
      channel.videoCount = videosForChannel.length;

      console.log(`\n📺 ${channel.channelName}:`);
      console.log(`   - Old count: ${oldCount}`);
      console.log(`   - New count: ${channel.videoCount}`);
      console.log(`   - Videos found: ${videosForChannel.length}`);

      const totalVideosKnown =
        storage.metadata.totalVideosKnown[channel.channelId] || 0;
      const isComplete = channel.videoCount >= totalVideosKnown;
      channel.isComplete = isComplete;

      console.log(`   - Total videos known: ${totalVideosKnown}`);
      console.log(`   - Is complete: ${isComplete ? "✅ YES" : "❌ NO"}`);

      storage.metadata.hasAllOldVideos[channel.channelId] = isComplete;
    }

    await youtubeService["saveStorage"](storage);

    console.log(`\n✅ Video counts fixed successfully!`);
    console.log(`📋 Summary:`);
    for (const channel of storage.channels) {
      const totalVideosKnown =
        storage.metadata.totalVideosKnown[channel.channelId] || 0;
      const completionRate = Math.round(
        (channel.videoCount / totalVideosKnown) * 100,
      );
      console.log(
        `   - ${channel.channelName}: ${channel.videoCount}/${totalVideosKnown} (${completionRate}%)`,
      );
    }
  } catch (error) {
    console.error("❌ Error fixing video counts:", error);
    throw error;
  }
}

if (require.main === module) {
  fixVideoCounts()
    .then(() => {
      console.log("🎉 Video counts fix completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Video counts fix failed:", error);
      process.exit(1);
    });
}

export { fixVideoCounts };
