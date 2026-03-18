import { prisma } from '@pocketledger/database';
import type { FastifyPluginAsync } from 'fastify';

export const healthRoute: FastifyPluginAsync = async (app) => {
    app.get('/health', async () => {
        let database = 'not_configured';

        if (process.env.DATABASE_URL) {
            try {
                await prisma.$queryRaw`SELECT 1`;
                database = 'reachable';
            } catch {
                database = 'unreachable';
            }
        }

        return {
            status: 'ok',
            service: 'PocketLedger API',
            database,
            timestamp: new Date().toISOString(),
        };
    });
};
