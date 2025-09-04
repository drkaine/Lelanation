import { YoutubeService } from "../service/YoutubeService";
import { showChannelsStatus } from "./showChannelsStatus";
import { updateAllChannels } from "./updateAllChannels";
import { forceCompleteAllChannels } from "./forceCompleteAllChannels";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function showMenu() {
  console.log("\n🎬 YouTube Channel Manager");
  console.log("=".repeat(40));
  console.log("1. 📊 Show channels status");
  console.log("2. 🔄 Update all channels (new videos only)");
  console.log("3. ⚡ Force complete all channels (all videos)");
  console.log("4. ➕ Add new channel");
  console.log("5. 🎯 Add LelarivaExtra channel");
  console.log("6. 🚪 Exit");
  console.log("=".repeat(40));
}

async function addNewChannel() {
  try {
    const username = await question(
      "Enter YouTube username (e.g., @LelarivaExtra): ",
    );

    if (!username.trim()) {
      console.log("❌ Username cannot be empty");
      return;
    }

    console.log(`\n🔍 Adding channel: ${username}`);

    const youtubeService = new YoutubeService();

    // Extraire l'ID de chaîne
    const channelId = await youtubeService.getChannelId(username);
    console.log(`✅ Found channel ID: ${channelId}`);

    // Récupérer les statistiques
    const stats = await youtubeService.getChannelStatistics(channelId);
    console.log(`📊 Channel statistics:`);
    console.log(`   - Name: ${stats.name}`);
    console.log(`   - Total videos: ${stats.videoCount.toLocaleString()}`);
    console.log(`   - Subscribers: ${stats.subscriberCount.toLocaleString()}`);

    // Ajouter la chaîne
    await youtubeService.addChannel(channelId);
    console.log(`✅ Channel added successfully!`);

    // Récupérer les vidéos
    console.log(`🎥 Fetching videos...`);
    const videos = await youtubeService.fetchAndStoreVideos(channelId);
    console.log(`✅ Fetched ${videos.length} videos`);
  } catch (error) {
    console.error("❌ Error adding channel:", error);
  }
}

async function main() {
  console.log("🎬 Welcome to YouTube Channel Manager!");

  while (true) {
    await showMenu();

    const choice = await question("\nSelect an option (1-6): ");

    switch (choice.trim()) {
      case "1":
        console.log("\n📊 Showing channels status...");
        await showChannelsStatus();
        break;

      case "2":
        console.log("\n🔄 Updating all channels...");
        await updateAllChannels();
        break;

      case "3": {
        const confirm = await question(
          "\n⚠️  This will force completion of all channels and may take a long time. Continue? (y/N): ",
        );
        if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "yes") {
          console.log("\n⚡ Force completing all channels...");
          await forceCompleteAllChannels();
        } else {
          console.log("❌ Operation cancelled");
        }
        break;
      }

      case "4":
        await addNewChannel();
        break;

      case "5": {
        console.log("\n🎯 Adding LelarivaExtra channel...");
        const { addLelarivaExtra } = await import("./addLelarivaExtra");
        await addLelarivaExtra();
        break;
      }

      case "6":
        console.log("👋 Goodbye!");
        rl.close();
        process.exit(0);
        break;

      default:
        console.log("❌ Invalid option. Please select 1-6.");
    }

    await question("\nPress Enter to continue...");
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log("🎉 YouTube Manager completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 YouTube Manager failed:", error);
      process.exit(1);
    });
}

export { main as youtubeManager };
