import { saveJSON, savePNG } from "../src/FileManager";
import * as fs from "fs";
import * as path from "path";

describe("Create JSON", () => {
  it("files", () => {
    const jsonData: string = JSON.stringify({ key: "value" });
    const filePath = path.join(__dirname, "/files", "test.json");

    saveJSON(JSON.parse(jsonData), filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    fs.unlinkSync(filePath);
  });

  it("folder", () => {
    const jsonData: string = JSON.stringify({ key: "value" });
    const filePath = path.join(__dirname, "/test", "test.json");
    const dirPath = path.join(__dirname, "/test");

    saveJSON(JSON.parse(jsonData), filePath);

    expect(fs.existsSync(dirPath)).toBe(true);

    fs.unlinkSync(filePath);

    fs.rmdirSync(dirPath);
  });
});

describe("Create PNG", () => {
  it("files", () => {
    const pngData: Buffer = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const filePath = path.join(__dirname, "/files", "test.png");

    fs.writeFileSync(filePath, pngData);

    expect(fs.existsSync(filePath)).toBe(true);

    fs.unlinkSync(filePath);
  });

  it("folder", () => {
    const pngData: Buffer = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const filePath = path.join(__dirname, "/test", "test.png");
    const dirPath = path.join(__dirname, "/test");

    savePNG(pngData, filePath);

    expect(fs.existsSync(dirPath)).toBe(true);

    fs.unlinkSync(filePath);
    fs.rmdirSync(dirPath);
  });
});
