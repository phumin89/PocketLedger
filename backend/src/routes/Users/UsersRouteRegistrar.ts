import type { FastifyPluginAsync } from 'fastify';
import type { UsersController } from '../../Controllers/Users/UsersController.ts';
import type { RequireAuthenticatedUserPreHandler } from '../../PreHandlers/Auth/RequireAuthenticatedUserPreHandler.ts';
import { EndpointRouteRegistrarBase } from '../EndpointRouteRegistrarBase.ts';
import type { IUsersRouteDependencies } from './Contracts/IUsersRouteDependencies.ts';

export class UsersRouteRegistrar extends EndpointRouteRegistrarBase {
    private readonly requireAuthenticatedUserPreHandler: RequireAuthenticatedUserPreHandler;
    private readonly usersController: UsersController;

    public constructor({
        requireAuthenticatedUserPreHandler,
        usersController,
    }: IUsersRouteDependencies) {
        super();
        this.requireAuthenticatedUserPreHandler = requireAuthenticatedUserPreHandler;
        this.usersController = usersController;
    }

    public readonly register: FastifyPluginAsync = async (app) => {
        app.addHook('preHandler', this.requireAuthenticatedUserPreHandler.handle);
        this.registerControllerGet(
            app,
            this.usersController,
            this.usersController.currentUser.name,
            async (request, reply) => {
                return this.usersController.currentUser(request, reply);
            }
        );
    };
}
