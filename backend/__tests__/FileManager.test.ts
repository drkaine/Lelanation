import { saveJson } from "../src/FileManager";
import * as fs from "fs";
import * as path from "path";

describe("Create ", () => {
  it("files", () => {
    const jsonData: string = JSON.stringify({ key: "value" });
    const filePath = path.join(__dirname, "/files", "test.json");

    saveJson(JSON.parse(jsonData), filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    fs.unlinkSync(filePath);
  });

  it("folder", () => {
    const jsonData: string = JSON.stringify({ key: "value" });
    const filePath = path.join(__dirname, "/test", "test.json");
    const dirPath = path.join(__dirname, "/test");

    saveJson(JSON.parse(jsonData), filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    fs.unlinkSync(filePath);

    fs.rmdirSync(dirPath);
  });
});
