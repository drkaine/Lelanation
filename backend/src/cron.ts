import path from "path";
import { DdragonAPI } from "../src/DdragonAPI";
import { save } from "./FileManager";
import { obtainKey } from "../src/JSONParser";

async function getAllJSON() {
  const targets: string[] = [
    "data/fr_FR/champion.json",
    "data/fr_FR/item.json",
    "data/fr_FR/summoner.json",
  ];

  const folderTarget = "frontend/src/assets/files/";

  const ddragonAPI = new DdragonAPI();
  let data;

  targets.forEach(async (target: string) => {
    data = await ddragonAPI.loadJson(target);
    const filename = target.split("/").pop();
    const filePath = path.join(__dirname, "../../" + folderTarget + filename);

    save(JSON.stringify(data), filePath);
  });

  const championsName: string[] = await obtainKey(
    folderTarget + "/champion.json",
  );

  championsName.forEach(async (championName: string) => {
    data = await ddragonAPI.loadJson(
      "data/fr_FR/champion/" + championName + ".json",
    );
    const pathFile = path.join(
      __dirname,
      "../../" + folderTarget + "/champion/" + championName + ".json",
    );
    save(JSON.stringify(data), pathFile);
  });
}

getAllJSON();
