import type { FastifyPluginAsync } from 'fastify';
import type { AuthRouteRegistrar } from './Auth/AuthRouteRegistrar.ts';
import type { IApiRouteDependencies } from './Contracts/IApiRouteDependencies.ts';
import type { HealthRouteRegistrar } from './System/HealthRouteRegistrar.ts';
import type { UsersRouteRegistrar } from './Users/UsersRouteRegistrar.ts';

export class ApiRouteRegistrar {
    private readonly authRouteRegistrar: AuthRouteRegistrar;
    private readonly healthRouteRegistrar: HealthRouteRegistrar;
    private readonly usersRouteRegistrar: UsersRouteRegistrar;

    public constructor({
        authRouteRegistrar,
        healthRouteRegistrar,
        usersRouteRegistrar,
    }: IApiRouteDependencies) {
        this.authRouteRegistrar = authRouteRegistrar;
        this.healthRouteRegistrar = healthRouteRegistrar;
        this.usersRouteRegistrar = usersRouteRegistrar;
    }

    public readonly register: FastifyPluginAsync = async (app) => {
        await app.register(this.authRouteRegistrar.register);
        await app.register(this.healthRouteRegistrar.register);
        await app.register(this.usersRouteRegistrar.register);
    };
}
