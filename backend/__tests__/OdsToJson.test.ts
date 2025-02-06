import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { convertOdsToJson } from "../src/OdsToJson";
import { read, utils } from "xlsx-js-style";

jest.mock("xlsx-js-style", () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));

describe("convertOdsToJson", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("devrait convertir les __EMPTY_ en Column", async () => {
    const mockWorkbook = {
      SheetNames: ["TOPLANE"],
      Sheets: { TOPLANE: {} },
    };

    const mockInputData = [
      {
        __EMPTY_2: 100,
        __EMPTY_3: 20,
        __EMPTY_4: 1.5,
      },
    ];

    const expectedOutput = [
      {
        Column2: 100,
        Column3: 20,
        Column4: 1.5,
      },
    ];

    (read as jest.Mock).mockReturnValue(mockWorkbook);
    (utils.sheet_to_json as jest.Mock).mockReturnValue(mockInputData);

    const result = await convertOdsToJson(Buffer.from("test"));
    expect(result.TOPLANE).toEqual(expectedOutput);
  });

  it("devrait convertir les suffixes _1 et _2 en image et name", async () => {
    const mockWorkbook = {
      SheetNames: ["TOPLANE"],
      Sheets: { TOPLANE: {} },
    };

    const mockInputData = [
      {
        champion_1: "aatrox-img",
        champion_2: "Aatrox",
      },
    ];

    const expectedOutput = [
      {
        image: "aatrox-img",
        name: "Aatrox",
      },
    ];

    (read as jest.Mock).mockReturnValue(mockWorkbook);
    (utils.sheet_to_json as jest.Mock).mockReturnValue(mockInputData);

    const result = await convertOdsToJson(Buffer.from("test"));
    expect(result.TOPLANE).toEqual(expectedOutput);
  });

  it("devrait filtrer les lignes vides", async () => {
    const mockWorkbook = {
      SheetNames: ["TOPLANE"],
      Sheets: { TOPLANE: {} },
    };

    const mockInputData = [
      { __EMPTY_2: 100 },
      { __EMPTY_2: "" },
      { __EMPTY_2: null },
      { __EMPTY_2: 200 },
    ];

    (read as jest.Mock).mockReturnValue(mockWorkbook);
    (utils.sheet_to_json as jest.Mock).mockReturnValue(mockInputData);

    const result = await convertOdsToJson(Buffer.from("test"));
    expect(result.TOPLANE).toHaveLength(2);
  });

  it("devrait gérer toutes les feuilles du classeur", async () => {
    const mockWorkbook = {
      SheetNames: ["TOPLANE", "JUNGLE", "MIDLANE"],
      Sheets: {
        TOPLANE: {},
        JUNGLE: {},
        MIDLANE: {},
      },
    };

    const mockData = [{ __EMPTY_2: 100 }];

    (read as jest.Mock).mockReturnValue(mockWorkbook);
    (utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);

    const result = await convertOdsToJson(Buffer.from("test"));
    expect(result.TOPLANE).toBeDefined();
    expect(result.JUNGLE).toBeDefined();
    expect(result.MIDLANE).toBeDefined();
  });

  it("devrait gérer les erreurs", async () => {
    (read as jest.Mock).mockImplementation(() => {
      throw new Error("Erreur test");
    });

    await expect(convertOdsToJson(Buffer.from("test"))).rejects.toThrow(
      "Échec de la conversion du fichier ODS",
    );
  });
});
