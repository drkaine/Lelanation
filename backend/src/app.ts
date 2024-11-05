import express from "express";
import cron from "node-cron";
import { compilation } from "./Cron";

const app = express();
const PORT = process.env.PORT || 3000;

cron.schedule("0 0,12 * * *", () => {
  console.log("Tâche cron exécutée à 00h00 et 12h00");
  compilation();
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
