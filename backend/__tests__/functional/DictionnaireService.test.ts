import { dictionnaireService } from "../../src/service/DictionnaireService";
import { Request, Response } from "express";
import { appendToJson } from "../../src/FileManager";
import * as fs from "fs/promises";

jest.mock("../../src/FileManager");
jest.mock("fs/promises");
jest.mock("path");

describe("DictionnaireService", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: { mot: "test", definition: "définition test" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("saveDictionnaire", () => {
    it("devrait sauvegarder une entrée dans le dictionnaire avec succès", async () => {
      (appendToJson as jest.Mock).mockResolvedValue(undefined);

      await dictionnaireService.saveDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(appendToJson).toHaveBeenCalledWith(
        mockRequest.body,
        dictionnaireService.filePath,
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it("devrait gérer les erreurs de sauvegarde", async () => {
      (appendToJson as jest.Mock).mockRejectedValue(new Error("Erreur test"));

      await dictionnaireService.saveDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "Erreur lors de la sauvegarde",
      );
    });
  });

  describe("getDictionnaire", () => {
    it("devrait récupérer le dictionnaire avec succès", async () => {
      const mockData = { mots: ["test"] };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await dictionnaireService.getDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(fs.readFile).toHaveBeenCalledWith(
        dictionnaireService.filePath,
        "utf8",
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("devrait gérer les erreurs de lecture", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("Erreur test"));

      await dictionnaireService.getDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la récupération du dictionnaire",
      });
    });
  });
});
