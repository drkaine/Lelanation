import {
  getChampions,
  connect,
  getItems,
  getsSummoners,
} from "../src/DdragonData";

describe("Ddragon ", () => {
  it("champions json not empty", async () => {
    const data = await getChampions();
    expect(data).toBeDefined();
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });

  it("items json not empty", async () => {
    const data = await getItems();
    expect(data).toBeDefined();
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });

  it("items json not empty", async () => {
    const data = await getsSummoners();
    expect(data).toBeDefined();
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });

  it("good url status", async () => {
    const url =
      "https://ddragon.leagueoflegends.com/cdn/14.21.1/data/fr_FR/champion.json";
    const response = await connect(url);
    expect(response.status).toBe(200);
  });
});
