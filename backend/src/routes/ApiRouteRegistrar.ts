import type { FastifyPluginAsync } from 'fastify';
import type { AuthRouteRegistrar } from './Auth/AuthRouteRegistrar.ts';
import type { IApiRouteDependencies } from './Contracts/IApiRouteDependencies.ts';
import type { HealthRouteRegistrar } from './System/HealthRouteRegistrar.ts';
import type { TransactionsRouteRegistrar } from './Transactions/TransactionsRouteRegistrar.ts';
import type { UsersRouteRegistrar } from './Users/UsersRouteRegistrar.ts';

export class ApiRouteRegistrar {
    private readonly authRouteRegistrar: AuthRouteRegistrar;
    private readonly healthRouteRegistrar: HealthRouteRegistrar;
    private readonly transactionsRouteRegistrar: TransactionsRouteRegistrar;
    private readonly usersRouteRegistrar: UsersRouteRegistrar;

    public constructor({
        authRouteRegistrar,
        healthRouteRegistrar,
        transactionsRouteRegistrar,
        usersRouteRegistrar,
    }: IApiRouteDependencies) {
        this.authRouteRegistrar = authRouteRegistrar;
        this.healthRouteRegistrar = healthRouteRegistrar;
        this.transactionsRouteRegistrar = transactionsRouteRegistrar;
        this.usersRouteRegistrar = usersRouteRegistrar;
    }

    public readonly register: FastifyPluginAsync = async (app) => {
        await app.register(this.authRouteRegistrar.register);
        await app.register(this.healthRouteRegistrar.register);
        await app.register(this.transactionsRouteRegistrar.register);
        await app.register(this.usersRouteRegistrar.register);
    };
}
