import { Request, Response, NextFunction } from "express";

interface HttpCacheOptions {
  maxAge?: number;
  isPublic?: boolean;
  vary?: string[];
  staleWhileRevalidate?: number;
  useEtag?: boolean;
}

export const httpCacheMiddleware = (options: HttpCacheOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return next();
    }

    const maxAge = options.maxAge || 0;
    const isPublic = options.isPublic !== false;
    const vary = options.vary || ["Accept", "Accept-Encoding"];
    const staleWhileRevalidate = options.staleWhileRevalidate || 0;
    const useEtag = options.useEtag !== false;

    let cacheControl = isPublic ? "public" : "private";
    cacheControl += `, max-age=${maxAge}`;

    if (staleWhileRevalidate > 0) {
      cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`;
    }

    res.setHeader("Cache-Control", cacheControl);
    res.setHeader("Vary", vary.join(", "));

    if (maxAge > 0) {
      const expiresDate = new Date(Date.now() + maxAge * 1000).toUTCString();
      res.setHeader("Expires", expiresDate);
    }

    if (useEtag) {
      res.setHeader("ETag", `"${Date.now().toString(36)}"`);
    }

    next();
  };
};

export const staticAssetsCache = httpCacheMiddleware({
  maxAge: 86400, // 24 heures
  isPublic: true,
  vary: ["Accept-Encoding"],
  staleWhileRevalidate: 43200, // 12 heures
  useEtag: true,
});

export const staticJsonCache = httpCacheMiddleware({
  maxAge: 3600, // 1 heure
  isPublic: true,
  vary: ["Accept", "Accept-Encoding"],
  staleWhileRevalidate: 7200, // 2 heures
  useEtag: true,
});

export const apiCache = httpCacheMiddleware({
  maxAge: 300, // 5 minutes
  isPublic: true,
  vary: ["Accept", "Accept-Encoding"],
  staleWhileRevalidate: 900, // 15 minutes
  useEtag: true,
});

export const shortLivedCache = httpCacheMiddleware({
  maxAge: 60, // 1 minute
  isPublic: true,
  vary: ["Accept", "Accept-Encoding"],
  staleWhileRevalidate: 300, // 5 minutes
  useEtag: true,
});

export const noCache = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};
