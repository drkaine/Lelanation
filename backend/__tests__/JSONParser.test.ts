import { obtainChampionsName } from "../src/JSONParser";

describe("Parse ", () => {
  it("champion file for extract name", async () => {
    const championsNames = await obtainChampionsName();

    expect(Array.isArray(championsNames)).toBe(true);

    championsNames.forEach((name) => {
      expect(typeof name).toBe("string");
    });

    const expectedLength = 140;
    expect(championsNames.length).toBeGreaterThanOrEqual(expectedLength);
  });
});
