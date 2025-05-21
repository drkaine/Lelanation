import express from "express";
import cron from "node-cron";
import { upload } from "./FileManager";
import { compilation, execution } from "./Cron";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { Request, Response } from "express";
import { config } from "./config";
import { buildService } from "./service/BuildService";
import { type MulterRequest } from "./types";
import { dictionnaireService } from "./service/DictionnaireService";
import { analyticsService } from "./service/AnalyticsService";
import { uploadService } from "./service/TierListService";
import { contactService } from "./service/ContactService";
import { connectRedis } from "./utils/redisClient";
import {
  cacheMiddleware,
  invalidateCacheMiddleware,
} from "./middleware/cacheMiddleware";
import {
  staticAssetsCache,
  apiCache,
  shortLivedCache,
  staticJsonCache,
} from "./middleware/httpCacheMiddleware";
import {
  cacheMonitoringMiddleware,
  cacheMetricsRoute,
  resetCacheMetricsRoute,
} from "./middleware/cacheMonitoringMiddleware";
import maintainRedisCache from "./scripts/redisCacheMaintenance";
import { assetService } from "./service/AssetService";
import { serverHealth } from "./utils/serverUtils";

dotenv.config();

let redisConnected = false;

async function initRedis() {
  try {
    redisConnected = await connectRedis();

    if (redisConnected) {
      console.log(
        `Serveur en cours d'exécution sur le port ${PORT} avec cache Redis`,
      );

      setInterval(async () => {
        if (!serverHealth.isRedisAvailable()) {
          console.log("Connexion Redis perdue, tentative de reconnexion...");
          await serverHealth.tryReconnectRedis();
        }
      }, 30000);
    } else {
      console.log(
        `Serveur en cours d'exécution sur le port ${PORT} sans cache Redis`,
      );

      setInterval(async () => {
        console.log("Tentative de reconnexion Redis programmée...");
        const reconnected = await serverHealth.tryReconnectRedis();
        if (reconnected) {
          redisConnected = true;
          console.log("Reconnexion Redis réussie!");
        }
      }, 60000);
    }
  } catch (err) {
    redisConnected = false;
    console.error(
      "Erreur lors de la connexion à Redis, le cache ne sera pas disponible:",
      err,
    );
    console.log(
      `Serveur en cours d'exécution sur le port ${PORT} sans cache Redis`,
    );

    setTimeout(initRedis, 10000);
  }
}

initRedis();

const app = express();

app.use(cacheMonitoringMiddleware());

app.use(cors(config.cors));

const PORT = process.env.PORT || 3500;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

if (process.env.SERVE_STATIC === "true") {
  const staticDir = path.join(__dirname, "../public");
  app.use(
    "/static",
    staticAssetsCache,
    express.static(staticDir, {
      maxAge: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
    }),
  );
}

const dataDir = path.join(__dirname, "../data");
app.use(
  "/data",
  staticJsonCache,
  express.static(dataDir, {
    maxAge: 1 * 60 * 60 * 1000, // 1 heure en millisecondes
  }),
);

app.get(
  "/api/analytics",
  shortLivedCache,
  cacheMiddleware({ ttl: 60 }),
  async (req, res) => {
    analyticsService.getAnalytics(req, res);
  },
);

app.post(
  "/api/analytics",
  invalidateCacheMiddleware(["analytics:*"]),
  async (req, res) => {
    analyticsService.saveAnalytics(req, res);
  },
);

app.post(
  "/api/save/:filename",
  invalidateCacheMiddleware(["builds:*"]),
  async (req, res) => {
    buildService.saveBuild(req, res);
  },
);
app.post(
  "/api/save/lelariva/:filename",
  invalidateCacheMiddleware(["builds:lelariva:*"]),
  async (req, res) => {
    buildService.saveLelarivaBuild(req, res);
  },
);
app.put(
  "/api/update/:filename",
  invalidateCacheMiddleware(["builds:*", `cache:/api/builds`]),
  async (req, res) => {
    buildService.updateBuild(req, res);
  },
);
app.put(
  "/api/update/lelariva/:filename",
  invalidateCacheMiddleware([
    "builds:lelariva:*",
    `cache:/api/builds/lelariva`,
  ]),
  async (req, res) => {
    buildService.updateLelarivaBuild(req, res);
  },
);
app.delete(
  "/api/build/:fileName",
  invalidateCacheMiddleware(["builds:*"]),
  async (req, res) => {
    buildService.deleteBuild(req, res);
  },
);
app.delete(
  "/api/build/lelariva/:fileName",
  invalidateCacheMiddleware(["builds:lelariva:*"]),
  async (req, res) => {
    buildService.deleteLelarivaBuild(req, res);
  },
);

