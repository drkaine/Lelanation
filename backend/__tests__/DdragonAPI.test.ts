import { DdragonAPI } from "../src/DdragonAPI";

describe("Ddragon ", () => {
  let ddragonAPI: DdragonAPI;
  const targets: Array<Array<string>> = [
    ["champion.json"],
    ["item.json"],
    ["summoner.json"],
    ["champion/Aatrox.json"],
  ];

  beforeEach(() => {
    ddragonAPI = new DdragonAPI();
  });

  it.each(targets)("%s json not empty", async (target: string) => {
    const data = await ddragonAPI.loadJson(target);
    expect(data).toBeDefined();
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });

  it.each(targets)("good url status", async (target: string) => {
    const response = await ddragonAPI.access(target);
    expect(response.status).toBe(200);
  });
});
