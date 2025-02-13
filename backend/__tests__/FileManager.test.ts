import { saveFile, appendToJson } from "../src/FileManager";
import * as fs from "fs";
import * as path from "path";

describe("Create", () => {
  let dirPath: string;
  let filePath: string;

  beforeEach(() => {
    dirPath = path.join(__dirname, "/files");
    filePath = path.join(__dirname, "/files", "test");
  });

  const datas = [
    [JSON.parse(JSON.stringify({ key: "value" })), ".json"],
    [Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ".png"],
  ];

  it.each(datas)(
    "%s file",
    async (data: string | Buffer, extension: string) => {
      filePath = filePath + extension;

      saveFile(JSON.stringify(data), filePath);

      expect(fs.existsSync(filePath)).toBe(true);

      fs.unlinkSync(filePath);
    },
  );

  it.each(datas)(
    "%s folder",
    async (data: string | Buffer, extension: string) => {
      filePath = filePath + extension;

      saveFile(JSON.stringify(data), filePath);

      expect(fs.existsSync(dirPath)).toBe(true);

      fs.unlinkSync(filePath);
      fs.rmdirSync(dirPath);
    },
  );
});

describe("JSON Operations", () => {
  const testPath = path.join(__dirname, "/files/test.json");
  const dirPath = path.dirname(testPath);

  beforeEach(() => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath);
    }
  });

  it("should append data to empty json file", async () => {
    const testData = { test: "value" };
    await appendToJson(testData, testPath);

    const content = JSON.parse(fs.readFileSync(testPath, "utf8"));
    expect(content).toHaveLength(1);
    expect(content[0].test).toBe("value");
    expect(content[0].date).toBeDefined();
  });

  it("should append data to existing json file", async () => {
    const initialData = [{ initial: "data" }];
    fs.writeFileSync(testPath, JSON.stringify(initialData));

    const testData = { test: "value" };
    await appendToJson(testData, testPath);

    const content = JSON.parse(fs.readFileSync(testPath, "utf8"));
    expect(content).toHaveLength(2);
    expect(content[1].test).toBe("value");
  });

  it("should handle invalid json file", async () => {
    fs.writeFileSync(testPath, "invalid json");

    const testData = { test: "value" };
    await expect(appendToJson(testData, testPath)).rejects.toThrow();
  });
});
