import * as fs from "fs";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);

export function save(data: string | Buffer, path: string) {
  const dirPath = path.substring(0, path.lastIndexOf("/"));

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(path, data);
}

export async function open(file: string) {
  try {
    const data = await readFileAsync(file, "utf8");
    return data;
  } catch (err) {
    console.error(`Erreur lors de l'ouverture du fichier ${file} :`, err);
    throw err;
  }
}

export async function appendToJson<T>(newData: T, path: string) {
  try {
    let existingData: T[] = [];

    if (fs.existsSync(path)) {
      const fileContent = await readFileAsync(path, "utf8");
      existingData = JSON.parse(fileContent);
    }

    existingData.push({
      ...newData,
      date: new Date().toISOString(),
    });

    save(JSON.stringify(existingData, null, 2), path);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout au JSON:", error);
    throw error;
  }
}
