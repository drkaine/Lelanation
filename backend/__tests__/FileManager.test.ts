import { save } from "../src/FileManager";
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

      save(JSON.stringify(data), filePath);

      expect(fs.existsSync(filePath)).toBe(true);

      fs.unlinkSync(filePath);
    },
  );

  it.each(datas)(
    "%s folder",
    async (data: string | Buffer, extension: string) => {
      filePath = filePath + extension;

      save(JSON.stringify(data), filePath);

      expect(fs.existsSync(dirPath)).toBe(true);

      fs.unlinkSync(filePath);
      fs.rmdirSync(dirPath);
    },
  );
});
