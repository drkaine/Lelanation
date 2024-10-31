import { promises as fs } from "fs";
import path from "path";

interface ChampionImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ChampionSkin {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

interface ChampionSpell {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  leveltip: {
    label: string[];
    effect: string[];
  };
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  effect: (number | null)[][];
  effectBurn: (string | null)[];
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  image: ChampionImage;
  resource: string;
}

interface ChampionPassive {
  name: string;
  description: string;
  image: ChampionImage;
}

interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: ChampionImage;
  skins: ChampionSkin[];
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: string[];
  partype: string;
  info: ChampionInfo;
  stats: ChampionStats;
  spells: ChampionSpell[];
  passive: ChampionPassive;
}

interface ChampionsData {
  type: string;
  format: string;
  version: string;
  data: Record<string, Champion>;
}

export async function parseChampionsData(directory: string): Promise<void> {
  const files = await fs.readdir(directory);
  const championsData: ChampionsData = {
    type: "",
    format: "",
    version: "",
    data: {},
  };

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(directory, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const champion: Champion = JSON.parse(fileContent);
      championsData.data[champion.id] = champion;
    }
  }

  await fs.writeFile(
    path.join(__dirname, "../../frontend/src/assets/files/championdata.json"),
    JSON.stringify(championsData, null, 2),
  );
}

export async function obtainKey(pathTarget: string): Promise<string[]> {
  const filePath = path.join(__dirname, "../..", pathTarget);

  const fileContent = await fs.readFile(filePath, "utf-8");
  const championsData = JSON.parse(fileContent);
  return Object.keys(championsData.data);
}
