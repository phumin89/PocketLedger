import type { AuthRouteRegistrar } from '../Auth/AuthRouteRegistrar.ts';
import type { HealthRouteRegistrar } from '../System/HealthRouteRegistrar.ts';
import type { UsersRouteRegistrar } from '../Users/UsersRouteRegistrar.ts';

export interface IApiRouteDependencies {
    readonly authRouteRegistrar: AuthRouteRegistrar;
    readonly healthRouteRegistrar: HealthRouteRegistrar;
    readonly usersRouteRegistrar: UsersRouteRegistrar;
}
