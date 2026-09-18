import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let dbUrl = process.env.DATABASE_URL;

if (process.env.VERCEL && (!dbUrl || dbUrl.startsWith('file:'))) {
  const tmpDb = path.join('/tmp', 'dev.db');
  if (!fs.existsSync(tmpDb)) {
    const possibleSources = [
      path.resolve(process.cwd(), 'server/prisma/dev.db'),
      path.resolve(process.cwd(), 'prisma/dev.db'),
      path.resolve(__dirname, '../../prisma/dev.db'),
    ];
    for (const src of possibleSources) {
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDb);
          break;
        } catch (e) {
          console.error('Error copying dev.db to /tmp:', e);
        }
      }
    }
  }
  process.env.DATABASE_URL = `file:${tmpDb}`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
