import { buildService } from "../../src/service/BuildService";
import { Request, Response } from "express";
import { saveFile, openFile } from "../../src/FileManager";
import { existsSync } from "fs";
import { unlink, readdir, readFile } from "fs/promises";

jest.mock("../../src/FileManager");
jest.mock("fs");
jest.mock("fs/promises");

describe("BuildService", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      params: {
        filename: "test.json",
        fileName: "test.json",
      },
      body: { data: "test" },
    };

    mockResponse = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("save", () => {
    it("devrait sauvegarder un fichier avec succès", async () => {
      (saveFile as jest.Mock).mockResolvedValue(undefined);

      await buildService.save(
        "",
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(saveFile).toHaveBeenCalled();
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe("update", () => {
    it("devrait mettre à jour un fichier existant", async () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      (unlink as jest.Mock).mockResolvedValue(undefined);
      (saveFile as jest.Mock).mockResolvedValue(undefined);

      await buildService.update(
        "",
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(unlink).toHaveBeenCalled();
      expect(saveFile).toHaveBeenCalled();
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe("delete", () => {
    it("devrait supprimer un fichier avec succès", async () => {
      (unlink as jest.Mock).mockResolvedValue(undefined);

      await buildService.delete(
        "",
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(unlink).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith("Build supprimé");
    });
  });

  describe("get", () => {
    it("devrait récupérer un fichier avec succès", async () => {
      const mockData = '{"test": "data"}';
      (openFile as jest.Mock).mockResolvedValue(mockData);

      await buildService.get(
        "",
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(openFile).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(JSON.parse(mockData));
    });
  });

  describe("méthodes spécifiques", () => {
    it("saveBuild devrait gérer les erreurs correctement", async () => {
      (saveFile as jest.Mock).mockRejectedValue(new Error("Erreur test"));

      await buildService.saveBuild(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la sauvegarde du fichier",
        details: expect.any(Error),
      });
    });
  });

  describe("getAll", () => {
    it("devrait récupérer tous les builds avec succès", async () => {
      const mockFiles = ["build1.json", "build2.json"];
      const mockContent1 = '{"name": "build1"}';
      const mockContent2 = '{"name": "build2"}';

      (readdir as jest.Mock).mockResolvedValue(mockFiles);
      (readFile as jest.Mock)
        .mockResolvedValueOnce(mockContent1)
        .mockResolvedValueOnce(mockContent2);

      await buildService.getAll("", mockResponse as Response);

      expect(readdir).toHaveBeenCalled();
      expect(readFile).toHaveBeenCalledTimes(2);
      expect(mockResponse.json).toHaveBeenCalledWith([
        JSON.parse(mockContent1),
        JSON.parse(mockContent2),
      ]);
    });
  });

  describe("méthodes spécifiques Lelariva", () => {
    it("saveLelarivaBuild devrait sauvegarder avec succès", async () => {
      (saveFile as jest.Mock).mockResolvedValue(undefined);

      await buildService.saveLelarivaBuild(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(saveFile).toHaveBeenCalled();
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it("updateLelarivaBuild devrait mettre à jour avec succès", async () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      (unlink as jest.Mock).mockResolvedValue(undefined);
      (saveFile as jest.Mock).mockResolvedValue(undefined);

      await buildService.updateLelarivaBuild(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(unlink).toHaveBeenCalled();
      expect(saveFile).toHaveBeenCalled();
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it("getAllLelarivaBuilds devrait gérer les erreurs", async () => {
      (readdir as jest.Mock).mockRejectedValue(new Error("Erreur test"));

      await buildService.getAllLelarivaBuilds(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Build non trouvé",
        details: expect.any(Error),
      });
    });
  });

  describe("gestion des erreurs", () => {
    it("deleteBuild devrait gérer les erreurs avec message personnalisé", async () => {
      const errorMessage = "Fichier non trouvé";
      (unlink as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await buildService.deleteBuild(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la suppression",
        details: errorMessage,
      });
    });

    it("getBuild devrait gérer les erreurs de fichier non trouvé", async () => {
      (openFile as jest.Mock).mockRejectedValue(
        new Error("Fichier non trouvé"),
      );

      await buildService.getBuild(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Build non trouvé",
        details: expect.any(Error),
      });
    });
  });
});
