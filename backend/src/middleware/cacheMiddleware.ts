import { Request, Response, NextFunction } from "express";
import { redisUtils, isRedisAvailable } from "../utils/redisClient";

interface CacheOptions {
  ttl?: number;
  keyFn?: (req: Request) => string;
  bypassCache?: boolean | ((req: Request) => boolean);
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const shouldBypassCache =
      typeof options.bypassCache === "function"
        ? options.bypassCache(req)
        : options.bypassCache;

    if (req.method !== "GET" || shouldBypassCache) {
      return next();
    }

    if (!isRedisAvailable()) {
      res.setHeader("X-Cache", "UNAVAILABLE");
      return next();
    }

    const generateCacheKey =
      options.keyFn || ((req: Request) => `cache:${req.originalUrl}`);
    const cacheKey = generateCacheKey(req);

    try {
      const cachedData = await redisUtils.get(cacheKey);

      if (cachedData) {
        console.log(`Cache hit for ${cacheKey}`);
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Cache-Key", cacheKey);
        res.json(cachedData);
        return;
      }

      res.setHeader("X-Cache", "MISS");
      res.setHeader("X-Cache-Key", cacheKey);

      const originalJson = res.json.bind(res);
      res.json = function (data) {
        res.json = originalJson;

        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisUtils
            .set(cacheKey, data, options.ttl)
            .catch((err) =>
              console.error(
                `Erreur lors du stockage dans le cache pour ${cacheKey}:`,
                err,
              ),
            );
          console.log(`Cache miss for ${cacheKey}, storing data`);
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error("Erreur dans le middleware de cache:", error);
      res.setHeader("X-Cache", "ERROR");
      next();
    }
  };
};

export const invalidateCacheMiddleware = (patterns: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalEnd = res.end;

    res.end = function (
      this: Response,
      chunk?: unknown,
      encoding?: BufferEncoding | (() => void),
      callback?: () => void,
    ) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const specificKeys: string[] = [];

        if (req.params.filename || req.params.fileName) {
          const fileName = req.params.filename || req.params.fileName;
          const path = req.path || "";

          if (path.includes("lelariva")) {
            specificKeys.push(`builds:lelariva:${fileName}`);
          } else {
            specificKeys.push(`builds:${fileName}`);
          }
        }

        if (patterns.some((p) => p.includes("builds:"))) {
          specificKeys.push("cache:/api/builds");
          specificKeys.push("cache:/api/builds/lelariva");
        }

        const invalidationTasks = [
          ...patterns.map((pattern) => redisUtils.delByPattern(pattern)),
          ...specificKeys.map((key) => redisUtils.del(key)),
        ];

        Promise.all(invalidationTasks)
          .then(() => {
            console.log(
              `Cache invalidé pour les patterns: ${patterns.join(", ")}`,
            );
            if (specificKeys.length > 0) {
              console.log(
                `Cache invalidé pour les clés spécifiques: ${specificKeys.join(", ")}`,
              );
            }

            if (!res.headersSent) {
              res.setHeader(
                "X-Cache-Invalidated",
                [...patterns, ...specificKeys].join(","),
              );
            }
          })
          .catch((err) =>
            console.error("Erreur lors de l'invalidation du cache:", err),
          );
      }

      if (typeof encoding === "function") {
        callback = encoding;
        encoding = undefined;
      }

      return originalEnd.call(
        this,
        chunk,
        encoding as BufferEncoding,
        callback,
      );
    };

    next();
  };
};
