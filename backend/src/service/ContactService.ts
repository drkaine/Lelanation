import { Request, Response } from "express";
import path from "path";
import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import { readdir } from "fs/promises";

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
        "../../../frontend/src/assets/files/contact",
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

  async getContact(req: Request, res: Response) {
    try {
      const contactDir = path.join(
        __dirname,
        "../../../frontend/src/assets/files/contact",
      );
      const files = await readdir(contactDir);
      const contactFiles = files.filter((file) => file.endsWith(".json"));
      const contactData = [];
      for (const file of contactFiles) {
        const filePath = path.join(contactDir, file);
        const fileContent = await readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        const fileName = file.replace(".json", "");
        contactData.push({
          category: fileName,
          messages: data,
        });
      }
      res.json(contactData);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des contacts" });
    }
  },

  async deleteContact(req: Request, res: Response) {
    try {
      const { category, date } = req.body;
      const contactDir = path.join(
        __dirname,
        "../../../frontend/src/assets/files/contact",
      );
      const filePath = path.join(contactDir, `${category}.json`);

      const fileContent = await readFile(filePath, "utf-8");
      const messages = JSON.parse(fileContent);

      const filteredMessages = messages.filter(
        (message: { date: string }) => message.date !== date,
      );

      await writeFile(filePath, JSON.stringify(filteredMessages, null, 2));

      res.status(200).json({ message: "Message supprimé" });
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du message" });
    }
  },
};
