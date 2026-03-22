import type { AuthRouteRegistrar } from '../Auth/AuthRouteRegistrar.ts';
import type { HealthRouteRegistrar } from '../System/HealthRouteRegistrar.ts';
import type { TransactionsRouteRegistrar } from '../Transactions/TransactionsRouteRegistrar.ts';
import type { UsersRouteRegistrar } from '../Users/UsersRouteRegistrar.ts';

export interface IApiRouteDependencies {
    readonly authRouteRegistrar: AuthRouteRegistrar;
    readonly healthRouteRegistrar: HealthRouteRegistrar;
    readonly transactionsRouteRegistrar: TransactionsRouteRegistrar;
    readonly usersRouteRegistrar: UsersRouteRegistrar;
}
