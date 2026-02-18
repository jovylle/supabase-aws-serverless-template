import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Client } from "pg";

const [, , relativePath] = process.argv;

if (!relativePath) {
  console.error("Usage: node scripts/run-sql.js <sql-file>");
  process.exit(1);
}

const filePath = join(process.cwd(), relativePath);

function loadDotEnv(raw) {
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

try {
  const envRaw = await readFile(join(process.cwd(), ".env"), "utf-8");
  loadDotEnv(envRaw);
} catch (err) {
  // Allow execution when users export env vars from shell instead.
}

const connectionString = process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  console.error("Set SUPABASE_DATABASE_URL before running this script");
  process.exit(1);
}

const sql = await readFile(filePath, "utf-8");
const client = new Client({ connectionString });
let error;

try {
  await client.connect();
  await client.query("begin");
  await client.query(sql);
  await client.query("commit");
  console.log(`Applied ${relativePath}`);
} catch (err) {
  error = err;
} finally {
  try {
    await client.end();
  } catch (closeErr) {
    console.warn("Error closing connection", closeErr);
  }
}

if (error) {
  console.error(error);
  process.exit(1);
}
