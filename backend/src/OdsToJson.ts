import { read, utils } from "xlsx-js-style";

interface ChampionData {
  champion?: string;
  TOP?: string;
  JNG?: string;
  MID?: string;
  SUP?: string;
  "Counter highlight"?: string;
  Couleur?: string;
  "Rappel Tech"?: string;
  Lane?: string;
  id?: string;
  "ORDER BY"?: string;
  WINRATE?: string | number;
  PICKRATE?: string | number;
  PRO?: string;
  LIMIT?: string | number;
  Custom?: string;
  [key: string]: unknown;
}

interface TierListData {
  GRAPH: ChampionData[];
  TOPLANE: ChampionData[];
  JUNGLE: ChampionData[];
  MIDLANE: ChampionData[];
  "ADC-BOT": ChampionData[];
  SUPPORT: ChampionData[];
  TierList: ChampionData[];
  Resultats: ChampionData[];
}

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
