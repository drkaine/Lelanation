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
