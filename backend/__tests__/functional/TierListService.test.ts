import { uploadService } from "../../src/service/TierListService";
import { Request, Response } from "express";
import { convertOdsToJson } from "../../src/OdsToJson";
import fs from "fs/promises";
import path from "path";

jest.mock("../../src/OdsToJson");
jest.mock("fs/promises");
jest.mock("path");

describe("TierListService", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
    mockRequest = {
      file: {
        buffer: Buffer.from("test"),
        fieldname: "file",
        originalname: "test.ods",
        encoding: "7bit",
        mimetype: "application/vnd.oasis.opendocument.spreadsheet",
        size: 100,
      } as Express.Multer.File,
      params: {
        nameFolder: "testFolder",
      },
      body: {
        fileName: "customFileName",
      },
    };

    jest.clearAllMocks();
  });

  it("devrait retourner une erreur 400 si aucun fichier n'est fourni", async () => {
    mockRequest.file = undefined;
    await uploadService.uploadOds(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Aucun fichier fourni" });
  });

  it("devrait utiliser le nom de fichier personnalisé sans extension", async () => {
    const mockJsonData = { data: "test" };
    (convertOdsToJson as jest.Mock).mockResolvedValue(mockJsonData);
    (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

    await uploadService.uploadOds(
      mockRequest as Request,
      mockResponse as Response,
    );

    const writeFileCalls = (fs.writeFile as jest.Mock).mock.calls;
    expect(writeFileCalls[0][0]).toContain("customFileName.json");
  });

  it("devrait utiliser le nom de fichier personnalisé avec extension .ods", async () => {
    mockRequest.body.fileName = "customFileName.ods";
    const mockJsonData = { data: "test" };
    (convertOdsToJson as jest.Mock).mockResolvedValue(mockJsonData);
    (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

    await uploadService.uploadOds(
      mockRequest as Request,
      mockResponse as Response,
    );

    const writeFileCalls = (fs.writeFile as jest.Mock).mock.calls;
    expect(writeFileCalls[0][0]).toContain("customFileName.json");
  });

  it("devrait utiliser le nom par défaut si aucun nom n'est fourni", async () => {
    mockRequest.body.fileName = undefined;
    const mockJsonData = { data: "test" };
    (convertOdsToJson as jest.Mock).mockResolvedValue(mockJsonData);
    (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

    await uploadService.uploadOds(
      mockRequest as Request,
      mockResponse as Response,
    );

    const writeFileCalls = (fs.writeFile as jest.Mock).mock.calls;
    expect(writeFileCalls[0][0]).toContain("tierlist.json");
  });

  it("devrait gérer les erreurs et retourner un statut 500", async () => {
    const error = new Error("Test error");
    (convertOdsToJson as jest.Mock).mockRejectedValue(error);

    await uploadService.uploadOds(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Erreur lors du traitement du fichier",
      details: "Test error",
    });
  });

  describe("getAllTierLists", () => {
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

    it("devrait retourner la liste des fichiers par catégorie", async () => {
      const mockFiles = {
        normal: ["file1.json", "file2.json", "file1-123456.json"],
        bronze: ["file3.json"],
        pro: ["file4.json", "file4-123456.json"],
      };

      (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
      (fs.readdir as jest.Mock).mockImplementation((path) => {
        if (path.includes("normal")) return mockFiles.normal;
        if (path.includes("bronze")) return mockFiles.bronze;
        if (path.includes("pro")) return mockFiles.pro;
        return [];
      });

      await uploadService.getAllTierLists(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        normal: ["file1", "file2", "file1-123456"],
        bronze: ["file3"],
        pro: ["file4", "file4-123456"],
      });
    });

    it("devrait gérer les dossiers manquants", async () => {
      (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
      (fs.readdir as jest.Mock).mockRejectedValue(new Error("ENOENT"));

      await uploadService.getAllTierLists(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        normal: [],
        bronze: [],
        pro: [],
      });
    });

    it("devrait gérer les erreurs générales", async () => {
      const error = new Error("Test error");
      (path.join as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await uploadService.getAllTierLists(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erreur lors de la récupération des tier lists",
      });
    });

    it("devrait filtrer les fichiers de date", async () => {
      const mockFiles = ["file1.json", "file1-123456.json", "file2.json"];

      (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);

      await uploadService.getAllTierLists(
        mockRequest as Request,
        mockResponse as Response,
      );

      const result = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(result.normal).toContain("file1-123456");
      expect(result.normal).toContain("file1");
      expect(result.normal).toContain("file2");
    });
  });

  describe("File Operations", () => {
    beforeEach(() => {
      (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);
      (fs.rename as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue([]);
    });

    describe("deleteFile", () => {
      it("devrait supprimer un fichier avec succès", async () => {
        const mockRequest = {
          params: {
            category: "normal",
            fileName: "test",
          },
        };

        await uploadService.deleteFile(
          mockRequest as unknown as Request,
          mockResponse as Response,
        );

        expect(fs.unlink).toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith({
          message: "Fichier supprimé avec succès",
        });
      });

      it("devrait gérer les erreurs de suppression", async () => {
        (fs.unlink as jest.Mock).mockRejectedValue(new Error("Erreur test"));

        const mockRequest = {
          params: {
            category: "normal",
            fileName: "test",
          },
        };

        await uploadService.deleteFile(
          mockRequest as unknown as Request,
          mockResponse as Response,
        );

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
          error: "Erreur lors de la suppression du fichier",
        });
      });
    });

    describe("toggleVisibility", () => {
      it("devrait modifier la visibilité avec succès", async () => {
        const mockRequest = {
          params: {
            category: "normal",
            fileName: "test",
          },
          body: {
            newFileName: "private_test",
          },
        };

        await uploadService.toggleVisibility(
          mockRequest as unknown as Request,
          mockResponse as Response,
        );

        expect(fs.rename).toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith({
          message: "Visibilité modifiée avec succès",
        });
      });

      it("devrait gérer les erreurs de modification de visibilité", async () => {
        (fs.rename as jest.Mock).mockRejectedValue(new Error("Erreur test"));

        const mockRequest = {
          params: {
            category: "normal",
            fileName: "test",
          },
          body: {
            newFileName: "private_test",
          },
        };

        await uploadService.toggleVisibility(
          mockRequest as unknown as Request,
          mockResponse as Response,
        );

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
          error: "Erreur lors du changement de visibilité",
        });
      });
    });
  });
});
