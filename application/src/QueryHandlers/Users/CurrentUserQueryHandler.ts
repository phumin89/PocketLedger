import { CurrentUserQuery, CurrentUserResponse } from '@pocketledger/contracts';
import { DatabaseUserModel, IDbContext } from '@pocketledger/database';
import { QueryHandler } from '../../CQRS/QueryHandler.js';

export class CurrentUserQueryHandler extends QueryHandler<
    CurrentUserQuery,
    CurrentUserResponse | null
> {
    static readonly requestName = 'CurrentUserQuery';

    constructor(context: IDbContext) {
        super(context);
    }

    async execute(_query: CurrentUserQuery): Promise<CurrentUserResponse | null> {
        const user = await this.dbContext.user.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });

        return user ? this.mapUser(user) : null;
    }

    private mapUser(user: DatabaseUserModel): CurrentUserResponse {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            locale: user.locale,
            timeZone: user.timeZone,
            currencyCode: user.currencyCode,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
}
