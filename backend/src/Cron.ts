import path from "path";
import { DdragonAPI } from "./DdragonAPI";
import { save, open } from "./FileManager";

const targets: string[] = [
  "data/fr_FR/championFull.json",
  "data/fr_FR/item.json",
  "data/fr_FR/summoner.json",
  "data/fr_FR/runesReforged.json",
  "data/fr_FR/map.json",
];

const folderTarget = "frontend/public/assets/icons/";
const folderTargetJSON = "frontend/src/assets/files/";

const ddragonAPI = new DdragonAPI();

interface Champion {
  image: {
    full: string;
  };
  spells: Array<{
    id: string;
  }>;
  passive: {
    image: {
      full: string;
    };
  };
}

interface Item {
  image: {
    full: string;
  };
}

interface Summoner {
  image: {
    full: string;
  };
}

interface RuneSlot {
  icon: string;
  id: number;
}

interface RunePath {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: Array<{ runes: RuneSlot[] }>;
}

export async function compilation() {
  await ddragonAPI.lastVersion();

  for (const target of targets) {
    const data = await ddragonAPI.loadJson(target);

    const filename = target.split("/").pop();
    const filePath = path.join(
      __dirname,
      "../../" + folderTargetJSON + filename,
    );

    save(JSON.stringify(data), filePath);
  }

  const championFull = await open(
    path.join(__dirname, "../../" + folderTargetJSON + "championFull.json"),
  );

  const championFullFile = JSON.parse(championFull).data;

  for (const value of Object.values(championFullFile)) {
    const Data = value as Champion;
    const image = await ddragonAPI.loadImage("img/champion/" + Data.image.full);
    await save(
      image,
      path.join(
        __dirname,
        "../../" + folderTarget + "/champions/" + Data.image.full,
      ),
    );
    const passive = await ddragonAPI.loadImage(
      "img/passive/" + Data.passive.image.full,
    );
    await save(
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
      await save(
        spell,
        path.join(
          __dirname,
          "../../" + folderTarget + "/champions/spells/" + value.id + ".png",
        ),
      );
    }
  }

  const item = await open(
    path.join(__dirname, "../../" + folderTargetJSON + "item.json"),
  );

  const itemFile = JSON.parse(item).data;

  for (const value of Object.values(itemFile)) {
    const Data = value as Item;
    const image = await ddragonAPI.loadImage("img/item/" + Data.image.full);
    await save(
      image,
      path.join(
        __dirname,
        "../../" + folderTarget + "/items/" + Data.image.full,
      ),
    );
  }

  const summoner = await open(
    path.join(__dirname, "../../" + folderTargetJSON + "summoner.json"),
  );

  const summonerFile = JSON.parse(summoner).data;

  for (const value of Object.values(summonerFile)) {
    const Data = value as Summoner;
    const image = await ddragonAPI.loadImage("img/spell/" + Data.image.full);
    await save(
      image,
      path.join(
        __dirname,
        "../../" + folderTarget + "/summoners/" + Data.image.full,
      ),
    );
  }

  const runesReforged = await open(
    path.join(__dirname, "../../" + folderTargetJSON + "runesReforged.json"),
  );

  const runesReforgedFile = JSON.parse(runesReforged) as RunePath[];

  for (const runePath of runesReforgedFile) {
    const pathImage = await ddragonAPI.loadImage("img/" + runePath.icon, false);
    await save(
      pathImage,
      path.join(
        __dirname,
        "../../" + folderTarget + "/runes/" + runePath.id + ".png",
      ),
    );

    for (const slot of runePath.slots) {
      for (const rune of slot.runes) {
        const runeImage = await ddragonAPI.loadImage("img/" + rune.icon, false);
        await save(
          runeImage,
          path.join(
            __dirname,
            "../../" + folderTarget + "/runes/" + rune.id + ".png",
          ),
        );
      }
    }
  }

  const date = new Date();
  save(
    JSON.stringify(date),
    path.join(__dirname, "../../" + folderTargetJSON + date),
  );
}
