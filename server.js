import WebSocket, { WebSocketServer } from "ws";

// Use PORT from Render environment variables
const PORT = process.env.PORT || 3000;

// Replace with your Aternos server IP and port
const BACKEND = "krisheagle.aternos.me:17568";

const wss = new WebSocketServer({ port: PORT });
console.log(`EaglercraftX proxy running on port ${PORT}`);

wss.on("connection", (client) => {
  console.log("Client connected");

  // Connect to backend (Aternos)
  const backend = new WebSocket(BACKEND);

  // Forward messages both ways
  client.on("message", (msg) => backend.send(msg));
  backend.on("message", (msg) => client.send(msg));

  // Close connections if one side disconnects
  client.on("close", () => backend.close());
  backend.on("close", () => client.close());
});

// Optional: Keep-alive pings to avoid idle timeout
setInterval(() => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.ping();
  });
}, 30000); // ping every 30 seconds
