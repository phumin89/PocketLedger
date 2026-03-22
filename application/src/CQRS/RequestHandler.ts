import type { IDbContext } from '@pocketledger/database';
import type { ICurrentUserContext } from '../Auth/Contracts/ICurrentUserContext.ts';
import type { IRequestHandlerDependencies } from './Contracts/IRequestHandlerDependencies.ts';

export abstract class RequestHandler<TRequest, TResponse> {
    protected readonly currentUserContext: ICurrentUserContext;
    protected readonly dbContext: IDbContext;

    public constructor({ currentUserContext, dbContext }: IRequestHandlerDependencies) {
        this.currentUserContext = currentUserContext;
        this.dbContext = dbContext;
    }

    public abstract execute(request: TRequest): Promise<TResponse>;
}
