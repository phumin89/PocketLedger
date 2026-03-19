import type { FastifyPluginAsync } from 'fastify';
import type { AuthController } from '../../Controllers/Auth/AuthController.ts';
import { EndpointRouteRegistrarBase } from '../EndpointRouteRegistrarBase.ts';
import type { IAuthRouteDependencies } from './Contracts/IAuthRouteDependencies.ts';

export class AuthRouteRegistrar extends EndpointRouteRegistrarBase {
    private readonly authController: AuthController;

    public constructor({ authController }: IAuthRouteDependencies) {
        super();
        this.authController = authController;
    }

    public readonly register: FastifyPluginAsync = async (app) => {
        this.registerControllerPost(
            app,
            this.authController,
            this.authController.login.name,
            async (request, reply) => {
                return this.authController.login(request, reply);
            }
        );
    };
}
