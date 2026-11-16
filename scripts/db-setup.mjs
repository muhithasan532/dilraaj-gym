/**
 * Creates the application tables on the database configured by DATABASE_URL.
 *
 * Idempotent: the SQL in db/schema.sql uses `create table if not exists`, so the
 * script can run any number of times. Use it after a database reset, or right
 * after pointing DATABASE_URL at a fresh database:
 *
 *   npm run db:setup
 *
 * Environment lookup order matches Next.js: `.env.local` first, then `.env`.
 * A DATABASE_URL already present in the process environment always wins.
 */
import fs from "node:fs";
import path from "node:path";

import { config } from "dotenv";
import pg from "pg";

const root = path.resolve(import.meta.dirname, "..");

config({ path: path.join(root, ".env.local"), quiet: true });
config({ path: path.join(root, ".env"), quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("db:setup — DATABASE_URL is not set. Add it to .env.local (or .env) and retry.");
  process.exit(1);
}

const schemaPath = path.join(root, "db", "schema.sql");
const sql = fs.readFileSync(schemaPath, "utf8");

const client = new pg.Client({ connectionString: databaseUrl, connectionTimeoutMillis: 20000 });

try {
  await client.connect();
  await client.query(sql);

  const { rows } = await client.query(
    "select tablename from pg_tables where schemaname = current_schema() order by 1"
  );
  const expected = ["media_assets", "site_content"];
  const present = rows.map((row) => row.tablename);
  const missing = expected.filter((table) => !present.includes(table));

  if (missing.length > 0) {
    console.error(`db:setup — tables still missing after setup: ${missing.join(", ")}`);
    process.exitCode = 1;
  } else {
    console.log(`db:setup — ready. Tables: ${expected.join(", ")} (${present.length} total in schema).`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`db:setup — failed: ${message}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
