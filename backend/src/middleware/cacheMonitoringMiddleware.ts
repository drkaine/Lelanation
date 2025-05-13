import { Request, Response, NextFunction } from "express";

interface CacheMetrics {
  hits: number;
  misses: number;
  bypasses: number;
  totalRequests: number;
  statusCodes: Record<string, number>;
  routeStats: Record<
    string,
    {
      hits: number;
      misses: number;
      bypasses: number;
      totalRequests: number;
    }
  >;
  lastReset: Date;
}

const cacheMetrics: CacheMetrics = {
  hits: 0,
  misses: 0,
  bypasses: 0,
  totalRequests: 0,
  statusCodes: {},
  routeStats: {},
  lastReset: new Date(),
};

export const cacheMonitoringMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = process.hrtime();
    const route = `${req.method} ${req.originalUrl.split("?")[0]}`;

    if (!cacheMetrics.routeStats[route]) {
      cacheMetrics.routeStats[route] = {
        hits: 0,
        misses: 0,
        bypasses: 0,
        totalRequests: 0,
      };
    }

    const end = res.end;
    res.end = function (
      this: Response,
      chunk?: unknown,
      encoding?: BufferEncoding | (() => void),
      cb?: () => void,
    ): Response {
      const diff = process.hrtime(startTime);
      const responseTime = (diff[0] * 1e9 + diff[1]) / 1e6;

      cacheMetrics.totalRequests++;
      cacheMetrics.routeStats[route].totalRequests++;

      const statusCode = res.statusCode.toString();
      if (!cacheMetrics.statusCodes[statusCode]) {
        cacheMetrics.statusCodes[statusCode] = 0;
      }
      cacheMetrics.statusCodes[statusCode]++;

      const cacheHeader = res.getHeader("X-Cache");
      if (cacheHeader === "HIT") {
        cacheMetrics.hits++;
        cacheMetrics.routeStats[route].hits++;
      } else if (cacheHeader === "MISS") {
        cacheMetrics.misses++;
        cacheMetrics.routeStats[route].misses++;
      } else if (cacheHeader === "BYPASS") {
        cacheMetrics.bypasses++;
        cacheMetrics.routeStats[route].bypasses++;
      }

      res.setHeader("X-Response-Time", `${responseTime.toFixed(2)}ms`);

      if (typeof encoding === "function") {
        cb = encoding;
        encoding = undefined;
      }

      return end.call(this, chunk, encoding as BufferEncoding, cb);
    };

    next();
  };
};

export const cacheMetricsRoute = (req: Request, res: Response): void => {
  const hitRatio =
    cacheMetrics.totalRequests > 0
      ? ((cacheMetrics.hits / cacheMetrics.totalRequests) * 100).toFixed(2) +
        "%"
      : "0%";

  const metrics = {
    ...cacheMetrics,
    hitRatio,
    uptime: Math.floor(
      (new Date().getTime() - cacheMetrics.lastReset.getTime()) / 1000,
    ),
    timestamp: new Date().toISOString(),
  };

  res.json(metrics);
};

export const resetCacheMetricsRoute = (req: Request, res: Response): void => {
  cacheMetrics.hits = 0;
  cacheMetrics.misses = 0;
  cacheMetrics.bypasses = 0;
  cacheMetrics.totalRequests = 0;
  cacheMetrics.statusCodes = {};
  cacheMetrics.routeStats = {};
  cacheMetrics.lastReset = new Date();

  res.json({
    message: "Cache metrics reset successfully",
    timestamp: new Date().toISOString(),
  });
};
