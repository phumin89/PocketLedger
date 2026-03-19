import type { FastifyPluginAsync } from 'fastify';
import type { IApiRouteDependencies } from './Contracts/IApiRouteDependencies.ts';
import { createHealthRoutes } from './System/CreateHealthRoutes.ts';
import { createUsersRoutes } from './Users/CreateUsersRoutes.ts';

export function createApiRoutes({
    dbContext,
    usersController,
}: IApiRouteDependencies): FastifyPluginAsync {
    return async (app) => {
        await app.register(createHealthRoutes({ dbContext }));
        await app.register(createUsersRoutes({ usersController }));
    };
}
