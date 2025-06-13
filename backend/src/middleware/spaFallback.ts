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
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    if (req.path.includes(".") && !req.path.endsWith(".html")) {
      return next();
    }

    const indexPath = path.join(staticPath, "index.html");

    if (!fs.existsSync(indexPath)) {
      res.status(404).send("Application not found");
      return;
    }

    const isValid = isValidSPARoute(req.path);

    fs.readFile(indexPath, "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }

      let modifiedHtml = data;

      // Définir les headers de contenu avec charset
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      
      if (!isValid) {
        res.status(404);
        
        modifiedHtml = data.replace(
          "<head>",
          `<head>
    <meta name="http-status" content="404">
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="Page non trouvée - La page demandée n'existe pas.">
    <title>404 - Page non trouvée | Lelanation</title>`
        );
      } else {
        res.status(200);
        
        modifiedHtml = data.replace(
          "<head>",
          '<head>\n    <meta name="http-status" content="200">'
        );
      }

      res.send(modifiedHtml);
    });
  };
}

export { isValidSPARoute, validRoutes, validPatterns };
