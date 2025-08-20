import { YoutubeService } from "../service/YoutubeService";
import fs from "fs/promises";
import path from "path";
import type { ChannelInfo } from "../types";

async function migrateYoutubeData() {
  console.log("Starting YouTube data migration...");

  try {
    const youtubeService = new YoutubeService();
    const storagePath = path.join(
      __dirname,
      "../../../frontend/src/assets/files/data/youtube.json",
    );

    let existingData;
    try {
      const data = await fs.readFile(storagePath, "utf-8");
      existingData = JSON.parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.log("No existing data found, creating new structure");
      existingData = {
        videos: [],
        lastVideoDate: "",
        channelId: "",
        lastUpdate: 0,
      };
    }

    if (existingData.channels) {
      console.log("Migration already completed, skipping...");
      return;
    }

    console.log("Migrating existing data...");

    const newData = {
      videos: existingData.videos || [],
      channels: [] as ChannelInfo[],
      lastUpdate: existingData.lastUpdate || Date.now(),
    };

    if (existingData.channelId && existingData.lastVideoDate) {
      try {
        const channelName = await youtubeService.getChannelName(
          existingData.channelId,
        );

        const channelInfo: ChannelInfo = {
          channelId: existingData.channelId,
          channelName: channelName,
          isComplete: false,
          lastVideoDate: existingData.lastVideoDate,
          lastUpdate: existingData.lastUpdate || Date.now(),
          videoCount: existingData.videos?.length || 0,
        };

        newData.channels.push(channelInfo);

        console.log(
          `Migrated channel: ${channelName} (${existingData.channelId})`,
        );
        console.log(`- Videos: ${channelInfo.videoCount}`);
        console.log(`- Last video date: ${channelInfo.lastVideoDate}`);
      } catch (error) {
        console.error("Error getting channel name:", error);

        const channelInfo: ChannelInfo = {
          channelId: existingData.channelId,
          channelName: existingData.channelId,
          isComplete: false,
          lastVideoDate: existingData.lastVideoDate,
          lastUpdate: existingData.lastUpdate || Date.now(),
          videoCount: existingData.videos?.length || 0,
        };

        newData.channels.push(channelInfo);
        console.log(
          `Migrated channel with fallback name: ${existingData.channelId}`,
        );
      }
    }

    await fs.writeFile(storagePath, JSON.stringify(newData, null, 2));

    console.log("Migration completed successfully!");
    console.log(`- Total videos: ${newData.videos.length}`);
    console.log(`- Total channels: ${newData.channels.length}`);
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
}

if (require.main === module) {
  migrateYoutubeData()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateYoutubeData };
