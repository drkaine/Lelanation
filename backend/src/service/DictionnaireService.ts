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

  async safeJsonParse<T>(content: string, defaultValue: T): Promise<T> {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("Erreur de parsing JSON:", error);
      try {
        const cleaned = content
          .replace(/\]\]$/, "]")
          .replace(/,\s*\]$/, "]")
          .replace(/\}\}$/, "}");
        return JSON.parse(cleaned);
      } catch (repairError) {
        console.error("Impossible de réparer le JSON:", repairError);
        return defaultValue;
      }
    }
  },

  async ensureFileExists(filePath: string, defaultContent: string = "[]") {
    try {
      await fs.access(filePath);
    } catch {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, defaultContent);
    }
  },

  async saveDictionnaire(req: Request, res: Response) {
    try {
      await dictionnaireService.ensureFileExists(
        dictionnaireService.propositionsPath,
      );
      await appendToJson(req.body, dictionnaireService.propositionsPath);
      res.sendStatus(200);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      res.status(500).send("Erreur lors de la sauvegarde");
    }
  },

  async getDictionnaire(req: Request, res: Response) {
    try {
      await dictionnaireService.ensureFileExists(
        dictionnaireService.propositionsPath,
      );

      const dictionnaire = await fs.readFile(
        dictionnaireService.propositionsPath,
        "utf8",
      );

      const parsed = await dictionnaireService.safeJsonParse(dictionnaire, []);
      res.json(parsed);
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

      await dictionnaireService.ensureFileExists(
        dictionnaireService.dictionnaireValidePath,
        "{}",
      );

      const dictContent = await fs.readFile(
        dictionnaireService.dictionnaireValidePath,
        "utf8",
      );
      const dictionnaire: Record<string, string> =
        await dictionnaireService.safeJsonParse(dictContent, {});

      dictionnaire[word] = definition;

      await fs.writeFile(
        dictionnaireService.dictionnaireValidePath,
        JSON.stringify(dictionnaire, null, 2),
      );

      await dictionnaireService.removeProposition(word);

      res.status(200).json({ message: "Mot ajouté au dictionnaire" });
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      res.status(500).json({ error: "Erreur lors de la validation" });
    }
  },

  async rejectDictionnaire(req: Request, res: Response) {
    try {
      const { word } = req.body;
      await dictionnaireService.removeProposition(word);
      res.status(200).json({ message: "Proposition rejetée" });
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      res.status(500).json({ error: "Erreur lors du rejet" });
    }
  },

  async removeProposition(word: string) {
    try {
      await dictionnaireService.ensureFileExists(
        dictionnaireService.propositionsPath,
      );

      const proposContent = await fs.readFile(
        dictionnaireService.propositionsPath,
        "utf8",
      );
      const propositions = await dictionnaireService.safeJsonParse(
        proposContent,
        [],
      );
      const filteredPropositions = propositions.filter(
        (prop: { word: string }) => prop.word !== word,
      );
      await fs.writeFile(
        dictionnaireService.propositionsPath,
        JSON.stringify(filteredPropositions, null, 2),
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de proposition:", error);
      throw error;
    }
  },
};
