import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

config({ path: [".env.local", ".env"] });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Resource.VITE_DATABASE_URL_POOLER.value || "",
  },
});
