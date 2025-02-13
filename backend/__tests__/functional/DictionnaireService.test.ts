import { dictionnaireService } from "../../src/service/DictionnaireService";
import { appendToJson } from "../../src/FileManager";
import { Request, Response } from "express";
import path from "path";

jest.mock("../../src/FileManager");
jest.mock("path");

describe("DictionnaireService", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: { mot: "test", definition: "définition test" },
    };

    mockResponse = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("saveDictionnaire", () => {
    it("devrait sauvegarder une entrée dans le dictionnaire avec succès", async () => {
      (path.join as jest.Mock).mockReturnValue("chemin/mock/dictionnaire.json");
      (appendToJson as jest.Mock).mockResolvedValue(undefined);

      await dictionnaireService.saveDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(appendToJson).toHaveBeenCalledWith(
        mockRequest.body,
        expect.any(String),
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it("devrait gérer les erreurs lors de la sauvegarde", async () => {
      const errorMessage = "Erreur test";
      (appendToJson as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await dictionnaireService.saveDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "Erreur lors de la sauvegarde",
      );
    });

    it("devrait utiliser le bon chemin de fichier", async () => {
      const expectedPath =
        "../../../frontend/src/assets/files/dictionnaire/dictionnaire-propositions.json";
      (appendToJson as jest.Mock).mockResolvedValue(undefined);

      await dictionnaireService.saveDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(path.join).toHaveBeenCalledWith(expect.any(String), expectedPath);
    });
  });
});
