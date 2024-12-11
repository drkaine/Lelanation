import express from "express";
import cron from "node-cron";
import { save } from "./FileManager";
import { compilation } from "./Cron";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://www.dev.lelandriva.darkaine.fr",
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

cron.schedule("0 0,12 * * *", () => {
  console.log("Tâche cron exécutée à 00h00 et 12h00");
  compilation();
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
