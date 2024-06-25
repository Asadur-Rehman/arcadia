import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required: provide a WebSocket constructor for Node.js (not needed in edge/browser)
neonConfig.webSocketConstructor = ws;

config({ path: ".env.local" });

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
