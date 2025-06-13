import express from "express";
import cron from "node-cron";
import { upload } from "./FileManager";
import { compilation, execution } from "./Cron";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { Request, Response, NextFunction } from "express";
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
import { RouteValidationService } from "./service/routeValidationService";
import { spaFallbackMiddleware } from "./middleware/spaFallback";

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
  cacheMiddleware({
    ttl: 60,
    bypassCache: (req: Request) => req.query.nocache === "true",
  }),
  async (req, res) => {
    analyticsService.getAnalytics(req, res);
  },
);

app.post(
  "/api/analytics",
  invalidateCacheMiddleware(["cache:/api/analytics*"]),
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
  invalidateCacheMiddleware(["cache:/api/dictionnaire*"]),
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
  invalidateCacheMiddleware(["cache:/api/dictionnaire*"]),
  dictionnaireService.approveDictionnaire,
);
app.post(
  "/api/dictionnaire/reject",
  invalidateCacheMiddleware(["cache:/api/dictionnaire*"]),
  dictionnaireService.rejectDictionnaire,
);

app.post(
  "/api/contact",
  invalidateCacheMiddleware(["cache:/api/contact*"]),
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

app.delete(
  "/api/contact",
  invalidateCacheMiddleware(["cache:/api/contact*"]),
  async (req, res) => {
    contactService.deleteContact(req, res);
  },
);

app.post(
  "/api/tierlist/upload/:nameFolder",
  invalidateCacheMiddleware(["cache:/api/tierlist*"]),
  upload.single("file"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    uploadService.uploadOds(req, res);
  },
);

app.delete(
  "/api/tierlist/:category/:fileName",
  invalidateCacheMiddleware(["cache:/api/tierlist*"]),
  uploadService.deleteFile,
);

app.put(
  "/api/tierlist/:category/:fileName",
  invalidateCacheMiddleware(["cache:/api/tierlist*"]),
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

const routeValidationService = new RouteValidationService();

app.get("/api/validate-route", (req: Request, res: Response): void => {
  try {
    const path = req.query.path as string;

    if (!path) {
      res.status(400).json({ error: "Path parameter required" });
      return;
    }

    const result = routeValidationService.validateRoute(path);

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error validating route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/api/discord/share",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: "Message requis" });
        return;
      }

      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

      if (!webhookUrl) {
        res.status(500).json({ error: "Configuration Discord manquante" });
        return;
      }

      const discordPayload = {
        content: message,
        username: "Lelariva Bot",
        avatar_url: "https://lelanation.com/favicon.ico",
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordPayload),
      });

      if (!response.ok) {
        throw new Error(`Erreur Discord: ${response.status}`);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Erreur partage Discord:", error);
      res.status(500).json({ error: "Erreur lors du partage vers Discord" });
    }
  },
);

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

// SPA fallback middleware for all non-API routes
app.use(spaFallbackMiddleware(path.join(__dirname, "../../frontend/dist")));

// 404 handler for all unmatched routes (including Express errors)
app.use('*', (req: Request, res: Response) => {
  // Skip API routes (let them return their normal errors)
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Route API non trouvée' });
    return;
  }
  
  // For all other routes, return SPA HTML with proper meta tags
  const indexPath = path.join(__dirname, "../../frontend/dist/index.html");
  res.status(404);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      res.send('<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>404</title></head><body>Page non trouvée</body></html>');
      return;
    }
    
    const modifiedHtml = data.replace(
      "<head>",
      `<head>
    <meta name="http-status" content="404">
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="Page non trouvée - La page demandée n'existe pas.">
    <title>404 - Page non trouvée | Lelanation</title>`
    );
    
    res.send(modifiedHtml);
  });
});

app.listen(PORT, () => {
  console.log(
    `Serveur en cours d'exécution sur le port ${PORT} avec cache Redis`,
  );
});

export default app;
