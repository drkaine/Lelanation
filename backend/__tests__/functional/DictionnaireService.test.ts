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
      body: {
        word: "testWord",
        definition: "testDefinition",
      },
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
        dictionnaireService.propositionsPath,
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
        dictionnaireService.propositionsPath,
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

  describe("approveDictionnaire", () => {
    it("devrait ajouter un mot au dictionnaire et supprimer la proposition", async () => {
      const mockDictionnaire = { existingWord: "definition" };
      const mockPropositions = [
        { word: "testWord", definition: "testDefinition" },
        { word: "otherWord", definition: "otherDefinition" },
      ];

      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockDictionnaire))
        .mockResolvedValueOnce(JSON.stringify(mockPropositions));

      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await dictionnaireService.approveDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(fs.writeFile).toHaveBeenCalledWith(
        dictionnaireService.dictionnaireValidePath,
        expect.stringContaining("testWord"),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Mot ajouté au dictionnaire",
      });
    });

    it("devrait gérer les erreurs lors de la validation", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("Test error"));

      await dictionnaireService.approveDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la validation",
      });
    });
  });

  describe("rejectDictionnaire", () => {
    it("devrait supprimer une proposition", async () => {
      const mockPropositions = [
        { word: "testWord", definition: "testDefinition" },
        { word: "otherWord", definition: "otherDefinition" },
      ];

      (fs.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPropositions),
      );
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await dictionnaireService.rejectDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(fs.writeFile).toHaveBeenCalledWith(
        dictionnaireService.propositionsPath,
        expect.not.stringContaining("testWord"),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Proposition rejetée",
      });
    });

    it("devrait gérer les erreurs lors du rejet", async () => {
      (fs.access as jest.Mock).mockRejectedValue(new Error("Test error"));
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error("Test error"));

      await dictionnaireService.rejectDictionnaire(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors du rejet",
      });
    });
  });

  describe("removeProposition", () => {
    it("devrait supprimer une proposition du fichier", async () => {
      const mockPropositions = [
        { word: "testWord", definition: "testDefinition" },
        { word: "otherWord", definition: "otherDefinition" },
      ];

      (fs.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify(mockPropositions),
      );
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await dictionnaireService.removeProposition("testWord");

      expect(fs.writeFile).toHaveBeenCalledWith(
        dictionnaireService.propositionsPath,
        expect.not.stringContaining("testWord"),
      );
    });
  });
});
