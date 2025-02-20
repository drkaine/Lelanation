import path from "path";
import { Request, Response } from "express";
import { appendToJson } from "../FileManager";
import fs from "fs/promises";
export const dictionnaireService = {
  filePath: path.join(
    __dirname,
    "../../../frontend/src/assets/files/dictionnaire/dictionnaire-propositions.json",
  ),

  async saveDictionnaire(req: Request, res: Response) {
    try {
      await appendToJson(req.body, dictionnaireService.filePath);
      res.sendStatus(200);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      res.status(500).send("Erreur lors de la sauvegarde");
    }
  },

  async getDictionnaire(req: Request, res: Response) {
    try {
      const dictionnaire = await fs.readFile(
        dictionnaireService.filePath,
        "utf8",
      );
      res.json(JSON.parse(dictionnaire));
    } catch (error) {
      console.error("Erreur lors de la récupération du dictionnaire:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération du dictionnaire",
      });
    }
  },
};
