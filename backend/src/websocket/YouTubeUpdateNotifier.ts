import { WebSocket, WebSocketServer } from "ws";
import type { Server } from "http";

interface YouTubeUpdateMessage {
  type: "youtube_update";
  channelId: string;
  channelName: string;
  videosAdded: number;
  totalVideos: number;
  lastVideoDate: string;
  timestamp: number;
}

export class YouTubeUpdateNotifier {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  initialize(server: Server): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("🔌 Client WebSocket connecté");
      this.clients.add(ws);

      // Envoyer un message de bienvenue
      ws.send(
        JSON.stringify({
          type: "connection_established",
          message: "Connecté au système de notifications YouTube",
          timestamp: Date.now(),
        }),
      );

      ws.on("close", () => {
        console.log("🔌 Client WebSocket déconnecté");
        this.clients.delete(ws);
      });

      ws.on("error", (error) => {
        console.error("❌ Erreur WebSocket:", error);
        this.clients.delete(ws);
      });
    });

    console.log("🚀 Serveur WebSocket YouTube initialisé");
  }

  notifyUpdate(data: Omit<YouTubeUpdateMessage, "type" | "timestamp">): void {
    if (!this.wss) {
      console.warn("⚠️ WebSocket server non initialisé");
      return;
    }

    const message: YouTubeUpdateMessage = {
      type: "youtube_update",
      ...data,
      timestamp: Date.now(),
    };

    const messageStr = JSON.stringify(message);
    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
        sentCount++;
      }
    });

    console.log(`📡 Notification YouTube envoyée à ${sentCount} clients`);
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  broadcast(message: unknown): void {
    if (!this.wss) return;

    const messageStr = JSON.stringify(message);
    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
        sentCount++;
      }
    });

    console.log(`📡 Message broadcast envoyé à ${sentCount} clients`);
  }
}

// Instance singleton
export const youtubeUpdateNotifier = new YouTubeUpdateNotifier();
