import express from "express";
import cron from "node-cron";
import { upload } from "./FileManager";
import { compilation, execution } from "./Cron";
import cors from "cors";
import dotenv from "dotenv";

import { Response } from "express";
import { config } from "./config";
import { buildService } from "./service/BuildService";
import { type MulterRequest } from "./types";
import { dictionnaireService } from "./service/DictionnaireService";
import { analyticsService } from "./service/AnalyticsService";
import { uploadService } from "./service/UploadService";

dotenv.config();

const app = express();

app.use(cors(config.cors));

const PORT = process.env.PORT || 3500;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/api/analytics", async (req, res) => {
  analyticsService.saveAnalytics(req, res);
});

app.post("/api/save/:filename", async (req, res) => {
  buildService.saveBuild(req, res);
});
app.post("/api/save/lelariva/:filename", async (req, res) => {
  buildService.saveLelarivaBuild(req, res);
});
app.put("/api/update/:filename", async (req, res) => {
  buildService.updateBuild(req, res);
});
app.put("/api/update/lelariva/:filename", async (req, res) => {
  buildService.updateLelarivaBuild(req, res);
});
app.delete("/api/build/:fileName", async (req, res) => {
  buildService.deleteBuild(req, res);
});
app.delete("/api/build/lelariva/:fileName", async (req, res) => {
  buildService.deleteLelarivaBuild(req, res);
});
app.get("/api/build/:fileName", async (req, res) => {
  buildService.getBuild(req, res);
});
app.get("/api/build/lelariva/:fileName", async (req, res) => {
  buildService.getLelarivaBuild(req, res);
});
app.get("/api/builds/lelariva", async (req, res) => {
  buildService.getAllLelarivaBuilds(req, res);
});
app.get("/api/builds", async (req, res) => {
  buildService.getAllBuilds(req, res);
});
app.post("/api/dictionnaire", async (req, res) => {
  dictionnaireService.saveDictionnaire(req, res);
});

app.post(
  "/api/upload/ods/:nameFolder",
  upload.single("file"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    uploadService.uploadOds(req, res);
  },
);

cron.schedule("0 0,12 * * *", () => {
  console.log("Tâche cron exécutée à 00h00 et 12h00");
  compilation();
});

cron.schedule("0 2 * * *", () => {
  console.log("Tâche cron exécutée à 02h00");
  execution();
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

export default app;
