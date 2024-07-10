import config from "@/lib/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(config.env.databaseUrl);

export const db = drizzle({ client: sql, casing: "snake_case" });

// Neon free-tier databases go to sleep and the first query after inactivity
// can fail with ETIMEDOUT while the compute wakes up. This utility retries
// once with a 3-second delay before propagating the error.
export async function withDbRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const isTimeout =
      err?.sourceError?.code === "ETIMEDOUT" ||
      err?.cause?.code === "ETIMEDOUT" ||
      err?.message?.includes("fetch failed");

    if (isTimeout) {
      await new Promise((r) => setTimeout(r, 3000));
      return await fn();
    }
    throw err;
  }
}
