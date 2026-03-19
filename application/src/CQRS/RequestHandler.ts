import type { IDbContext } from '@pocketledger/database';
import type { IRequestHandlerDependencies } from './Contracts/IRequestHandlerDependencies.ts';

export abstract class RequestHandler<TRequest, TResponse> {
    protected readonly dbContext: IDbContext;

    public constructor({ dbContext }: IRequestHandlerDependencies) {
        this.dbContext = dbContext;
    }

    public abstract execute(request: TRequest): Promise<TResponse>;
}
