import { getChampions, connectUrl, saveJson } from "../src/DdragonData";
import * as fs from 'fs';
import * as path from 'path';

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

  it('create champions files', () => {
    const jsonData: string = JSON.stringify({ key: 'value' }); 
    const filePath = path.join(__dirname, '/files', 'champions.json');

    saveJson(JSON.parse(jsonData), filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    fs.unlinkSync(filePath);
  });
});
