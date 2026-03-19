import { PrismaPg } from '@prisma/adapter-pg';
import type { DbContext } from './DbContext.ts';
import { PrismaClient } from './generated/prisma/client.ts';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

export const dbContext: DbContext = new PrismaClient({ adapter });
export { dbContext as prisma };
