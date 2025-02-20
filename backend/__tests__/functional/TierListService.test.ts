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
});
