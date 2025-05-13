import { YoutubeService } from "../service/YoutubeService";

async function cleanJson() {
  try {
    console.log("Starting to clean YouTube JSON...");
    const youtubeService = new YoutubeService();
    await youtubeService.cleanExistingData();
    console.log("YouTube JSON cleaned successfully!");
  } catch (error) {
    console.error("Error cleaning YouTube JSON:", error);
  }
}

cleanJson();
