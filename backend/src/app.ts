import express from "express";
import cron from "node-cron";
import { save } from "./FileManager";
import { compilation } from "./Cron";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { unlink } from "fs/promises";

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
    path.join(__dirname, "../../frontend/src/assets/build/" + filename),
  );
  res.sendStatus(200);
});

app.delete("/api/build/:fileName", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../frontend/src/assets/build/",
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

cron.schedule("0 0,12 * * *", () => {
  console.log("Tâche cron exécutée à 00h00 et 12h00");
  compilation();
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
