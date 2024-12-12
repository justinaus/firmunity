import { PrismaClient } from '@prisma/client';

declare global {
  let prisma: PrismaClient | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = ((global as any).prisma as PrismaClient) || new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (process.env.NODE_ENV === 'development') (global as any).prisma = prisma;

export const prismaClient = prisma;
