import { read, utils } from "xlsx-js-style";
import { type TierListData } from "./types";

export const convertOdsToJson = async (
  fileBuffer: Buffer,
): Promise<TierListData> => {
  try {
    const workbook = read(fileBuffer, {
      type: "buffer",
      cellFormula: false,
      cellStyles: true,
      raw: true,
    });

    const result: TierListData = {
      GRAPH: [],
      TOPLANE: [],
      JUNGLE: [],
      MIDLANE: [],
      "ADC-BOT": [],
      SUPPORT: [],
      TierList: [],
      Resultats: [],
    };

    const sheetMapping: Record<string, keyof TierListData> = {
      GRAPH: "GRAPH",
      TOPLANE: "TOPLANE",
      JUNGLE: "JUNGLE",
      MIDLANE: "MIDLANE",
      "ADC-BOT": "ADC-BOT",
      SUPPORT: "SUPPORT",
      TIERLIST: "TierList",
      RESULTATS: "Resultats",
    };

    workbook.SheetNames.forEach((sheetName) => {
      const mappedName = sheetMapping[sheetName.toUpperCase()];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(sheet) as Record<string, unknown>[];

      result[mappedName] = jsonData
        .filter((row) =>
          Object.values(row).some((value) => value !== null && value !== ""),
        )
        .map((row) => {
          const newRow: Record<string, unknown> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (key.startsWith("__EMPTY_")) {
              newRow[`Column${key.replace("__EMPTY_", "")}`] = value;
            } else if (key.startsWith("__EMPTY")) {
              newRow[`Column${key.replace("__EMPTY", "")}`] = value;
            } else if (key.endsWith("_1")) {
              newRow.image = value;
            } else if (key.endsWith("_2")) {
              newRow.name = value;
            } else {
              newRow[key] = value;
            }
          });
          return newRow;
        });
    });

    return result;
  } catch (error) {
    console.error("Erreur lors de la conversion ODS vers JSON:", error);
    throw new Error("Échec de la conversion du fichier ODS");
  }
};
