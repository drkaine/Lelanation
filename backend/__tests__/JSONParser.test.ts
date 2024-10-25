import { obtainKey } from "../src/JSONParser";

describe("Parse ", () => {
  const paths: string[] = [
    "frontend/src/assets/files/champion.json",
    "frontend/src/assets/files/item.json",
    "frontend/src/assets/files/summoner.json",
    "frontend/src/assets/files/champion/Aatrox.json",
  ];

  it.each(paths)("%s file for extract name", async (path: string) => {
    const keys = await obtainKey(path);

    expect(Array.isArray(keys)).toBe(true);

    keys.forEach((key) => {
      expect(typeof key).toBe("string");
    });

    const expectedLength = 1;
    expect(keys.length).toBeGreaterThanOrEqual(expectedLength);
  });
});
