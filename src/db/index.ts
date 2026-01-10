import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Resource } from "sst";
import * as schema from "./schema.ts";

// Get the database URL with optional chaining
const dbUrl = Resource.DATABASE_URL_POOLER?.value;

// Safe initialization
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

try {
  if (!dbUrl || typeof dbUrl !== "string") {
    console.warn(
      "⚠️ Database URL is missing or invalid. DB operations will fail."
    );
  } else {
    const client = neon(dbUrl);
    dbInstance = drizzle(client, { schema });
  }
} catch (err) {
  console.error("❌ Error initializing db:", err);
}

// Export a proxy that throws if db failed to init
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get: (_target, prop) => {
    if (!dbInstance) {
      throw new Error(
        `Database not initialized. check VITE_DATABASE_URL_POOLER. URL: ${dbUrl}`
      );
    }
    return (dbInstance as any)[prop];
  },
});
