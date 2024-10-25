import * as fs from "fs";

export function save(data: string | Buffer, path: string) {
  const dirPath = path.substring(0, path.lastIndexOf("/"));

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(path, data);
}
