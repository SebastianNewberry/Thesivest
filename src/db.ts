import { neon } from "@neondatabase/serverless";
import { Resource } from "sst";

let client: ReturnType<typeof neon>;

export async function getClient() {
  if (!Resource.DATABASE_URL_POOLER.value) {
    return undefined;
  }
  if (!client) {
    client = await neon(Resource.DATABASE_URL_POOLER.value);
  }
  return client;
}
