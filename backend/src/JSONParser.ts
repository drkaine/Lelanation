import { promises as fs } from "fs";
import path from "path";

export async function obtainKey(pathTarget: string): Promise<string[]> {
  const filePath = path.join(__dirname, "../..", pathTarget);

  const fileContent = await fs.readFile(filePath, "utf-8");
  const championsData = JSON.parse(fileContent);
  return Object.keys(championsData.data);
}
