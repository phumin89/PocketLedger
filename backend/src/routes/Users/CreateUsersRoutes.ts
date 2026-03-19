import type { FastifyPluginAsync } from 'fastify';
import type { IUsersRouteDependencies } from './Contracts/IUsersRouteDependencies.ts';

const legacyCurrentUserPath = '/queries/users/me';
const currentUserPath = '/users/me';

export function createUsersRoutes({
    usersController,
}: IUsersRouteDependencies): FastifyPluginAsync {
    return async (app) => {
        app.get(currentUserPath, async (request, reply) => {
            return usersController.getCurrentUser(request, reply);
        });

        app.get(legacyCurrentUserPath, async (request, reply) => {
            reply.header('Deprecation', 'true');
            reply.header('Link', `</api${currentUserPath}>; rel="successor-version"`);

            return usersController.getCurrentUser(request, reply);
        });
    };
}
