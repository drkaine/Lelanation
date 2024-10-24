import { obtainKey } from "../src/JSONParser";

describe("Parse ", () => {
  const paths: string[] = [
    "files/fr_FR/champion.json",
    "files/fr_FR/item.json",
    "files/fr_FR/summoner.json",
    "files/fr_FR/champion/Aatrox.json",
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
