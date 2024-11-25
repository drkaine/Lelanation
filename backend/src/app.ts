import express from "express";
import cron from "node-cron";
import { compilation } from "./Cron";

import { save } from "./FileManager";
import path from "path";

async function cheat() {
  const type: string[] = [
    "4307cd28-4e47-4c49-957f-71cef831e4f4", //gleam
    "discount5f", // 20 euros
    "freeShipping", // 20% accessoire
    "5595cf58-1649-4901-9945-e1c03f817738", //R20
    "e39cbe2e-5e13-4488-9e51-ae03943fd700", //L20
    "4100c802-141b-4257-b537-f8bcfbc99a4e", //300 euros
    "7cbe0fb5-58d2-405b-8231-aea6baf69fc8", //h13
  ];
// DCK0CLWT5OVX H13
// R7TMWQLR0AMX 20 euros
// {"discount_code":"R7TMWQLR0AMP","widget_id":"672332c70277bb6381cfa70f","discount_key":"4100c802-141b-4257-b537-f8bcfbc99a4e","pathname":"/pages/black-friday-2024","email":"d@gmail.com","collectData":{"email":"d@gmail.com"},"mergedData":[{"Email":"d@gmail.com"}],"validEmail":true,"blocked":false,"timeout":false}
  let data;
  let attempts = 0;
  const value = [];

  while (true) {
    try {
      const response = await fetch(
        "https://app.trytada.com/getDiscountCode?widget_id=672332c70277bb6381cfa70f",
      );

      if (!response.ok) {
        const date = new Date();
        save(
          JSON.stringify(value),
          path.join(__dirname, "/code/" + "error_" + date),
        );
        cheat();
      }

      data = await response.json();

      if (type.includes(data.key)) {
        console.log(`Tentative ${attempts + 1}:`, data);
        save(
          JSON.stringify(data),
          path.join(__dirname, "/code/" + data.text + "_" + attempts + ".json"),
        );
        value.push(data);
      }

      attempts++;
      console.log(attempts);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du code de réduction :",
        error,
      );
      break;
    }
  }
  save(JSON.stringify(value), path.join(__dirname, "/code/code3.json"));
  console.log(value);
}

cheat();

// const app = express();
// const PORT = process.env.PORT || 3000;

// cron.schedule("0 0,12 * * *", () => {
//   console.log("Tâche cron exécutée à 00h00 et 12h00");
  // compilation();
// });

// app.listen(PORT, () => {
//   console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
// });
