import { Request, Response } from "express";
import path from "path";
import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";

export const contactService = {
  async sendContact(req: Request, res: Response) {
    try {
      const { name, message, subject } = req.body;
      const contactData = {
        date: new Date().toISOString(),
        name: name || "Anonyme",
        message,
      };

      const contactDir = path.join(
        __dirname,
        "../../../frontend/public/assets/files/contact",
      );
      const filePath = path.join(contactDir, `${subject}.json`);

      if (!existsSync(contactDir)) {
        await mkdir(contactDir, { recursive: true });
      }

      let existingData = [];
      if (existsSync(filePath)) {
        const fileContent = await readFile(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
      }

      existingData.push(contactData);
      await writeFile(filePath, JSON.stringify(existingData, null, 2));

      res.status(200).json({ message: "Contact enregistré avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du contact:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de l'enregistrement du contact" });
    }
  },
};
