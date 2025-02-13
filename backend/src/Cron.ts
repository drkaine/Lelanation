import path from "path";
import { DdragonAPI } from "./DdragonAPI";
import { saveFile, openFile } from "./FileManager";
import { Champion, Item, Summoner, RunePath } from "./types";
import { exec } from "child_process";

const targets: string[] = [
  "data/fr_FR/championFull.json",
  "data/fr_FR/item.json",
  "data/fr_FR/summoner.json",
  "data/fr_FR/runesReforged.json",
  "data/fr_FR/map.json",
];

const folderTarget = "frontend/public/assets/icons/";
const folderTargetJSON = "frontend/src/assets/files/data/";

const ddragonAPI = new DdragonAPI();

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
  for (const target of targets) {
    const data = await ddragonAPI.loadJson(target);

    const filename = target.split("/").pop();
    const filePath = path.join(
      __dirname,
      "../../" + folderTargetJSON + filename,
    );

    saveFile(JSON.stringify(data), filePath);
  }
}

async function downloadChampions() {
  const championsFull = await openFile(
    path.join(__dirname, "../../" + folderTargetJSON + "championFull.json"),
  );

  const championsData = JSON.parse(championsFull).data;

  for (const value of Object.values(championsData)) {
    const Data = value as Champion;
    const image = await ddragonAPI.loadImage("img/champion/" + Data.image.full);
    await saveFile(
      image,
      path.join(
        __dirname,
        "../../" + folderTarget + "/champions/" + Data.image.full,
      ),
    );
    const passive = await ddragonAPI.loadImage(
      "img/passive/" + Data.passive.image.full,
    );
    await saveFile(
      passive,
      path.join(
        __dirname,
        "../../" +
          folderTarget +
          "/champions/passive/" +
          Data.passive.image.full,
      ),
    );
    for (const value of Object.values(Data.spells)) {
      const spell = await ddragonAPI.loadImage(
        "img/spell/" + value.id + ".png",
      );
      await saveFile(
        spell,
        path.join(
          __dirname,
          "../../" + folderTarget + "/champions/sorts/" + value.id + ".png",
        ),
      );
    }
  }
}

async function downloadSpells() {
  const item = await openFile(
    path.join(__dirname, "../../" + folderTargetJSON + "item.json"),
  );

  const itemFile = JSON.parse(item).data;

  for (const value of Object.values(itemFile)) {
    const Data = value as Item;
    const image = await ddragonAPI.loadImage("img/item/" + Data.image.full);
    await saveFile(
      image,
      path.join(
        __dirname,
        "../../" + folderTarget + "/items/" + Data.image.full,
      ),
    );
  }
}

async function downloadSummoners() {
  const summoner = await openFile(
    path.join(__dirname, "../../" + folderTargetJSON + "summoner.json"),
  );

  const summonerFile = JSON.parse(summoner).data;

  for (const value of Object.values(summonerFile)) {
    const Data = value as Summoner;
    const image = await ddragonAPI.loadImage("img/spell/" + Data.image.full);
    await saveFile(
      image,
      path.join(
        __dirname,
        "../../" + folderTarget + "/summoners/" + Data.image.full,
      ),
    );
  }
}

async function downloadRunes() {
  const runesReforged = await openFile(
    path.join(__dirname, "../../" + folderTargetJSON + "runesReforged.json"),
  );

  const runesReforgedFile = JSON.parse(runesReforged) as RunePath[];

  for (const runePath of runesReforgedFile) {
    const pathImage = await ddragonAPI.loadImage("img/" + runePath.icon, false);
    await saveFile(
      pathImage,
      path.join(
        __dirname,
        "../../" + folderTarget + "/runes/" + runePath.id + ".png",
      ),
    );

    for (const slot of runePath.slots) {
      for (const rune of slot.runes) {
        const runeImage = await ddragonAPI.loadImage("img/" + rune.icon, false);
        await saveFile(
          runeImage,
          path.join(
            __dirname,
            "../../" + folderTarget + "/runes/" + rune.id + ".png",
          ),
        );
      }
    }
  }
}

export async function compilation() {
  await ddragonAPI.lastVersion();

  await downloadFiles();

  await downloadChampions();

  await downloadSpells();

  await downloadSummoners();

  await downloadRunes();

  const date = new Date();

  saveFile(
    JSON.stringify(date),
    path.join(__dirname, "../../" + folderTargetJSON + date),
  );
}
