export const config = {
  cors: {
    origin: [
      "http://www.dev.lelanation.darkaine.fr",
      "https://www.lelanation.darkaine.fr",
      "http://www.lelanation.fr",
      "https://www.lelanation.fr",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  },
};
