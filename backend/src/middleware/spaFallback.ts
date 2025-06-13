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

const routeMetaTags: { [key: string]: { title: string; description: string; url: string; image?: string } } = {
  "/": {
    title: "Lelanation - Builds et guides League of Legends par Lelariva",
    description: "Créez et partagez vos builds League of Legends. Guides détaillés, statistiques. La référence francophone pour optimiser votre gameplay LoL.",
    url: "https://www.lelanation.fr/",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  },
  "/dictionnaire": {
    title: "Dictionnaire Lelariva - Vocabulaire League of Legends | Lelanation",
    description: "Le dictionnaire officiel de la communauté Lelariva. Découvrez le vocabulaire unique de League of Legends et ses définitions.",
    url: "https://www.lelanation.fr/dictionnaire",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  },
  "/dictionnaire/proposition": {
    title: "Proposer une définition - Dictionnaire Lelariva | Lelanation",
    description: "Contribuez au dictionnaire Lelariva en proposant de nouveaux mots et définitions pour enrichir le vocabulaire League of Legends.",
    url: "https://www.lelanation.fr/dictionnaire/proposition",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  },
  "/legal": {
    title: "Mentions légales - Lelanation",
    description: "Mentions légales, conditions d'utilisation et politique de confidentialité de Lelanation, la plateforme League of Legends de Lelariva.",
    url: "https://www.lelanation.fr/legal",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  },
  "/build": {
    title: "Créateur de Build LoL - Générateur de builds personnalisés | Lelanation",
    description: "Créez vos builds League of Legends personnalisés avec notre générateur. Runes, objets, sorts et compétences optimisés pour dominer sur la Faille.",
    url: "https://www.lelanation.fr/build",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  },
  "/builds-publics": {
    title: "Builds Communautaires LoL - Découvrez les créations des joueurs | Lelanation",
    description: "Explorez les builds League of Legends créés par la communauté Lelanation. Stratégies, guides et builds optimisés partagés par les joueurs.",
    url: "https://www.lelanation.fr/builds-publics",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  },
  "/videos": {
    title: "Vidéos LoL - Shorts et guides League of Legends par Lelariva | Lelanation",
    description: "Découvrez les dernières vidéos YouTube de Lelariva : tier lists, builds, guides et analyses League of Legends pour améliorer votre gameplay.",
    url: "https://www.lelanation.fr/videos",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  },
  "/lelariva-builds": {
    title: "Builds Officiels Lelariva - Guides exclusifs LoL | Lelanation",
    description: "Découvrez les builds officiels de Lelariva pour League of Legends. Stratégies exclusives, guides détaillés et analyses approfondies.",
    url: "https://www.lelanation.fr/lelariva-builds",
    image: "https://www.lelanation.fr/assets/images/lelariva.webp"
  }
};

function getMetaTagsForRoute(path: string) {
  const normalizedPath = path.toLowerCase().replace(/\/$/, "") || "/";
  
  if (normalizedPath.startsWith("/build/") && normalizedPath !== "/build") {
    const buildName = normalizedPath.split("/build/")[1];
    const decodedBuildName = decodeURIComponent(buildName);
    return {
      title: `Build ${decodedBuildName} - Guide LoL | Lelanation`,
      description: `Guide build ${decodedBuildName} pour League of Legends. Runes, objets, sorts et ordre des compétences détaillés par Lelariva.`,
      url: `https://www.lelanation.fr/build/${buildName}`,
      image: "https://www.lelanation.fr/assets/images/lelariva.webp"
    };
  }
  
  return routeMetaTags[normalizedPath] || routeMetaTags["/"];
}

export function spaFallbackMiddleware(staticPath: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    if (req.path.endsWith(".json")) {
      res.status(404).json({ error: "File not found" });
      return;
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

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      
      if (!isValid) {
        res.status(404);
        
        modifiedHtml = data.replace(
          "<head>",
          `<head>
    <meta name="http-status" content="404">
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="Page non trouvée - La page demandée n'existe pas.">
    <title>404 - Page non trouvée | Lelanation</title>
    <meta property="og:title" content="404 - Page non trouvée | Lelanation">
    <meta property="og:description" content="Page non trouvée - La page demandée n'existe pas.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.lelanation.fr${req.path}">
    <meta property="og:image" content="https://www.lelanation.fr/assets/images/lelariva.webp">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="404 - Page non trouvée | Lelanation">
    <meta name="twitter:description" content="Page non trouvée - La page demandée n'existe pas.">
    <meta name="twitter:site" content="@Lelariva_fr">
    <meta name="twitter:creator" content="@Lelariva_fr">
    <meta name="twitter:image" content="https://www.lelanation.fr/assets/images/lelariva.webp">`
        );
      } else {
        res.status(200);
        
        const metaTags = getMetaTagsForRoute(req.path);
        
        modifiedHtml = modifiedHtml
          .replace(/<meta name="twitter:site" content="@lelariva">/g, '<meta name="twitter:site" content="@Lelariva_fr">')
          .replace(/<meta name="twitter:creator" content="@lelariva">/g, '<meta name="twitter:creator" content="@Lelariva_fr">')
          .replace(/<title>[^<]*<\/title>/g, `<title>${metaTags.title}</title>`)
          .replace(/<meta name="description" content="[^"]*">/g, `<meta name="description" content="${metaTags.description}">`)
          .replace(/<link rel="canonical" href="[^"]*">/g, `<link rel="canonical" href="${metaTags.url}">`);

        const ogInjection = `
    <meta property="og:title" content="${metaTags.title}">
    <meta property="og:description" content="${metaTags.description}">
    <meta property="og:url" content="${metaTags.url}">
    <meta property="og:image" content="${metaTags.image}">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${metaTags.title}">
    <meta property="og:updated_time" content="${new Date().toISOString()}">
    <meta name="twitter:title" content="${metaTags.title}">
    <meta name="twitter:description" content="${metaTags.description}">
    <meta name="twitter:url" content="${metaTags.url}">
    <meta name="twitter:image" content="${metaTags.image}">
    <meta name="twitter:image:alt" content="${metaTags.title}">`;

        modifiedHtml = modifiedHtml.replace(
          /<meta property="og:locale" content="fr_FR">/,
          `<meta property="og:locale" content="fr_FR">${ogInjection}`
        );
        
        modifiedHtml = modifiedHtml.replace(
          "<head>",
          '<head>\n    <meta name="http-status" content="200">'
        );
      }

      res.send(modifiedHtml);
    });
  };
}

export { isValidSPARoute, validRoutes, validPatterns };
