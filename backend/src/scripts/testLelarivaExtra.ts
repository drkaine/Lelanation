import { YoutubeService } from "../service/YoutubeService";

async function testLelarivaExtra() {
  console.log("🎬 Testing LelarivaExtra channel...");
  
  try {
    const youtubeService = new YoutubeService();
    const channelId = "UCi3h-WjIyUr5QiA0-AdVIGA"; // LelarivaExtra
    
    console.log(`\n📊 1. Channel Analysis`);
    const channels = await youtubeService.getChannels();
    const channelInfo = channels.find(c => c.channelId === channelId);
    
    if (channelInfo) {
      console.log(`   - Name: ${channelInfo.channelName}`);
      console.log(`   - Videos in storage: ${channelInfo.videoCount}`);
      console.log(`   - Is complete: ${channelInfo.isComplete}`);
    }
    
    console.log(`\n🔍 2. Intelligent Check`);
    const needsUpdate = await youtubeService.checkForNewVideos(channelId);
    console.log(`   - Needs update: ${needsUpdate ? "YES" : "NO"}`);
    
    console.log(`\n📈 3. YouTube Statistics`);
    const stats = await youtubeService.getChannelStatistics(channelId);
    console.log(`   - Total videos on YouTube: ${stats.videoCount}`);
    console.log(`   - Subscribers: ${stats.subscriberCount.toLocaleString()}`);
    console.log(`   - Views: ${stats.viewCount.toLocaleString()}`);
    
    console.log(`\n🎥 4. Videos by Channel`);
    const videos = await youtubeService.getVideosByChannel(channelId);
    console.log(`   - Videos from this channel: ${videos.length}`);
    
    if (videos.length > 0) {
      console.log(`   - Latest video: ${videos[0].snippet.title}`);
      console.log(`   - Published: ${videos[0].snippet.publishedAt}`);
    }
    
    console.log(`\n📊 5. Completion Analysis`);
    if (channelInfo && stats) {
      const completionRate = Math.round((videos.length / stats.videoCount) * 100);
      console.log(`   - Videos retrieved: ${videos.length}/${stats.videoCount} (${completionRate}%)`);
      console.log(`   - Is complete: ${channelInfo.isComplete ? "✅ YES" : "❌ NO"}`);
    }
    
    console.log("\n🎉 LelarivaExtra test completed!");
    
  } catch (error) {
    console.error("❌ LelarivaExtra test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testLelarivaExtra()
    .then(() => {
      console.log("✨ LelarivaExtra test finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 LelarivaExtra test failed:", error);
      process.exit(1);
    });
}

export { testLelarivaExtra };
