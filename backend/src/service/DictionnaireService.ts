import path from "path";
import { Request, Response } from "express";
import { appendToJson } from "../FileManager";

export const dictionnaireService = {
  async saveDictionnaire(req: Request, res: Response) {
    try {
      const filePath = path.join(
        __dirname,
        "../../../frontend/src/assets/files/dictionnaire/dictionnaire-propositions.json",
      );

      await appendToJson(req.body, filePath);
      res.sendStatus(200);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      res.status(500).send("Erreur lors de la sauvegarde");
    }
  },
};
