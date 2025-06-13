import path from "path";
import fs from "fs/promises";
import { Request, Response } from "express";

export const analyticsService = {
  analyticsPath: path.join(
    __dirname,
    "../../../frontend/src/assets/files/analytics.json",
  ),

  async incrementVisitCounter() {
    try {
      let analytics = { visiteur: 0 };

      try {
        const data = await fs.readFile(analyticsService.analyticsPath, "utf8");
        analytics = JSON.parse(data);
        analytics.visiteur++;

        await fs.writeFile(
          analyticsService.analyticsPath,
          JSON.stringify(analytics, null, 2),
        );
      } catch {
        const dir = path.dirname(analyticsService.analyticsPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(
          analyticsService.analyticsPath,
          JSON.stringify(analytics, null, 2),
        );
      }

      return analytics;
    } catch (err) {
      console.error("Erreur compteur:", err);
      return null;
    }
  },

  async saveAnalytics(req: Request, res: Response) {
    try {
      console.log("📈 POST Analytics called");
      const data = await analyticsService.incrementVisitCounter();
      console.log("📊 Data after increment:", data);
      if (!data) {
        throw new Error("Erreur lors de l'incrémentation");
      }
      res.json(data);
    } catch (error) {
      console.error("❌ Error in saveAnalytics:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de l'incrémentation du compteur" });
    }
  },

  async getAnalytics(req: Request, res: Response) {
    try {
      console.log("🔍 GET Analytics called");
      console.log("📁 Analytics path:", analyticsService.analyticsPath);

      const analytics = await fs.readFile(
        analyticsService.analyticsPath,
        "utf8",
      );
      const parsedData = JSON.parse(analytics);
      console.log("✅ Analytics data retrieved:", parsedData);
      res.json(parsedData);
    } catch (error) {
      console.error("❌ Error in getAnalytics:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des données d'analyse",
      });
    }
  },
};
