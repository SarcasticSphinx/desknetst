import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForDb = globalThis as unknown as { db?: PrismaClient };

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Set DATABASE_URL before using the database.");
  if (!globalForDb.db) {
    globalForDb.db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  }
  return globalForDb.db;
}
