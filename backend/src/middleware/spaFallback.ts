import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

const validRoutes = [
  "/",
  "/build",
  "/build/edit",
  "/builds",
  "/builds-publics",
  "/lelariva-builds",
  "/dictionnaire",
  "/dictionnaire/proposition",
  "/statistique",
  "/legal",
  "/videos",
];

const validPatterns = [/^\/connexion\/.+/, /^\/admin\/.+/, /^\/build\/.+/];

function isValidSPARoute(path: string): boolean {
  const normalizedPath = path.toLowerCase().replace(/\/$/, "") || "/";

  if (validRoutes.includes(normalizedPath)) {
    return true;
  }

  return validPatterns.some((pattern) => pattern.test(normalizedPath));
}

export function spaFallbackMiddleware(staticPath: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    if (req.path.includes(".") && !req.path.endsWith(".html")) {
      return next();
    }

    const indexPath = path.join(staticPath, "index.html");

    if (!fs.existsSync(indexPath)) {
      return res.status(404).send("Application not found");
    }

    if (!isValidSPARoute(req.path)) {
      res.status(404);

      fs.readFile(indexPath, "utf8", (err, data) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }

        const modifiedHtml = data.replace(
          "<head>",
          '<head>\n    <meta name="http-status" content="404">\n    <meta name="robots" content="noindex, nofollow">',
        );

        res.send(modifiedHtml);
      });
    } else {
      res.status(200).sendFile(indexPath);
    }
  };
}

export { isValidSPARoute, validRoutes, validPatterns };
