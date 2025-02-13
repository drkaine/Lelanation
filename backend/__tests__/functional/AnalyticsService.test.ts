import { analyticsService } from "../../src/service/AnalyticsService";
import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

jest.mock("fs/promises");
jest.mock("path");

describe("AnalyticsService", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("incrementVisitCounter", () => {
    it("devrait incrémenter le compteur quand le fichier existe", async () => {
      const initialData = { visiteur: 5 };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(initialData));
      (path.join as jest.Mock).mockReturnValue("chemin/mock/analytics.json");

      const result = await analyticsService.incrementVisitCounter();

      expect(result).toEqual({ visiteur: 6 });
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify({ visiteur: 6 }, null, 2),
      );
    });

    it("devrait créer un nouveau fichier si celui-ci n'existe pas", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("File not found"));
      (path.dirname as jest.Mock).mockReturnValue("chemin/mock");

      const result = await analyticsService.incrementVisitCounter();

      expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), {
        recursive: true,
      });
      expect(result).toEqual({ visiteur: 1 });
    });

    it("devrait gérer les erreurs générales", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(
        new Error("Erreur inattendue"),
      );
      (fs.writeFile as jest.Mock).mockRejectedValue(
        new Error("Erreur écriture"),
      );

      const result = await analyticsService.incrementVisitCounter();

      expect(result).toBeNull();
    });
  });

  describe("saveAnalytics", () => {
    it("devrait sauvegarder et renvoyer les analytics avec succès", async () => {
      const mockData = { visiteur: 42 };
      jest
        .spyOn(analyticsService, "incrementVisitCounter")
        .mockResolvedValue(mockData);

      await analyticsService.saveAnalytics(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("devrait gérer les erreurs lors de la sauvegarde", async () => {
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
});
