import { YoutubeService } from "../service/YoutubeService";

async function addLelarivaExtra() {
  console.log("🎬 Adding LelarivaExtra channel...");
  
  try {
    const youtubeService = new YoutubeService();
    
    const username = "LelarivaExtra";
    
    console.log(`🔍 Looking up channel ID for: ${username}`);
    
    const channelId = await youtubeService.getChannelId(username);
    console.log(`✅ Found channel ID: ${channelId}`);
    
    console.log(`📊 Getting channel statistics...`);
    const stats = await youtubeService.getChannelStatistics(channelId);
    
    console.log(`📈 Channel Statistics:`);
    console.log(`   - Name: ${stats.name}`);
    console.log(`   - Total Videos: ${stats.videoCount.toLocaleString()}`);
    console.log(`   - Subscribers: ${stats.subscriberCount.toLocaleString()}`);
    console.log(`   - Total Views: ${stats.viewCount.toLocaleString()}`);
    
    console.log(`\n➕ Adding channel to system...`);
    await youtubeService.addChannel(channelId);
    
    console.log(`\n🎥 Fetching videos from channel...`);
    const videos = await youtubeService.fetchAndStoreVideos(channelId);
    
    console.log(`\n✅ LelarivaExtra channel added successfully!`);
    console.log(`📊 Final status:`);
    console.log(`   - Channel ID: ${channelId}`);
    console.log(`   - Videos fetched: ${videos.length}`);
    console.log(`   - Total videos on YouTube: ${stats.videoCount}`);
    console.log(`   - Completion rate: ${Math.round((videos.length / stats.videoCount) * 100)}%`);
    
    const channels = await youtubeService.getChannels();
    const channelInfo = channels.find(c => c.channelId === channelId);
    
    if (channelInfo) {
      console.log(`   - Is complete: ${channelInfo.isComplete ? "✅ YES" : "❌ NO"}`);
      console.log(`   - Last video date: ${channelInfo.lastVideoDate}`);
    }
    
  } catch (error) {
    console.error("❌ Error adding LelarivaExtra channel:", error);
    throw error;
  }
}

if (require.main === module) {
  addLelarivaExtra()
    .then(() => {
      console.log("🎉 LelarivaExtra channel addition completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Failed to add LelarivaExtra channel:", error);
      process.exit(1);
    });
}

export { addLelarivaExtra };
