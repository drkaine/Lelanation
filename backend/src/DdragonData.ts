import * as fs from "fs";

export async function getChampions() {
  const response = await connectUrl();

  const data = await response.json();

  return data;
}

export async function connectUrl() {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/data/en_US/champion.json",
  );

  return response;
}

export function saveJson(data: JSON, path: string) {
  const dirPath = path.substring(0, path.lastIndexOf("/"));

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
