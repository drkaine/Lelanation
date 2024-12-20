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

const folderTarget = "frontend/src/assets/files/";

const ddragonAPI = new DdragonAPI();

interface Champion {
  image: {
    full: string;
  };
  spells: Array<{
    image: {
      id: string;
    };
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

interface Runes {
  runes: Array<{
    icon: string;
    key: string;
  }>;
}

export async function compilation() {
  await ddragonAPI.lastVersion();

  for (const target of targets) {
    const data = await ddragonAPI.loadJson(target);
    if (!data || !data.data) {
      console.error(`Données invalides pour ${target}`);
      continue;
    }

    const filename = target.split("/").pop();
    const filePath = path.join(__dirname, "../../" + folderTarget + filename);
    await save(JSON.stringify(data), filePath);

    save(JSON.stringify(data), filePath);

    const championFull = await open(
      path.join(__dirname, "../../" + folderTarget + "championFull.json"),
    );
    const item = await open(
      path.join(__dirname, "../../" + folderTarget + "item.json"),
    );
    const summoner = await open(
      path.join(__dirname, "../../" + folderTarget + "summoner.json"),
    );
    const runesReforged = await open(
      path.join(__dirname, "../../" + folderTarget + "runesReforged.json"),
    );

    const championFullFile = JSON.parse(championFull).data;
    const itemFile = JSON.parse(item).data;
    const summonerFile = JSON.parse(summoner).data;
    const runesReforgedFile = JSON.parse(runesReforged).slots;

    for (const value of Object.values(championFullFile)) {
      const Data = value as Champion;
      const image = await ddragonAPI.loadImage(
        "img/champion/" + Data.image.full,
      );
      await save(
        image,
        path.join(
          __dirname,
          "../../frontend/src/assets/images/champions/" + Data.image.full,
        ),
      );
      const passive = await ddragonAPI.loadImage(
        "img/passive/" + Data.passive.image.full,
      );
      await save(
        passive,
        path.join(
          __dirname,
          "../../frontend/src/assets/images/champions/passiv/" +
            Data.passive.image.full,
        ),
      );

      for (const value of Object.values(Data.spells)) {
        const spell = await ddragonAPI.loadImage("img/spell/" + value.image.id);
        await save(
          spell,
          path.join(
            __dirname,
            "../../frontend/src/assets/images/champions/spells/" +
              Data.image.full,
          ),
        );
      }
    }

    for (const value of Object.values(itemFile)) {
      const Data = value as Item;
      const image = await ddragonAPI.loadImage("img/item/" + Data.image.full);
      await save(
        image,
        path.join(
          __dirname,
          "../../frontend/src/assets/images/items/" + Data.image.full,
        ),
      );
    }

    for (const value of Object.values(summonerFile)) {
      const Data = value as Summoner;
      const image = await ddragonAPI.loadImage("img/spell/" + Data.image.full);
      await save(
        image,
        path.join(
          __dirname,
          "../../frontend/src/assets/images/summoners/" + Data.image.full,
        ),
      );
    }

    for (const value of Object.values(runesReforgedFile)) {
      const runes = value as Runes;

      for (const rune of Object.values(runes.runes)) {
        const image = await ddragonAPI.loadImage("img/" + rune.icon);
        await save(
          image,
          path.join(
            __dirname,
            "../../frontend/src/assets/images/runes/" + rune.key + ".png",
          ),
        );
      }
    }

    const date = new Date();
    save(
      JSON.stringify(date),
      path.join(__dirname, "../../" + folderTarget + date),
    );
  }
}
