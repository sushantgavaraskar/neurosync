import { PrismaClient } from '@prisma/client';
import { config } from './index.js';

export const prisma = new PrismaClient({
  datasources: { db: { url: config.postgresUrl } }
});

