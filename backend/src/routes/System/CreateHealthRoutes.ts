import type { IDbContext } from '@pocketledger/database';
import type { FastifyPluginAsync } from 'fastify';
import type { IHealthRouteDependencies } from './Contracts/IHealthRouteDependencies.ts';
import type { DatabaseStatus } from './DatabaseStatus.ts';

async function resolveDatabaseStatus(dbContext: IDbContext): Promise<DatabaseStatus> {
    if (!process.env.DATABASE_URL) {
        return 'not_configured';
    }

    try {
        await dbContext.$queryRaw`SELECT 1`;
        return 'reachable';
    } catch {
        return 'unreachable';
    }
}

export function createHealthRoutes({ dbContext }: IHealthRouteDependencies): FastifyPluginAsync {
    return async (app) => {
        app.get('/health', async () => {
            return {
                status: 'ok',
                service: 'PocketLedger API',
                database: await resolveDatabaseStatus(dbContext),
                timestamp: new Date().toISOString(),
            };
        });
    };
}
