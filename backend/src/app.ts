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
import { convertOdsToJson } from "./OdsToJson";
import multer from "multer";
import { Request, Response } from "express";

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/vnd.oasis.opendocument.spreadsheet") {
      cb(null, true);
    } else {
      cb(new Error("Format de fichier non supporté. Utilisez .ods"));
    }
  },
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const incrementVisitCounter = async () => {
  try {
    const analyticsPath = path.join(
      __dirname,
      "../../frontend/public/assets/files/analytics.json",
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
};

app.post("/api/analytics", async (req, res) => {
  try {
    const data = await incrementVisitCounter();
    res.json(data);
  } catch (error) {
    console.error("Erreur lors de l'incrémentation du compteur:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'incrémentation du compteur" });
  }
});

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

app.post("/api/save/lelariva/:filename", (req, res) => {
  const filename = req.params.filename;
  const data = req.body;

  save(
    JSON.stringify(data),
    path.join(
      __dirname,
      "../../frontend/public/assets/files/build/Lelariva/" + filename,
    ),
  );

  res.sendStatus(200);
});

app.put("/api/update/:filename", async (req, res) => {
  try {
    const data = req.body;

    const filename = req.params.filename;
    const filePath = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/" + filename,
    );

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

app.put("/api/update/lelariva/:filename", async (req, res) => {
  try {
    const data = req.body;

    const filename = req.params.filename;
    const filePath = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/Lelariva/" + filename,
    );

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

app.delete("/api/build/lelariva/:fileName", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/Lelariva/",
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

app.get("/api/build/lelariva/:fileName", async (req, res) => {
  try {
    const filename = req.params.fileName;
    const filePath = path.join(
      __dirname,
      "../../frontend/public/assets/files/build/Lelariva/" + filename,
    );

    const data = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).send("Build non trouvé" + error);
  }
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

app.post(
  "/api/upload/ods/:nameFolder",
  upload.single("file"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    const nameFolder = req.params.nameFolder + "/";
    try {
      if (!req.file) {
        res.status(400).json({ error: "Aucun fichier fourni" });
        return;
      }

      const jsonData = await convertOdsToJson(req.file.buffer);

      const outputPath = path.join(
        __dirname,
        `../../frontend/public/assets/files/tiers-listes/${nameFolder}tierlist.json`,
      );

      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2));

      res.json({
        message: "Fichier converti et sauvegardé avec succès",
        data: jsonData,
      });
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
      res.status(500).json({
        error: "Erreur lors du traitement du fichier",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  },
);

cron.schedule("0 0,12 * * *", () => {
  console.log("Tâche cron exécutée à 00h00 et 12h00");
  compilation();
});

cron.schedule("0 2 * * *", () => {
  console.log("Tâche cron exécutée à 02h00");

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

export default app;
