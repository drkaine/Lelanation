import { contactService } from "../../src/service/ContactService";
import { Request, Response } from "express";
import { existsSync } from "fs";
import { readFile, writeFile, mkdir, readdir } from "fs/promises";

jest.mock("fs");
jest.mock("fs/promises");

describe("ContactService", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: "Test User",
        email: "test@example.com",
        message: "Test Message",
        subject: "bug",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("sendContact", () => {
    it("devrait créer un nouveau fichier si inexistant", async () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      (mkdir as jest.Mock).mockResolvedValue(undefined);
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await contactService.sendContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mkdir).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Contact enregistré avec succès",
      });
    });

    it("devrait ajouter au fichier existant", async () => {
      const existingData = [
        {
          date: new Date().toISOString(),
          name: "Old User",
          email: "old@example.com",
          message: "Old Message",
        },
      ];

      (existsSync as jest.Mock).mockReturnValue(true);
      (readFile as jest.Mock).mockResolvedValue(JSON.stringify(existingData));
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await contactService.sendContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(readFile).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();
      const writeFileCall = (writeFile as jest.Mock).mock.calls[0][1];
      const writtenData = JSON.parse(writeFileCall);
      expect(writtenData).toHaveLength(2);
      expect(writtenData[0]).toEqual(existingData[0]);
    });

    it("devrait gérer les erreurs", async () => {
      (existsSync as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
      });

      await contactService.sendContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de l'enregistrement du contact",
      });
    });

    it("devrait utiliser 'Anonyme' et email vide si pas de nom/email", async () => {
      mockRequest.body.name = "";
      mockRequest.body.email = "";
      (existsSync as jest.Mock).mockReturnValue(false);
      (mkdir as jest.Mock).mockResolvedValue(undefined);
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await contactService.sendContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      const writeFileCall = (writeFile as jest.Mock).mock.calls[0][1];
      const writtenData = JSON.parse(writeFileCall);
      expect(writtenData[0].name).toBe("Anonyme");
      expect(writtenData[0].email).toBe("");
    });
  });

  describe("getContact", () => {
    it("devrait récupérer et formater les contacts correctement", async () => {
      const mockFiles = ["bug.json", "suggestion.json"];
      const mockBugData = [
        {
          date: "2024-01-01",
          name: "User1",
          email: "user1@example.com",
          message: "Bug report",
        },
      ];
      const mockSuggestionData = [
        {
          date: "2024-01-02",
          name: "User2",
          email: "user2@example.com",
          message: "New feature",
        },
      ];

      (existsSync as jest.Mock).mockReturnValue(true);
      (readdir as jest.Mock).mockResolvedValue(mockFiles);
      (readFile as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockBugData))
        .mockResolvedValueOnce(JSON.stringify(mockSuggestionData));

      const cleanOldMessagesSpy = jest
        .spyOn(contactService, "cleanOldMessages")
        .mockResolvedValue(undefined);

      await contactService.getContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith([
        { category: "bug", messages: mockBugData },
        { category: "suggestion", messages: mockSuggestionData },
      ]);

      cleanOldMessagesSpy.mockRestore();
    });

    it("devrait gérer les erreurs de lecture", async () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      (readdir as jest.Mock).mockRejectedValue(new Error("Test error"));

      await contactService.getContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la récupération des contacts",
      });
    });
  });

  describe("deleteContact", () => {
    it("devrait supprimer un message spécifique", async () => {
      const mockMessages = [
        {
          date: "2024-01-01",
          name: "User1",
          email: "user1@example.com",
          message: "Message 1",
        },
        {
          date: "2024-01-02",
          name: "User2",
          email: "user2@example.com",
          message: "Message 2",
        },
      ];

      mockRequest.body = {
        category: "bug",
        date: "2024-01-01",
      };

      (readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockMessages));
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await contactService.deleteContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      const writeFileCall = (writeFile as jest.Mock).mock.calls[0][1];
      const writtenData = JSON.parse(writeFileCall);

      expect(writtenData).toHaveLength(1);
      expect(writtenData[0].date).toBe("2024-01-02");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Message supprimé",
      });
    });

    it("devrait gérer les erreurs lors de la suppression", async () => {
      mockRequest.body = {
        category: "bug",
        date: "2024-01-01",
      };

      (readFile as jest.Mock).mockRejectedValue(new Error("Test error"));

      await contactService.deleteContact(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la suppression du message",
      });
    });
  });
});
