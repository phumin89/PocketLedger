import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

export type IDbContext = PrismaClient;
export type DbContext = PrismaClient;

export const dbContext: DbContext = new PrismaClient({ adapter });
export const prisma = dbContext;

export type { PrismaClient } from './generated/prisma/client.js';
export type { UserModel as DatabaseUserModel } from './generated/prisma/models/User.js';
