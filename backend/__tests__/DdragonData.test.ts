import { getChampions, connectUrl } from "../src/DdragonData";

describe("Ddragon ", () => {
  it("champions json not empty", async () => {
    const data = await getChampions();
    expect(data).toBeDefined();
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });

  it("good champions url status", async () => {
    const response = await connectUrl();
    expect(response.status).toBe(200);
  });
});
