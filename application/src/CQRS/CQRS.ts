import { dbContext, type IDbContext } from '@pocketledger/database';

export abstract class CQRS<TRequest, TResponse> {
    protected readonly dbContext: IDbContext;

    constructor(context: IDbContext = dbContext) {
        this.dbContext = context;
    }

    public abstract execute(request: TRequest): Promise<TResponse>;
}
