import type { IDbContext } from '@pocketledger/database';

export interface IHealthRouteDependencies {
    readonly dbContext: IDbContext;
}
