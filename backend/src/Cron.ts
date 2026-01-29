import path from "path";
import { DdragonAPI } from "./DdragonAPI";
import { saveFile, openFile } from "./FileManager";
import { Champion, Item, Summoner, RunePath } from "./types";
import { exec } from "child_process";
import { YoutubeService } from "./service/YoutubeService";
import { redisUtils } from "./utils/redisClient";

const targets: {
  urlFR: string[];
  urlEN: string[];
  folder: string;
  folderJSON: string;
} = {
  urlFR: [
    "data/fr_FR/championFull.json",
    "data/fr_FR/item.json",
    "data/fr_FR/summoner.json",
    "data/fr_FR/runesReforged.json",
    "data/fr_FR/map.json",
  ],
  urlEN: [
    "data/en_US/championFull.json",
    "data/en_US/item.json",
    "data/en_US/summoner.json",
    "data/en_US/runesReforged.json",
    "data/en_US/map.json",
  ],
  folder: "../../frontend/public/assets/icons/",
  folderJSON: "../../frontend/src/assets/files/data/",
};

const ddragonAPI = new DdragonAPI();
const youtubeService = new YoutubeService();

export async function execution() {
  exec("bash ../.github/.scripts/deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur d'exécution: ${error}`);
      return;
    }
    console.log(`Sortie du déploiement: ${stdout}`);
    if (stderr) {
      console.error(`Erreurs du déploiement: ${stderr}`);
    }
  });
}

async function downloadFiles() {
  for (const target of targets["urlFR"]) {
    const data = await ddragonAPI.loadJson(target);

    const filename = target.split("/").pop();
    const filePath = path.join(__dirname, targets["folderJSON"] + filename);

    saveFile(JSON.stringify(data), filePath);
  }
  for (const target of targets["urlEN"]) {
    const data = await ddragonAPI.loadJson(target);

    const filename = target.split("/").pop();
    const filePath = path.join(
      __dirname,
      targets["folderJSON"] + "en/" + filename,
    );

    saveFile(JSON.stringify(data), filePath);
  }
}

async function cleanChampionsFullJson() {
  console.log("🧹 Cleaning champions data...");
  try {
    const championsFull = await openFile(
      path.join(__dirname, targets["folderJSON"] + "championFull.json"),
    );

    const championsData = JSON.parse(championsFull);
    const keysToRemove = [
      "skins",
      "lore",
      "blurb",
      "allytips",
      "enemytips",
      "partype",
    ];

    for (const championKey of Object.keys(championsData.data)) {
      const champion = championsData.data[championKey];

      keysToRemove.forEach((key) => {
        if (champion[key]) {
          delete champion[key];
        }
      });
    }

    await saveFile(
      JSON.stringify(championsData),
      path.join(__dirname, targets["folderJSON"] + "championFull.json"),
    );

    const championsFullEN = await openFile(
      path.join(__dirname, targets["folderJSON"] + "en/championFull.json"),
    );

    const championsDataEN = JSON.parse(championsFullEN);

    for (const championKey of Object.keys(championsDataEN.data)) {
      const champion = championsDataEN.data[championKey];

      keysToRemove.forEach((key) => {
        if (champion[key]) {
          delete champion[key];
        }
      });
    }

    await saveFile(
      JSON.stringify(championsDataEN),
      path.join(__dirname, targets["folderJSON"] + "en/championFull.json"),
    );
    console.log("✅ English champions data cleaned successfully");
  } catch (error) {
    console.error("❌ Error cleaning champions data:", error);
  }
}

