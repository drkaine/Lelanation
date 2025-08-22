import { YoutubeService } from "../service/YoutubeService";
import fs from "fs/promises";
import path from "path";
import type { ChannelInfo, Video } from "../types";

interface OldYoutubeData {
  videos: Video[];
  lastVideoDate: string;
  channelId: string;
  lastUpdate: number;
}

interface NewYoutubeData {
  videos: Video[];
  channels: ChannelInfo[];
  lastUpdate: number;
  metadata: {
    totalVideosKnown: Record<string, number>;
    hasAllOldVideos: Record<string, boolean>;
    lastStatsUpdate: Record<string, number>;
  };
}

async function transformYoutubeStructure() {
  console.log("🔄 Transforming YouTube data structure...");

  try {
    const youtubeService = new YoutubeService();
    const storagePath = path.join(
      __dirname,
      "../../../frontend/src/assets/files/data/youtube.json",
    );

    console.log("📖 Reading existing data...");
    const data = await fs.readFile(storagePath, "utf-8");
    const oldData: OldYoutubeData = JSON.parse(data);

    console.log(
      `📊 Found ${oldData.videos.length} videos for channel ${oldData.channelId}`,
    );

    console.log("🔍 Fetching channel statistics...");
    let stats;
    try {
      stats = await youtubeService.getChannelStatistics(oldData.channelId);
      console.log(
        `📈 Channel stats: ${stats.videoCount} total videos, ${stats.subscriberCount} subscribers`,
      );
    } catch {
      console.warn("⚠️ Could not fetch channel stats, using defaults");
      stats = {
        name: "Lelariva",
        videoCount: 504,
        subscriberCount: 27300,
        viewCount: 7918513,
      };
    }

    const hasAllOldVideos =
      oldData.videos.length >= stats.videoCount || oldData.videos.length >= 500;

    console.log(`🎯 Analysis:`);
    console.log(`   - Videos in storage: ${oldData.videos.length}`);
    console.log(`   - Total videos on YouTube: ${stats.videoCount}`);
    console.log(`   - Has all old videos: ${hasAllOldVideos}`);

    const newData: NewYoutubeData = {
      videos: oldData.videos,
      channels: [
        {
          channelId: oldData.channelId,
          channelName: stats.name,
          isComplete: hasAllOldVideos,
          lastVideoDate: oldData.lastVideoDate,
          lastUpdate: oldData.lastUpdate,
          videoCount: oldData.videos.length,
        },
      ],
      lastUpdate: oldData.lastUpdate,
      metadata: {
        totalVideosKnown: {
          [oldData.channelId]: stats.videoCount,
        },
        hasAllOldVideos: {
          [oldData.channelId]: hasAllOldVideos,
        },
        lastStatsUpdate: {
          [oldData.channelId]: Date.now(),
        },
      },
    };

    const backupPath = storagePath + `.backup.${Date.now()}`;
    await fs.copyFile(storagePath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);

    await fs.writeFile(storagePath, JSON.stringify(newData, null, 2));

    console.log("✅ Transformation completed successfully!");
    console.log(`📋 New structure:`);
    console.log(`   - Videos: ${newData.videos.length}`);
    console.log(`   - Channels: ${newData.channels.length}`);
    console.log(
      `   - Channel "${newData.channels[0].channelName}" is ${newData.channels[0].isComplete ? "complete" : "incomplete"}`,
    );
    console.log(
      `   - Total videos known: ${newData.metadata.totalVideosKnown[oldData.channelId]}`,
    );
    console.log(
      `   - Has all old videos: ${newData.metadata.hasAllOldVideos[oldData.channelId]}`,
    );
  } catch (error) {
    console.error("❌ Error during transformation:", error);
    throw error;
  }
}

if (require.main === module) {
  transformYoutubeStructure()
    .then(() => {
      console.log("🎉 Transformation script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Transformation script failed:", error);
      process.exit(1);
    });
}

export { transformYoutubeStructure };
