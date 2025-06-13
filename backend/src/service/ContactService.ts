import { Request, Response } from "express";
import path from "path";
import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import { readdir } from "fs/promises";

export const contactService = {
  async safeJsonParse(
    content: string,
  ): Promise<
    Array<{ date: string; name: string; email: string; message: string }>
  > {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Erreur de parsing JSON:", error);
      try {
        const cleaned = content.replace(/\]\]$/, "]").replace(/,\s*\]$/, "]");
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [];
      } catch (repairError) {
        console.error("Impossible de réparer le JSON:", repairError);
        return [];
      }
    }
  },

  async cleanOldMessages(filePath: string) {
    try {
      if (!existsSync(filePath)) return;

      const fileContent = await readFile(filePath, "utf-8");
      const messages = await this.safeJsonParse(fileContent);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const filteredMessages = messages.filter((message: { date: string }) => {
        const messageDate = new Date(message.date);
        return messageDate > oneYearAgo;
      });

      if (filteredMessages.length !== messages.length) {
        await writeFile(filePath, JSON.stringify(filteredMessages, null, 2));
        console.log(
          `Messages supprimés automatiquement: ${messages.length - filteredMessages.length}`,
        );
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage automatique:", error);
    }
  },

  async sendContact(req: Request, res: Response) {
    try {
      const { name, email, message, subject } = req.body;
      const contactData = {
        date: new Date().toISOString(),
        name: name || "Anonyme",
        email: email || "",
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

      await contactService.cleanOldMessages(filePath);

      let existingData: Array<{
        date: string;
        name: string;
        email: string;
        message: string;
      }> = [];
      if (existsSync(filePath)) {
        const fileContent = await readFile(filePath, "utf-8");
        existingData = await this.safeJsonParse(fileContent);
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

      if (!existsSync(contactDir)) {
        return res.json([]);
      }

      const files = await readdir(contactDir);
      const contactFiles = files.filter((file) => file.endsWith(".json"));

      if (contactFiles.length === 0) {
        return res.json([]);
      }

      const contactData = [];

      for (const file of contactFiles) {
        const filePath = path.join(contactDir, file);

        await contactService.cleanOldMessages(filePath);

        try {
          const fileContent = await readFile(filePath, "utf-8");
          const data = await this.safeJsonParse(fileContent);
          const fileName = file.replace(".json", "");
          contactData.push({
            category: fileName,
            messages: data,
          });
        } catch (fileError) {
          console.error(`Erreur avec le fichier ${file}:`, fileError);
          continue;
        }
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
      console.log("deleteContact appelé avec:", { category, date });

      const contactDir = path.join(
        __dirname,
        "../../../frontend/src/assets/files/contact",
      );
      const filePath = path.join(contactDir, `${category}.json`);
      console.log("Chemin du fichier:", filePath);

      const fileContent = await readFile(filePath, "utf-8");
      const messages = await this.safeJsonParse(fileContent);
      console.log("Messages avant suppression:", messages.length);

      const filteredMessages = messages.filter(
        (message: { date: string }) => message.date !== date,
      );
      console.log("Messages après suppression:", filteredMessages.length);

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
