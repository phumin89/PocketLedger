import type { IDbContext } from '@pocketledger/database';
import type { ICurrentUserContext } from '../../Auth/Contracts/ICurrentUserContext.ts';

export interface IRequestHandlerDependencies {
    readonly currentUserContext: ICurrentUserContext;
    readonly dbContext: IDbContext;
}
