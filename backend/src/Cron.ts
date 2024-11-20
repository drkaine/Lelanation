import path from "path";
import { DdragonAPI } from "./DdragonAPI";
import { save } from "./FileManager";

const targets: string[] = [
  "data/fr_FR/championFull.json",
  "data/fr_FR/item.json",
  "data/fr_FR/summoner.json",
  "data/fr_FR/runesReforged.json",
  "data/fr_FR/map.json"
];

const folderTarget = "frontend/src/assets/files/";

const ddragonAPI = new DdragonAPI();

export async function compilation() {
  await ddragonAPI.lastVersion();
  targets.forEach(async (target: string) => {
    const data = await ddragonAPI.loadJson(target);
    const filename = target.split("/").pop();
    const filePath = path.join(__dirname, "../../" + folderTarget + filename);

    save(JSON.stringify(data), filePath);
  });
  const date = new Date();
  save(
    JSON.stringify(date),
    path.join(__dirname, "../../" + folderTarget + date),
  );
}