async function downloadChampions() {
  const championsFull = await openFile(
    path.join(__dirname, targets["folderJSON"] + "championFull.json"),
  );

  const championsData = JSON.parse(championsFull).data;
  const championsList = Object.values(championsData);
  console.log(`[downloadChampions] Téléchargement de ${championsList.length} champions...`);

  let successCount = 0;
  let errorCount = 0;

  for (const value of championsList) {
    const Data = value as Champion;
    const championName = Data.image.full.replace('.png', '');
    
    try {
      // Télécharger l'image du champion
      const image = await ddragonAPI.loadImage("img/champion/" + Data.image.full);
      await saveFile(
        image,
        path.join(__dirname, targets["folder"] + "/champions/" + Data.image.full),
      );
      
      // Télécharger l'image passive
      const passive = await ddragonAPI.loadImage(
        "img/passive/" + Data.passive.image.full,
      );
      await saveFile(
        passive,
        path.join(
          __dirname,
          targets["folder"] + "/champions/passive/" + Data.passive.image.full,
        ),
      );
      
      // Télécharger les images des sorts
      for (const spellValue of Object.values(Data.spells)) {
        const spell = await ddragonAPI.loadImage(
          "img/spell/" + spellValue.id + ".png",
        );
        await saveFile(
          spell,
          path.join(
            __dirname,
            targets["folder"] + "/champions/sorts/" + spellValue.id + ".png",
          ),
        );
      }
      
      successCount++;
      if (championName === 'Zaahen') {
        console.log(`[downloadChampions] ✅ Zaahen téléchargé avec succès`);
      }
    } catch (error) {
      errorCount++;
      console.error(`[downloadChampions] ❌ Erreur lors du téléchargement de ${championName}:`, error);
      // Continuer avec les autres champions même en cas d'erreur
    }
  }

  console.log(`[downloadChampions] ✅ Téléchargement terminé: ${successCount} succès, ${errorCount} erreurs`);
  await cleanChampionsFullJson();
}

async function downloadSpells() {
  const item = await openFile(
    path.join(__dirname, targets["folderJSON"] + "item.json"),
  );

  const itemFile = JSON.parse(item).data;

  for (const value of Object.values(itemFile)) {
    const Data = value as Item;
    const image = await ddragonAPI.loadImage("img/item/" + Data.image.full);
    await saveFile(
      image,
      path.join(__dirname, targets["folder"] + "/items/" + Data.image.full),
    );
  }
}

async function downloadSummoners() {
  const summoner = await openFile(
    path.join(__dirname, targets["folderJSON"] + "summoner.json"),
  );

  const summonerFile = JSON.parse(summoner).data;

  for (const value of Object.values(summonerFile)) {
    const Data = value as Summoner;
    const image = await ddragonAPI.loadImage("img/spell/" + Data.image.full);
    await saveFile(
      image,
      path.join(__dirname, targets["folder"] + "/summoners/" + Data.image.full),
    );
  }
}

async function downloadRunes() {
  const runesReforged = await openFile(
    path.join(__dirname, targets["folderJSON"] + "runesReforged.json"),
  );

  const runesReforgedFile = JSON.parse(runesReforged) as RunePath[];

  for (const runePath of runesReforgedFile) {
    const pathImage = await ddragonAPI.loadImage("img/" + runePath.icon, false);
    await saveFile(
      pathImage,
      path.join(
        __dirname,
        targets["folder"] + "/runes/" + runePath.id + ".png",
      ),
    );

    for (const slot of runePath.slots) {
      for (const rune of slot.runes) {
        const runeImage = await ddragonAPI.loadImage("img/" + rune.icon, false);
        await saveFile(
          runeImage,
          path.join(
            __dirname,
            targets["folder"] + "/runes/" + rune.id + ".png",
          ),
        );
      }
    }
  }
}

async function downloadYoutubeVideos() {
  try {
    const channelId = await youtubeService.getChannelId("Lelariva_LoL");
    await youtubeService.fetchAndStoreVideos(channelId);
    console.log("YouTube videos updated successfully");
  } catch (error) {
    console.error("Error updating YouTube videos:", error);
  }
}

async function invalidateGameDataCache() {
  try {
    console.log("[CRON] Invalidation du cache des données de jeu...");
    
    // Patterns de cache à invalider pour les données de jeu
    // Note: Redis KEYS peut être lent sur de grandes bases, mais nécessaire ici
    const cachePatterns = [
      "cache:/data/*",              // Cache des fichiers JSON statiques servis via /data
      "cache:*champion*",           // Cache lié aux champions
      "cache:*item*",               // Cache lié aux items
      "cache:*rune*",               // Cache lié aux runes
      "cache:*summoner*",           // Cache lié aux invocateurs
      "cache:*youtube*",            // Cache lié aux vidéos YouTube
      "cache:*championFull*",       // Cache spécifique pour championFull.json
      "cache:*item.json*",          // Cache spécifique pour item.json
      "cache:*runesReforged*",      // Cache spécifique pour runesReforged.json
    ];

    // Clés spécifiques à invalider (si elles existent)
    const specificKeys = [
      "cache:/data/championFull.json",
      "cache:/data/item.json",
      "cache:/data/runesReforged.json",
      "cache:/data/summoner.json",
      "cache:/data/map.json",
      "cache:/data/en/championFull.json",
      "cache:/data/en/item.json",
      "cache:/data/en/runesReforged.json",
      "cache:/data/en/summoner.json",
      "cache:/data/en/map.json",
    ];

    // Invalider tous les patterns et clés spécifiques
    const invalidationTasks = [
      ...cachePatterns.map((pattern) => redisUtils.delByPattern(pattern)),
      ...specificKeys.map((key) => redisUtils.del(key)),
    ];

    await Promise.all(invalidationTasks);

    console.log(
      `[CRON] ✅ Cache des données de jeu invalidé avec succès (${cachePatterns.length} patterns, ${specificKeys.length} clés spécifiques)`
    );
  } catch (error) {
    console.error("[CRON] ❌ Erreur lors de l'invalidation du cache:", error);
    // Ne pas faire échouer la compilation si l'invalidation échoue
  }
}

