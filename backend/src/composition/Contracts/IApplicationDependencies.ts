import type { IDbContext } from '@pocketledger/database';
import type { ApiRouteRegistrar } from '../../routes/ApiRouteRegistrar.ts';

export interface IApplicationDependencies {
    readonly apiRouteRegistrar: ApiRouteRegistrar;
    readonly dbContext: IDbContext;
}
