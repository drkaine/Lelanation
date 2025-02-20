import { analyticsService } from "../../src/service/AnalyticsService";
import { Request, Response } from "express";
import * as fs from "fs/promises";

jest.mock("fs/promises");
jest.mock("path");

describe("AnalyticsService", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("incrementVisitCounter", () => {
    it("devrait incrémenter le compteur quand le fichier existe", async () => {
      const mockData = { visiteur: 5 };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await analyticsService.incrementVisitCounter();

      expect(result).toEqual({ visiteur: 6 });
      expect(fs.writeFile).toHaveBeenCalledWith(
        analyticsService.analyticsPath,
        JSON.stringify({ visiteur: 6 }, null, 2),
      );
    });

    it("devrait créer le fichier s'il n'existe pas", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("File not found"));
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await analyticsService.incrementVisitCounter();

      expect(result).toEqual({ visiteur: 0 });
      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalledWith(
        analyticsService.analyticsPath,
        JSON.stringify({ visiteur: 0 }, null, 2),
      );
    });

    it("devrait gérer les erreurs", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(
        new Error("Erreur inattendue"),
      );

      const result = await analyticsService.incrementVisitCounter();

      expect(result).toEqual({ visiteur: 0 });
    });
  });

  describe("saveAnalytics", () => {
    it("devrait sauvegarder avec succès", async () => {
      const mockData = { visiteur: 1 };
      jest
        .spyOn(analyticsService, "incrementVisitCounter")
        .mockResolvedValue(mockData);

      await analyticsService.saveAnalytics(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("devrait gérer les erreurs", async () => {
      jest
        .spyOn(analyticsService, "incrementVisitCounter")
        .mockRejectedValue(new Error("Erreur test"));

      await analyticsService.saveAnalytics(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de l'incrémentation du compteur",
      });
    });
  });

  describe("getAnalytics", () => {
    it("devrait récupérer les analytics avec succès", async () => {
      const mockData = { visiteur: 42 };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await analyticsService.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("devrait gérer les erreurs de lecture", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("Erreur test"));

      await analyticsService.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la récupération des données d'analyse",
      });
    });
  });
});
