import path from "path";
import { DdragonAPI } from "./DdragonAPI";
import { save } from "./FileManager";
import { obtainKey, parseChampionsData } from "./JSONParser";

const targets: string[] = [
  "data/fr_FR/champion.json",
  "data/fr_FR/item.json",
  "data/fr_FR/summoner.json",
];

const folderTarget = "frontend/src/assets/files/";

const ddragonAPI = new DdragonAPI();

export async function compilation() {
  targets.forEach(async (target: string) => {
    const data = await ddragonAPI.loadJson(target);
    const filename = target.split("/").pop();
    const filePath = path.join(__dirname, "../../" + folderTarget + filename);

    save(JSON.stringify(data), filePath);
  });
}

export async function specific() {
  const championsName: string[] = await obtainKey(
    folderTarget + "/champion.json",
  );

  championsName.forEach(async (championName: string) => {
    const data = await ddragonAPI.loadJson(
      "data/fr_FR/champion/" + championName + ".json",
    );
    const filePath = path.join(
      __dirname,
      "../../" + folderTarget + "/champion/" + championName + ".json",
    );
    save(JSON.stringify(data), filePath);
  });
}

export async function mergeData() {
  const championsDirectory = path.join(
    __dirname,
    "../../frontend/src/assets/files/champion",
  );
  await parseChampionsData(championsDirectory);
}
