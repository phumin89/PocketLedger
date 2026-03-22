import type { FastifyPluginAsync } from 'fastify';
import type { UsersController } from '../../Controllers/Users/UsersController.ts';
import { AuthenticatedRouteRegistrarBase } from '../AuthenticatedRouteRegistrarBase.ts';
import type { IUsersRouteDependencies } from './Contracts/IUsersRouteDependencies.ts';

export class UsersRouteRegistrar extends AuthenticatedRouteRegistrarBase {
    private readonly usersController: UsersController;

    public constructor({
        currentUserContext,
        requireAuthenticatedUserPreHandler,
        usersController,
    }: IUsersRouteDependencies) {
        super(requireAuthenticatedUserPreHandler, currentUserContext);
        this.usersController = usersController;
    }

    public readonly register: FastifyPluginAsync = async (app) => {
        this.protect(app);
        this.registerAuthenticatedControllerGet(
            app,
            this.usersController,
            this.usersController.currentUser.name,
            async (request, reply) => {
                return this.usersController.currentUser(request, reply);
            }
        );
    };
}
