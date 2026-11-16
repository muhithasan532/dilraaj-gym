import path from "node:path";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Same environment lookup order as Next.js and scripts/db-setup.mjs:
// `.env.local` wins, then `.env`; an already-set process variable wins over both.
config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });
config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("drizzle.config.ts — DATABASE_URL is not set. Add it to .env.local (or .env).");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: databaseUrl },
});
