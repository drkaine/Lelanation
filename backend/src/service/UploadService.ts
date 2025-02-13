import fs from "fs/promises";
import { Request, Response } from "express";
import { convertOdsToJson } from "../OdsToJson";
import path from "path";

export const uploadService = {
  async uploadOds(req: Request, res: Response) {
    const nameFolder = req.params.nameFolder + "/";
    try {
      if (!req.file) {
        res.status(400).json({ error: "Aucun fichier fourni" });
        return;
      }

      const jsonData = await convertOdsToJson(req.file.buffer);

      const outputPath = path.join(
        __dirname,
        `../../../frontend/public/assets/files/tiers-listes/${nameFolder}tierlist.json`,
      );

      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2));

      res.json({
        message: "Fichier converti et sauvegardé avec succès",
        data: jsonData,
      });
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
      res.status(500).json({
        error: "Erreur lors du traitement du fichier",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  },
};
