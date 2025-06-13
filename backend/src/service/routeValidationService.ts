export interface RouteValidationResult {
  exists: boolean;
  status: number;
  redirect?: string;
  meta?: {
    title?: string;
    description?: string;
    noindex?: boolean;
  };
}

export class RouteValidationService {
  private validRoutes: Set<string>;
  private validPatterns: RegExp[];

  constructor() {
    this.validRoutes = new Set([
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
    ]);

    this.validPatterns = [
      /^\/admin\/[a-zA-Z0-9_-]+$/, // /admin/:name
      /^\/build\/[^/]+\/[^/]+$/, // /build/:type/:fileName
      /^\/connexion\/[a-zA-Z0-9_-]+$/, // /connexion/:name
    ];
  }

  validateRoute(path: string): RouteValidationResult {
    const cleanPath = path.split("?")[0].split("#")[0];

    if (this.validRoutes.has(cleanPath)) {
      return {
        exists: true,
        status: 200,
      };
    }

    for (const pattern of this.validPatterns) {
      if (pattern.test(cleanPath)) {
        return {
          exists: true,
          status: 200,
        };
      }
    }

    if (this.isDefinitely404(cleanPath)) {
      return {
        exists: false,
        status: 404,
        meta: {
          title: "404 - Page non trouvée | Lelanation",
          description: "La page demandée n'existe pas.",
          noindex: true,
        },
      };
    }

    return {
      exists: false,
      status: 404,
      meta: {
        title: "404 - Page non trouvée | Lelanation",
        description: "La page demandée n'existe pas.",
        noindex: true,
      },
    };
  }

  private isDefinitely404(path: string): boolean {
    const obvious404Patterns = [
      /\.(php|asp|aspx|jsp|cgi|pl|py|rb)$/,
      /(wp-admin|wp-content|admin|administrator|phpmyadmin|cpanel)/,
      /(\.well-known|\.git|\.svn|\.env|config\.)/,
      /\/\/+/,
      /[<>"|*?:]/,
      /.{200,}/,
    ];

    const hasControlChars = this.hasControlCharacters(path);

    return (
      obvious404Patterns.some((pattern) => pattern.test(path)) ||
      hasControlChars
    );
  }

  private hasControlCharacters(path: string): boolean {
    for (let i = 0; i < path.length; i++) {
      const charCode = path.charCodeAt(i);
      if ((charCode >= 0 && charCode <= 31) || charCode === 127) {
        return true;
      }
    }
    return false;
  }

  getAllValidRoutes(): string[] {
    return Array.from(this.validRoutes);
  }

  async validateUserRoute(name: string): Promise<boolean> {
    return /^[a-zA-Z0-9_-]{1,50}$/.test(name);
  }

  async validateBuildRoute(type: string, fileName: string): Promise<boolean> {
    const validTypes = ["public", "private", "shared"];
    return (
      validTypes.includes(type) &&
      /^[a-zA-Z0-9_-]+\.(json|build)$/.test(fileName)
    );
  }
}
