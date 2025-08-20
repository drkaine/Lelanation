import { YoutubeService } from "../service/YoutubeService";

async function testChannelStats() {
  console.log("Testing YouTube channel statistics...");

  try {
    const youtubeService = new YoutubeService();

    const channelId = "UCz0D_xJRQamxRlTrec5j4oA";

    console.log(`\n1. Testing getChannelStatistics for channel: ${channelId}`);
    const stats = await youtubeService.getChannelStatistics(channelId);

    console.log("Channel Statistics:");
    console.log(`- Name: ${stats.name}`);
    console.log(`- Total Videos: ${stats.videoCount.toLocaleString()}`);
    console.log(`- Subscribers: ${stats.subscriberCount.toLocaleString()}`);
    console.log(`- Total Views: ${stats.viewCount.toLocaleString()}`);

    console.log(`\n2. Testing channel completeness check...`);
    try {
      const channels = await youtubeService.getChannels();
      console.log(`Channels in storage: ${channels?.length || 0}`);

      if (channels && channels.length > 0) {
        const channelInfo = channels.find((c) => c.channelId === channelId);

        if (channelInfo) {
          console.log(`Current videos in storage: ${channelInfo.videoCount}`);
          console.log(`Channel marked as complete: ${channelInfo.isComplete}`);

          const videos = await youtubeService.getVideosByChannel(channelId);
          console.log(`Actual videos count: ${videos.length}`);

          console.log(`\n3. Completeness analysis:`);
          console.log(`- Videos in storage: ${channelInfo.videoCount}`);
          console.log(`- Videos from API: ${videos.length}`);
          console.log(`- Total videos on YouTube: ${stats.videoCount}`);
          console.log(
            `- Is complete: ${channelInfo.videoCount >= stats.videoCount || channelInfo.videoCount >= 5000}`,
          );
        } else {
          console.log("Channel not found in storage");
        }
      } else {
        console.log("No channels in storage");
      }
    } catch (error) {
      console.error("Error getting channels:", error);
    }

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testChannelStats()
    .then(() => {
      console.log("Test script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Test script failed:", error);
      process.exit(1);
    });
}

export { testChannelStats };
