import { uploadService } from "../../src/service/UploadService";
import { Request, Response } from "express";
import { convertOdsToJson } from "../../src/OdsToJson";
import fs from "fs/promises";
import path from "path";

jest.mock("../../src/OdsToJson");
jest.mock("fs/promises");
jest.mock("path");

describe("UploadService", () => {
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
    };
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

  it("devrait convertir et sauvegarder le fichier avec succès", async () => {
    const mockJsonData = { data: "test" };
    (convertOdsToJson as jest.Mock).mockResolvedValue(mockJsonData);
    (path.join as jest.Mock).mockReturnValue("test/path");

    await uploadService.uploadOds(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(fs.mkdir).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Fichier converti et sauvegardé avec succès",
      data: mockJsonData,
    });
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
