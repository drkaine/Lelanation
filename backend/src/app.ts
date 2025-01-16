import express from "express";
import cron from "node-cron";
import { save, appendToJson } from "./FileManager";
import { compilation } from "./Cron";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { unlink } from "fs/promises";
import fs from "fs/promises";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://www.dev.lelanation.darkaine.fr",
    "https://www.lelanation.darkaine.fr",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3500;

app.use(express.json());

app.post("/api/save/:filename", (req, res) => {
  const filename = req.params.filename;
  const data = req.body;

  save(
    JSON.stringify(data),
    path.join(
      __dirname,
      "../../frontend/public/assets/files/build/" + filename,
    ),
  );
  res.sendStatus(200);
});

app.post("/api/dictionnaire", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../frontend/src/assets/files/dictionnaire-proposition.json",
    );

    await appendToJson(req.body, filePath);
    res.sendStatus(200);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    res.status(500).send("Erreur lors de la sauvegarde");
  }
});

app.delete("/api/build/:fileName", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/",
      req.params.fileName,
    );
    await unlink(filePath);
    res.status(200).send("Build supprimé");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur lors de la suppression:", errorMessage);
    res.status(500).send(`Erreur lors de la suppression: ${errorMessage}`);
  }
});

app.get("/api/build/:fileName", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/",
      req.params.fileName,
    );
    const data = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).send("Build non trouvé" + error);
  }
});

app.get("/api/builds/lelariva", async (req, res) => {
  try {
    const buildsDir = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/",
    );
    const files = await fs.readdir(buildsDir);
    const builds = await Promise.all(
      files
        .filter(file => file.toLowerCase().startsWith('lelariva'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(buildsDir, file), "utf8");
          return JSON.parse(content);
        }),
    );
    res.json(builds);
  } catch (error) {
    res.status(404).send("Build non trouvé" + error);
  }
});

app.get("/api/builds", async (req, res) => {
  try {
    const buildsDir = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/",
    );
    const files = await fs.readdir(buildsDir);
    const builds = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(buildsDir, file), "utf8");
        return JSON.parse(content);
      }),
    );
    res.json(builds);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des builds" + error);
  }
});

cron.schedule("0 0,12 * * *", () => {
  console.log("Tâche cron exécutée à 00h00 et 12h00");
  compilation();
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
