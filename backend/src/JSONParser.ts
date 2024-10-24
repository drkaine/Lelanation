import { promises as fs } from "fs";
import path from "path";

export async function obtainChampionsName(): Promise<string[]> {
  const filePath = path.join(__dirname, "../..", "files/fr_FR/champion.json");

  const fileContent = await fs.readFile(filePath, "utf-8");
  const championsData = JSON.parse(fileContent);
  return Object.keys(championsData.data);
}
