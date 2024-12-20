import { DdragonAPI } from "../src/DdragonAPI";

describe("Ddragon ", () => {
  let ddragonAPI: DdragonAPI;

  beforeEach(async () => {
    ddragonAPI = new DdragonAPI();
    await ddragonAPI.lastVersion();
  });

  const targets: string[] = [
    "data/fr_FR/championFull.json",
    "data/fr_FR/item.json",
    "data/fr_FR/summoner.json",
  ];
  it.each(targets)("%s json not empty", async (target: string) => {
    const data = await ddragonAPI.loadJson(target);
    expect(data).toBeDefined();
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });

  it.each(targets)("good url status", async (target: string) => {
    const response = await ddragonAPI.access(target, true);
    expect(response.status).toBe(200);
  });

  const imageTargets: string[] = [
    "img/spell/SummonerFlash.png",
    "img/item/1001.png",
    "img/champion/Aatrox.png",
    "img/passive/Anivia_P.png",
    "img/spell/FlashFrost.png",
  ];

  it.each(imageTargets)("good url status", async (imageTarget: string) => {
    const response = await ddragonAPI.access(imageTarget, true);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/image\/png/);
  });
});