export async function compilation() {
  const date = new Date();
  console.log(`[CRON] Début de la compilation à ${date.toISOString()}`);
  
  let newVersionDownloaded = false;
  
  try {
    const isLastVersion = await ddragonAPI.isLastVersion();
    console.log(`[CRON] Vérification de version: ${isLastVersion ? 'Dernière version' : 'Nouvelle version disponible'}`);
    
    if (!isLastVersion) {
      console.log("[CRON] Nouvelle version détectée, téléchargement des données...");
      await ddragonAPI.getLastVersion();
      await downloadFiles();
      console.log("[CRON] Fichiers JSON téléchargés");

      await downloadChampions();
      console.log("[CRON] Champions téléchargés");

      await downloadSpells();
      console.log("[CRON] Items téléchargés");

      await downloadSummoners();
      console.log("[CRON] Invocateurs téléchargés");

      await downloadRunes();
      console.log("[CRON] Runes téléchargées");

      saveFile(
        JSON.stringify(date),
        path.join(__dirname, targets["folderJSON"] + "nouvelle-version"),
      );
      console.log("[CRON] ✅ Mise à jour complète terminée avec nouvelle version");
      
      newVersionDownloaded = true;
      
      // Invalider le cache après le téléchargement des nouvelles données
      await invalidateGameDataCache();
    } else {
      console.log("[CRON] Version à jour, pas de téléchargement nécessaire");
      saveFile(
        JSON.stringify(date),
        path.join(__dirname, targets["folderJSON"] + "pas-de-nouvelle-version"),
      );
      
      // Vérifier et télécharger les images manquantes même si la version n'a pas changé
      console.log("[CRON] Vérification des images manquantes...");
      try {
        await downloadChampions();
        console.log("[CRON] ✅ Vérification des images terminée");
      } catch (error) {
        console.error("[CRON] ❌ Erreur lors de la vérification des images:", error);
      }
    }

    // Toujours mettre à jour les vidéos YouTube, même si la version n'a pas changé
    console.log("[CRON] Mise à jour des vidéos YouTube...");
    await downloadYoutubeVideos();
    
    // Invalider le cache des vidéos YouTube après mise à jour
    await invalidateGameDataCache();
    
    // Si une nouvelle version a été téléchargée, déclencher le rebuild du frontend
    if (newVersionDownloaded) {
      console.log("[CRON] Nouvelle version détectée, déclenchement du rebuild du frontend...");
      try {
        execution();
        console.log("[CRON] ✅ Rebuild du frontend déclenché avec succès");
      } catch (deployError) {
        console.error("[CRON] ❌ Erreur lors du déclenchement du rebuild:", deployError);
        // Ne pas faire échouer la compilation si le déploiement échoue
      }
    }
    
    console.log("[CRON] ✅ Compilation terminée avec succès");
  } catch (error) {
    console.error("[CRON] ❌ Erreur lors de la compilation:", error);
    // Même en cas d'erreur, on essaie de mettre à jour les vidéos YouTube
    try {
      console.log("[CRON] Tentative de mise à jour des vidéos YouTube malgré l'erreur...");
      await downloadYoutubeVideos();
      // Invalider le cache même en cas d'erreur partielle
      await invalidateGameDataCache();
    } catch (youtubeError) {
      console.error("[CRON] ❌ Erreur lors de la mise à jour des vidéos YouTube:", youtubeError);
    }
    throw error; // Re-lancer l'erreur pour que le cron puisse la gérer
  }
}
