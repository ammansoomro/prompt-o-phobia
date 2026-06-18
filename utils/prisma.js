import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across hot reloads / serverless invocations,
// mirroring the connection-caching the old Mongoose helper provided.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