app.get(
  "/api/build/:fileName",
  apiCache,
  cacheMiddleware({
    ttl: 3600,
    keyFn: (req) => `builds:${req.params.fileName}`,
    bypassCache: (req: Request) => req.query.nocache === "true",
  }),
  async (req, res) => {
    buildService.getBuild(req, res);
  },
);

app.get(
  "/api/build/lelariva/:fileName",
  apiCache,
  cacheMiddleware({
    ttl: 3600,
    keyFn: (req) => `builds:lelariva:${req.params.fileName}`,
    bypassCache: (req: Request) => req.query.nocache === "true",
  }),
  async (req, res) => {
    buildService.getLelarivaBuild(req, res);
  },
);

app.get(
  "/api/builds/lelariva",
  apiCache,
  cacheMiddleware({
    ttl: 300,
    bypassCache: (req: Request) => req.query.nocache === "true",
  }),
  async (req, res) => {
    buildService.getAllLelarivaBuilds(req, res);
  },
);

app.get(
  "/api/builds",
  apiCache,
  cacheMiddleware({
    ttl: 300,
    bypassCache: (req: Request) => req.query.nocache === "true",
  }),
  async (req, res) => {
    buildService.getAllBuilds(req, res);
  },
);

app.post(
  "/api/dictionnaire",
  invalidateCacheMiddleware(["dictionnaire:*"]),
  async (req, res) => {
    dictionnaireService.saveDictionnaire(req, res);
  },
);
app.get(
  "/api/dictionnaire",
  apiCache,
  cacheMiddleware({ ttl: 3600 }),
  async (req, res) => {
    dictionnaireService.getDictionnaire(req, res);
  },
);

app.post(
  "/api/dictionnaire/approve",
  invalidateCacheMiddleware(["dictionnaire:*"]),
  dictionnaireService.approveDictionnaire,
);
app.post(
  "/api/dictionnaire/reject",
  invalidateCacheMiddleware(["dictionnaire:*"]),
  dictionnaireService.rejectDictionnaire,
);

app.post(
  "/api/contact",
  invalidateCacheMiddleware(["contact:*"]),
  async (req, res) => {
    contactService.sendContact(req, res);
  },
);

app.get(
  "/api/contact",
  shortLivedCache,
  cacheMiddleware({ ttl: 300 }),
  async (req, res) => {
    contactService.getContact(req, res);
  },
);

app.post(
  "/api/tierlist/upload/:nameFolder",
  invalidateCacheMiddleware(["tierlist:*"]),
  upload.single("file"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    uploadService.uploadOds(req, res);
  },
);

app.delete(
  "/api/tierlist/:category/:fileName",
  invalidateCacheMiddleware(["tierlist:*"]),
  uploadService.deleteFile,
);

app.put(
  "/api/tierlist/:category/:fileName",
  invalidateCacheMiddleware(["tierlist:*"]),
  uploadService.toggleVisibility,
);

app.get(
  "/api/tierlist/all",
  apiCache,
  cacheMiddleware({ ttl: 1800 }), // 30 minutes de cache
  uploadService.getAllTierLists,
);

app.get("/api/assets/list", (req, res) => {
  assetService.listFiles(req, res);
});

app.get("/api/metrics/cache", cacheMetricsRoute);
app.post("/api/metrics/cache/reset", resetCacheMetricsRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    redis: serverHealth.getRedisStatus(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

cron.schedule("0 4 * * *", () => {
  console.log("Exécution de la maintenance du cache Redis à 04h00");
  maintainRedisCache()
    .then(() => console.log("Maintenance du cache Redis terminée"))
    .catch((err) =>
      console.error("Erreur lors de la maintenance du cache Redis:", err),
    );
});

cron.schedule("0 * * * *", () => {
  const heure = new Date().getHours();
  console.log(`Tâche cron exécutée à ${heure}h00`);
  compilation();
  console.log("Tâche cron finie");
});

cron.schedule("0 2 * * *", () => {
  console.log("Tâche cron exécutée à 02h00");
  execution();
});

app.listen(PORT, () => {
  console.log(
    `Serveur en cours d'exécution sur le port ${PORT} avec cache Redis`,
  );
});

export default app;
