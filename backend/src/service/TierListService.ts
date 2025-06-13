import fs from "fs/promises";
import { Request, Response } from "express";
import { convertOdsToJson } from "../OdsToJson";
import path from "path";

export const uploadService = {
  async uploadOds(req: Request, res: Response) {
    const nameFolder = req.params.nameFolder + "/";
    let fileName = req.body.fileName || "tierlist";

    if (!fileName.toLowerCase().endsWith(".ods")) {
      fileName += ".ods";
    }

    const jsonFileName = fileName.replace(/\.ods$/i, "");

    try {
      if (!req.file) {
        res.status(400).json({ error: "Aucun fichier fourni" });
        return;
      }

      const jsonData = await convertOdsToJson(req.file.buffer);

      const outputPath = path.join(
        __dirname,
        `../../../frontend/public/assets/files/tiers-listes/${nameFolder}${jsonFileName}.json`,
      );

      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2));

      const date = new Date();
      const dateFilePath = path.join(
        __dirname,
        `../../../frontend/public/assets/files/tiers-listes/${nameFolder}${jsonFileName}-${date.getTime()}`,
      );

      await fs.writeFile(dateFilePath, JSON.stringify(date));

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

  async getAllTierLists(req: Request, res: Response) {
    try {
      const baseDir = path.join(
        __dirname,
        "../../../frontend/public/assets/files/tiers-listes",
      );

      const categories = ["normal", "bronze", "pro"];
      const result: Record<string, string[]> = {};

      for (const category of categories) {
        const categoryPath = path.join(baseDir, category);
        try {
          const files = await fs.readdir(categoryPath);
          result[category] = files
            .filter((file) => file.endsWith(".json"))
            .filter((file) => !/-\d{13,}$/.test(file.replace(".json", "")))
            .map((file) => file.replace(".json", ""));
        } catch {
          result[category] = [];
        }
      }

      res.json(result);
    } catch (error) {
      console.error("Erreur lors de la récupération des tier lists:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des tier lists",
      });
    }
  },

  async deleteFile(req: Request, res: Response) {
    try {
      const { category, fileName } = req.params;
      const filePath = path.join(
        __dirname,
        `../../../frontend/public/assets/files/tiers-listes/${category}/${fileName}.json`,
      );

      await fs.unlink(filePath);

      try {
        const dateFiles = await fs.readdir(path.dirname(filePath));
        const matchingDateFile = dateFiles.find((file) =>
          file.startsWith(`${fileName}-`),
        );
        if (matchingDateFile) {
          await fs.unlink(path.join(path.dirname(filePath), matchingDateFile));
        }
      } catch (error) {
        console.error(
          "Erreur lors de la suppression du fichier de date:",
          error,
        );
      }

      res.json({ message: "Fichier supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du fichier" });
    }
  },

  async toggleVisibility(req: Request, res: Response) {
    try {
      const { category, fileName } = req.params;
      const { newFileName } = req.body;

      const oldPath = path.join(
        __dirname,
        `../../../frontend/public/assets/files/tiers-listes/${category}/${fileName}.json`,
      );

      const newPath = path.join(
        __dirname,
        `../../../frontend/public/assets/files/tiers-listes/${category}/${newFileName}.json`,
      );

      await fs.rename(oldPath, newPath);

      try {
        const dateFiles = await fs.readdir(path.dirname(oldPath));
        const matchingDateFile = dateFiles.find((file) =>
          file.startsWith(`${fileName}-`),
        );
        if (matchingDateFile) {
          const newDateFileName = matchingDateFile.replace(
            fileName,
            newFileName,
          );
          await fs.rename(
            path.join(path.dirname(oldPath), matchingDateFile),
            path.join(path.dirname(oldPath), newDateFileName),
          );
        }
      } catch (error) {
        console.error("Erreur lors du renommage du fichier de date:", error);
      }

      res.json({ message: "Visibilité modifiée avec succès" });
    } catch (error) {
      console.error("Erreur lors du changement de visibilité:", error);
      res
        .status(500)
        .json({ error: "Erreur lors du changement de visibilité" });
    }
  },
};
