import type { IDbContext } from '@pocketledger/database';
import type { FastifyPluginAsync } from 'fastify';
import { EndpointRouteRegistrarBase } from '../EndpointRouteRegistrarBase.ts';
import type { IHealthRouteDependencies } from './Contracts/IHealthRouteDependencies.ts';
import type { DatabaseStatus } from './DatabaseStatus.ts';

export class HealthRouteRegistrar extends EndpointRouteRegistrarBase {
    private readonly dbContext: IDbContext;

    public constructor({ dbContext }: IHealthRouteDependencies) {
        super();
        this.dbContext = dbContext;
    }

    public readonly register: FastifyPluginAsync = async (app) => {
        this.registerNamedGet(app, 'Health', 'status', async () => {
            return {
                status: 'ok',
                service: 'Pocket ledger API',
                database: await this.resolveDatabaseStatus(),
                timestamp: new Date().toISOString(),
            };
        });
    };

    private async resolveDatabaseStatus(): Promise<DatabaseStatus> {
        if (!process.env.DATABASE_URL) {
            return 'not_configured';
        }

        try {
            await this.dbContext.$queryRaw`SELECT 1`;
            return 'reachable';
        } catch {
            return 'unreachable';
        }
    }
}
