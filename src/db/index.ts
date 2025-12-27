import { drizzle } from "drizzle-orm/node-postgres";
import { Resource } from "sst";

import * as schema from "./schema.ts";

// Debug: Check what Resource looks like
console.log("Resource:", Resource);
console.log("VITE_DATABASE_URL_POOLER:", Resource.VITE_DATABASE_URL_POOLER);

// Get the database URL with optional chaining
const dbUrl = Resource.VITE_DATABASE_URL_POOLER?.value;

console.log("dbUrl:", dbUrl);

if (!dbUrl || typeof dbUrl !== "string") {
  console.error("Database URL is missing or invalid");
  throw new Error(
    "Database URL not found. Make sure VITE_DATABASE_URL_POOLER is set in your environment."
  );
}

export const db = drizzle(dbUrl, { schema });

console.log("db initialized successfully");
