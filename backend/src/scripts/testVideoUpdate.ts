import { YoutubeService } from "../service/YoutubeService";

async function testVideoUpdate() {
  console.log("🔄 Testing video update process...");

  try {
    const youtubeService = new YoutubeService();
    const channelId = "UCz0D_xJRQamxRlTrec5j4oA"; // Lelariva

    console.log(`\n📊 Before update:`);
    let channels = await youtubeService.getChannels();
    let channelInfo = channels.find((c) => c.channelId === channelId);

    if (channelInfo) {
      console.log(`   - Videos: ${channelInfo.videoCount}`);
      console.log(`   - Is complete: ${channelInfo.isComplete}`);
    }

    console.log(`\n🔄 Running video update...`);
    const videos = await youtubeService.fetchAndStoreVideos(channelId);

    console.log(`\n📊 After update:`);
    channels = await youtubeService.getChannels();
    channelInfo = channels.find((c) => c.channelId === channelId);

    if (channelInfo) {
      console.log(`   - Videos: ${channelInfo.videoCount}`);
      console.log(`   - Is complete: ${channelInfo.isComplete}`);
      console.log(`   - Total videos returned: ${videos.length}`);
    }

    console.log(`\n🔍 Checking metadata...`);
    const needsMoreUpdates = await youtubeService.checkForNewVideos(channelId);
    console.log(`   - Needs more updates: ${needsMoreUpdates ? "YES" : "NO"}`);

    console.log("\n🎉 Update test completed!");
  } catch (error) {
    console.error("❌ Update test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testVideoUpdate()
    .then(() => {
      console.log("✨ Video update test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Update test failed:", error);
      process.exit(1);
    });
}

export { testVideoUpdate };
