import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * Service pour la gestion des assets statiques
 */
export class AssetService {
  /**
   * Liste les fichiers d'un répertoire avec filtrage par extension
   */
  async listFiles(req: Request, res: Response): Promise<void> {
    try {
      const { directory, extensions } = req.query;

      if (!directory || typeof directory !== "string") {
        res.status(400).json({ error: "Le paramètre 'directory' est requis" });
        return;
      }

      // Sécurité: nettoyer le chemin et vérifier qu'il est dans les répertoires autorisés
      const cleanDirectory = this.sanitizePath(directory);
      if (!this.isAllowedDirectory(cleanDirectory)) {
        res.status(403).json({ error: "Accès non autorisé à ce répertoire" });
        return;
      }

      // Construire le chemin absolu
      const baseDir = path.join(__dirname, "../..");
      const dirPath = path.join(baseDir, cleanDirectory);

      // Vérifier que le répertoire existe
      try {
        const stats = await stat(dirPath);
        if (!stats.isDirectory()) {
          res
            .status(404)
            .json({ error: "Le chemin spécifié n'est pas un répertoire" });
          return;
        }
      } catch {
        res.status(404).json({ error: "Répertoire non trouvé" });
        return;
      }

      // Lire le contenu du répertoire
      const files = await readdir(dirPath);

      // Filtrer par extensions si spécifiées
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

      // Construire les chemins relatifs pour le frontend
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

  /**
   * Nettoie un chemin pour éviter les attaques de traversée de répertoire
   */
  private sanitizePath(unsafePath: string): string {
    // Normaliser le chemin et supprimer les caractères dangereux
    const normalized = path
      .normalize(unsafePath)
      .replace(/^\.\.(\/|\\|$)+/, "")
      .replace(/[^a-zA-Z0-9/_.-]/g, "");

    return normalized;
  }

  /**
   * Vérifie si le répertoire est dans la liste des répertoires autorisés
   */
  private isAllowedDirectory(dirPath: string): boolean {
    const allowedDirectories = [
      "public",
      "public/assets",
      "public/assets/icons",
      "public/assets/images",
      "public/assets/files",
      "data",
    ];

    // Vérifier si le répertoire commence par l'un des préfixes autorisés
    return allowedDirectories.some(
      (allowed) => dirPath === allowed || dirPath.startsWith(`${allowed}/`),
    );
  }
}

export const assetService = new AssetService();
