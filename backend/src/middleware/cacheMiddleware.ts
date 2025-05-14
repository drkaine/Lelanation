import { Request, Response, NextFunction } from "express";
import { redisUtils, isRedisAvailable } from "../utils/redisClient";

interface CacheOptions {
  ttl?: number;
  keyFn?: (req: Request) => string;
  bypassCache?: boolean;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (req.method !== "GET" || options.bypassCache) {
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
        Promise.all(patterns.map((pattern) => redisUtils.delByPattern(pattern)))
          .then(() => {
            console.log(
              `Cache invalidé pour les patterns: ${patterns.join(", ")}`,
            );
            if (!res.headersSent) {
              res.setHeader("X-Cache-Invalidated", patterns.join(","));
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
