import { Request, Response } from "express";
import path from "path";
import { saveFile, openFile } from "../FileManager";
import { existsSync } from "fs";
import { unlink, readFile, readdir } from "fs/promises";

export const buildService = {
  path: path.join(process.cwd(), "../frontend/public/assets/files/build/"),

  async save(folder: string, req: Request, res: Response) {
    let { filename } = req.params;
    if (!filename.endsWith(".json")) {
      filename += ".json";
    }
    const data = req.body;
    const filePath = path.join(this.path, folder, filename);
    console.log(filePath);
    await saveFile(JSON.stringify(data), filePath);
    res.sendStatus(200);
  },

  async update(folder: string, req: Request, res: Response) {
    const data = req.body;

    let { filename } = req.params;
    if (!filename.endsWith(".json")) {
      filename += ".json";
    }
    const filePath = path.join(this.path, folder, filename);
    console.log(filePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    await saveFile(JSON.stringify(data), filePath);
    res.sendStatus(200);
  },

  async delete(folder: string, req: Request, res: Response) {
    let fileName = req.params.fileName;
    if (!fileName.endsWith(".json")) {
      fileName += ".json";
    }

    const filePath = path.join(this.path, folder, fileName);
    console.log(filePath);
    await unlink(filePath);
    res.status(200).send("Build supprimé");
  },

  async get(folder: string, req: Request, res: Response) {
    let fileName = req.params.fileName;
    if (!fileName.endsWith(".json")) {
      fileName += ".json";
    }

    const filePath = path.join(this.path, folder, fileName);

    if (!existsSync(filePath)) {
      res.status(404).json({ error: "Build not found" });
      return;
    }

    const data = await openFile(filePath);
    res.json(JSON.parse(data));
  },

  async getAll(folder: string, res: Response) {
    const buildsDir = path.join(this.path, folder);
    const files = await readdir(buildsDir);

    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const builds = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await readFile(path.join(buildsDir, file), "utf8");
        return JSON.parse(content);
      }),
    );
    res.json(builds);
  },

  async saveBuild(req: Request, res: Response) {
    try {
      await this.save("", req, res);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      res.status(500).json({
        error: "Erreur lors de la sauvegarde du fichier",
        details: error,
      });
    }
  },

  async saveLelarivaBuild(req: Request, res: Response) {
    try {
      await this.save("Lelariva/", req, res);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      res.status(500).json({
        error: "Erreur lors de la sauvegarde du fichier",
        details: error,
      });
    }
  },

  async updateBuild(req: Request, res: Response) {
    try {
      await this.update("", req, res);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      res.status(500).json({
        error: "Erreur lors de la mise à jour du fichier",
        details: error,
      });
    }
  },

  async updateLelarivaBuild(req: Request, res: Response) {
    try {
      await this.update("Lelariva/", req, res);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      res.status(500).json({
        error: "Erreur lors de la mise à jour du fichier",
        details: error,
      });
    }
  },

  async deleteBuild(req: Request, res: Response) {
    try {
      await this.delete("", req, res);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur lors de la suppression:", errorMessage);
      res.status(500).json({
        error: "Erreur lors de la suppression",
        details: errorMessage,
      });
    }
  },

  async deleteLelarivaBuild(req: Request, res: Response) {
    try {
      await this.delete("Lelariva/", req, res);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur lors de la suppression:", errorMessage);
      res.status(500).json({
        error: "Erreur lors de la suppression",
        details: errorMessage,
      });
    }
  },

  async getBuild(req: Request, res: Response) {
    try {
      await this.get("", req, res);
    } catch (error) {
      res.status(404).json({ error: "Build non trouvé", details: error });
    }
  },

  async getLelarivaBuild(req: Request, res: Response) {
    try {
      await this.get("Lelariva/", req, res);
    } catch (error) {
      res.status(404).json({ error: "Build non trouvé", details: error });
    }
  },

  async getAllBuilds(req: Request, res: Response) {
    try {
      await this.getAll("", res);
    } catch (error) {
      res.status(500).json({
        error: "Erreur lors de la récupération des builds",
        details: error,
      });
    }
  },

  async getAllLelarivaBuilds(req: Request, res: Response) {
    try {
      await this.getAll("Lelariva/", res);
    } catch (error) {
      res.status(404).json({ error: "Build non trouvé", details: error });
    }
  },
};
