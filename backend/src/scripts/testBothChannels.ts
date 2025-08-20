import { YoutubeService } from "../service/YoutubeService";

async function testBothChannels() {
  console.log("🎬 Testing both YouTube channels...");
  
  try {
    const youtubeService = new YoutubeService();
    
    console.log(`\n📊 1. Overall System Status`);
    const channels = await youtubeService.getChannels();
    const storage = await youtubeService['loadStorage']();
    
    console.log(`   - Total videos in storage: ${storage.videos.length}`);
    console.log(`   - Number of channels: ${channels.length}`);
    
    console.log(`\n📺 2. Channel Details`);
    for (const channel of channels) {
      const videos = await youtubeService.getVideosByChannel(channel.channelId);
      const stats = await youtubeService.getChannelStatistics(channel.channelId);
      const completionRate = Math.round((videos.length / stats.videoCount) * 100);
      
      console.log(`\n   🎬 ${channel.channelName}:`);
      console.log(`      - Channel ID: ${channel.channelId}`);
      console.log(`      - Videos: ${videos.length}/${stats.videoCount} (${completionRate}%)`);
      console.log(`      - Subscribers: ${stats.subscriberCount.toLocaleString()}`);
      console.log(`      - Views: ${stats.viewCount.toLocaleString()}`);
      console.log(`      - Is complete: ${channel.isComplete ? "✅ YES" : "❌ NO"}`);
      console.log(`      - Last video: ${channel.lastVideoDate}`);
      
      if (videos.length > 0) {
        console.log(`      - Latest video: ${videos[0].snippet.title}`);
      }
    }
    
    console.log(`\n🔍 3. Intelligent Check Results`);
    for (const channel of channels) {
      const needsUpdate = await youtubeService.checkForNewVideos(channel.channelId);
      console.log(`   - ${channel.channelName}: ${needsUpdate ? "🔄 NEEDS UPDATE" : "✅ UP TO DATE"}`);
    }
    
    console.log(`\n📈 4. System Summary`);
    const totalVideos = storage.videos.length;
    const totalVideosOnYouTube = channels.reduce((sum, channel) => {
      const stats = storage.metadata.totalVideosKnown[channel.channelId] || 0;
      return sum + stats;
    }, 0);
    const overallCompletion = Math.round((totalVideos / totalVideosOnYouTube) * 100);
    
    console.log(`   - Total videos managed: ${totalVideos}`);
    console.log(`   - Total videos on YouTube: ${totalVideosOnYouTube}`);
    console.log(`   - Overall completion: ${overallCompletion}%`);
    console.log(`   - All channels complete: ${channels.every(c => c.isComplete) ? "✅ YES" : "❌ NO"}`);
    
    console.log(`\n🎯 5. Metadata Status`);
    console.log(`   - Total videos known:`, storage.metadata.totalVideosKnown);
    console.log(`   - Has all old videos:`, storage.metadata.hasAllOldVideos);
    
    console.log("\n🎉 Both channels test completed!");
    
  } catch (error) {
    console.error("❌ Both channels test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testBothChannels()
    .then(() => {
      console.log("✨ Both channels test finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Both channels test failed:", error);
      process.exit(1);
    });
}

export { testBothChannels };
