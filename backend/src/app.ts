import express from "express";
import cron from "node-cron";
import { save, appendToJson } from "./FileManager";
import { compilation } from "./Cron";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { unlink } from "fs/promises";
import fs from "fs/promises";
import { exec } from "child_process";
import { existsSync } from "fs";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://www.dev.lelanation.darkaine.fr",
    "https://www.lelanation.darkaine.fr",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3500;

app.use(express.json());

const incrementVisitCounter = async () => {
  try {
    const analyticsPath = path.join(__dirname, '../../frontend/public/assets/files/analytics.json')
    
    let analytics = { visiteur: 0 }
    
    try {
      const data = await fs.readFile(analyticsPath, 'utf8')
      analytics = JSON.parse(data)
    } catch (error) {
      const dir = path.dirname(analyticsPath)
      await fs.mkdir(dir, { recursive: true })
      
      await fs.writeFile(analyticsPath, JSON.stringify(analytics, null, 2))
    }
    
    analytics.visiteur++
    
    await fs.writeFile(analyticsPath, JSON.stringify(analytics, null, 2))
    
    return analytics
  } catch (error) {
    console.error('Erreur compteur:', error)
    return null
  }
}

app.post('/api/analytics', async (req, res) => {
  try {
    const data = await incrementVisitCounter()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'incrémentation du compteur' })
  }
})

app.post("/api/save/:filename", (req, res) => {
  const filename = req.params.filename;
  const data = req.body;

  if (data.id.includes("lelariva")) {
    const filename = req.params.filename.replace("lelariva_", "");
    save(
      JSON.stringify(data),
      path.join(
        __dirname,
        "../../frontend/public/assets/files/build/Lelariva/" + filename,
      ),
    );
  } else {
    save(
      JSON.stringify(data),
      path.join(
        __dirname,
        "../../frontend/public/assets/files/build/" + filename,
      ),
    );
  }
  res.sendStatus(200);
});

app.put("/api/update/:filename", async (req, res) => {
  try {
    const data = req.body;
    let filePath = "";
    let filename = "";

    if (data.id.includes("lelariva")) {
      filename = req.params.filename.replace("lelariva_", "");
      filePath = path.join(
        __dirname,
        "../../frontend/public/assets/files/build/Lelariva/" + filename,
      );
    } else {
      filename = req.params.filename;
      filePath = path.join(
        __dirname,
        "../../frontend/public/assets/files/build/" + filename,
      );
    }

    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }

    await save(JSON.stringify(data), filePath);
    res.sendStatus(200);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    res.status(500).send("Erreur lors de la mise à jour du fichier");
  }
});

app.delete("/api/build/:fileName", async (req, res) => {
  try {
    let filePath = "";
    if (req.params.fileName.includes("wait")) {
      filePath = path.join(
        __dirname,
        "../../frontend/public/assets/files/build/Lelariva/",
        req.params.fileName,
      );
    } else {
      filePath = path.join(
        __dirname,
        "../../frontend/public/assets/files/build/",
        req.params.fileName,
      );
    }
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
    let filePath = "";
    if (req.params.fileName.includes("lelariva")) {
      const name = req.params.fileName.replace("lelariva_", "");
      filePath = path.join(
        __dirname,
        "../../frontend/public/assets/files/build/Lelariva/" + name,
      );
    } else {
      filePath = path.join(
        __dirname,
        "../../frontend/public/assets/files/build/",
        req.params.fileName,
      );
    }
    const data = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).send("Build non trouvé" + error);
  }
});

app.put("/api/build/:filename", (req, res) => {
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
      "../../frontend/src/assets/files/dictionnaire/dictionnaire-proposition.json",
    );

    await appendToJson(req.body, filePath);
    res.sendStatus(200);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    res.status(500).send("Erreur lors de la sauvegarde");
  }
});

app.get("/api/builds/lelariva", async (req, res) => {
  try {
    const buildsDir = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/Lelariva/",
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

cron.schedule("0 0 * * *", () => {
  console.log("Tâche cron exécutée à 00h00");

  exec("bash ../.github/.scripts/deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur d'exécution: ${error}`);
      return;
    }
    console.log(`Sortie du déploiement: ${stdout}`);
    if (stderr) {
      console.error(`Erreurs du déploiement: ${stderr}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
