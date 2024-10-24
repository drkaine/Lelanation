import * as fs from "fs";

export function saveJson(data: JSON, path: string) {
  const dirPath = path.substring(0, path.lastIndexOf("/"));

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
