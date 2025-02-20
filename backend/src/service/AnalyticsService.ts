import path from "path";
import fs from "fs/promises";
import { Request, Response } from "express";

export const analyticsService = {
  incrementVisitCounter: async () => {
    try {
      const analyticsPath = path.join(
        __dirname,
        "../../../frontend/src/assets/files/analytics.json",
      );

      let analytics = { visiteur: 0 };

      try {
        const data = await fs.readFile(analyticsPath, "utf8");
        analytics = JSON.parse(data);
      } catch (error) {
        const dir = path.dirname(analyticsPath);
        await fs.mkdir(dir, { recursive: true });
        console.error(
          "Erreur lors de la lecture du fichier analytics.json:",
          error,
        );
        await fs.writeFile(analyticsPath, JSON.stringify(analytics, null, 2));
      }

      analytics.visiteur++;

      await fs.writeFile(analyticsPath, JSON.stringify(analytics, null, 2));

      return analytics;
    } catch (error) {
      console.error("Erreur compteur:", error);
      return null;
    }
  },

  async saveAnalytics(req: Request, res: Response) {
    try {
      const data = await this.incrementVisitCounter();
      res.json(data);
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de l'incrémentation du compteur" });
    }
  },
};
