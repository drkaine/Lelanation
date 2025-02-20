import path from "path";
import { Request, Response } from "express";
import { appendToJson } from "../FileManager";
import fs from "fs/promises";

export const dictionnaireService = {
  propositionsPath: path.join(
    __dirname,
    "../../../frontend/src/assets/files/dictionnaire/dictionnaire-propositions.json",
  ),
  dictionnaireValidePath: path.join(
    __dirname,
    "../../../frontend/src/assets/files/dictionnaire/dictionnaire.json",
  ),

  async saveDictionnaire(req: Request, res: Response) {
    try {
      await appendToJson(req.body, dictionnaireService.propositionsPath);
      res.sendStatus(200);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      res.status(500).send("Erreur lors de la sauvegarde");
    }
  },

  async getDictionnaire(req: Request, res: Response) {
    try {
      const dictionnaire = await fs.readFile(
        dictionnaireService.propositionsPath,
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

  async approveDictionnaire(req: Request, res: Response) {
    try {
      const { word, definition } = req.body;

      const dictContent = await fs.readFile(
        dictionnaireService.dictionnaireValidePath,
        "utf8",
      );
      const dictionnaire = JSON.parse(dictContent);

      dictionnaire[word] = definition;

      await fs.writeFile(
        dictionnaireService.dictionnaireValidePath,
        JSON.stringify(dictionnaire, null, 2),
      );

      await dictionnaireService.removeProposition(word);

      res.status(200).json({ message: "Mot ajouté au dictionnaire" });
    } catch {
      res.status(500).json({ error: "Erreur lors de la validation" });
    }
  },

  async rejectDictionnaire(req: Request, res: Response) {
    try {
      const { word } = req.body;
      await dictionnaireService.removeProposition(word);
      res.status(200).json({ message: "Proposition rejetée" });
    } catch {
      res.status(500).json({ error: "Erreur lors du rejet" });
    }
  },

  async removeProposition(word: string) {
    const proposContent = await fs.readFile(
      dictionnaireService.propositionsPath,
      "utf8",
    );
    const propositions = JSON.parse(proposContent);
    const filteredPropositions = propositions.filter(
      (prop: { word: string }) => prop.word !== word,
    );
    await fs.writeFile(
      dictionnaireService.propositionsPath,
      JSON.stringify(filteredPropositions, null, 2),
    );
  },
};
