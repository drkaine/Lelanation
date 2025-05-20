import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export class AssetService {
  async listFiles(req: Request, res: Response): Promise<void> {
    try {
      const { directory, extensions } = req.query;

      if (!directory || typeof directory !== "string") {
        res.status(400).json({ error: "Le paramètre 'directory' est requis" });
        return;
      }

      const cleanDirectory = this.sanitizePath(directory);
      if (!this.isAllowedDirectory(cleanDirectory)) {
        console.error(`Accès refusé au répertoire: ${directory} (nettoyé en: ${cleanDirectory})`);
        res.status(403).json({ error: "Accès non autorisé à ce répertoire" });
        return;
      }

      const baseDir = process.cwd();
      console.log(`Répertoire de travail actuel: ${baseDir}`);
      
      const projectRoot = baseDir.endsWith('/backend') 
        ? path.dirname(baseDir)
        : baseDir;
        
      let actualDirectory = cleanDirectory;
      if (cleanDirectory === "data") {
        actualDirectory = "frontend/src/assets/files/data";
        console.log(`Remappage spécial du chemin: ${cleanDirectory} -> ${actualDirectory}`);
      } else if (cleanDirectory.startsWith("public/") || cleanDirectory.startsWith("src/")) {
        actualDirectory = `frontend/${cleanDirectory}`;
        console.log(`Remappage du chemin: ${cleanDirectory} -> ${actualDirectory}`);
      }
        
      const dirPath = path.join(projectRoot, actualDirectory);

      console.log(`Tentative d'accès au répertoire: ${dirPath}`);

      try {
        const stats = await stat(dirPath);
        if (!stats.isDirectory()) {
          res
            .status(404)
            .json({ error: "Le chemin spécifié n'est pas un répertoire" });
          return;
        }
      } catch (err) {
        console.error(`Répertoire non trouvé: ${dirPath}`, err);
        res.status(404).json({ error: "Répertoire non trouvé" });
        return;
      }

      const files = await readdir(dirPath);

      let filteredFiles = files;
      if (extensions && typeof extensions === "string") {
        const extList = extensions
          .split(",")
          .map((ext) => ext.trim().toLowerCase());
        filteredFiles = files.filter((file) => {
          const ext = path.extname(file).toLowerCase().substring(1);
          return extList.includes(ext);
        });
      }

      const relativePaths = filteredFiles.map((file) => {
        return `${cleanDirectory.startsWith("/") ? "" : "/"}${cleanDirectory}/${file}`;
      });

      res.json(relativePaths);
    } catch (error) {
      console.error("Erreur lors de la lecture du répertoire:", error);
      res
        .status(500)
        .json({ error: "Erreur serveur lors de la lecture du répertoire" });
    }
  }

  private sanitizePath(unsafePath: string): string {
    let normalized = path
      .normalize(unsafePath)
      .replace(/^\.\.(\/|\\|$)+/, "")
      .replace(/[^a-zA-Z0-9/_.-]/g, "");
    
    normalized = normalized.replace(/^\/+/, "");
    
    return normalized;
  }

  private isAllowedDirectory(dirPath: string): boolean {
    const allowedDirectories = [
      "frontend/public",
      "frontend/public/assets",
      "frontend/public/assets/icons",
      "frontend/public/assets/images",
      "frontend/public/assets/files",
      "frontend/public/assets/tiers-listes",
      "frontend/src/assets/files",
      "frontend/src/assets/files/data",
      "frontend/src/assets/files/contact",
      "frontend/src/assets/files/dictionnaire",
      "frontend/src/assets/files/data-manuel",
    ];

    return allowedDirectories.some(
      (allowed) => dirPath === allowed || dirPath.startsWith(`${allowed}/`),
    );
  }
}

export const assetService = new AssetService();
