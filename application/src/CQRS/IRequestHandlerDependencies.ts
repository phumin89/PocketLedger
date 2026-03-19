import type { IDbContext } from '@pocketledger/database';

export interface IRequestHandlerDependencies {
    readonly dbContext: IDbContext;
}
