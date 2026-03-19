import { CurrentUserQuery, type ICurrentUserResponse } from '@pocketledger/contracts';
import type { DatabaseUserModel } from '@pocketledger/database';
import { QueryHandler } from '../../CQRS/QueryHandler.ts';

export class CurrentUserQueryHandler extends QueryHandler<
    CurrentUserQuery,
    ICurrentUserResponse | null
> {
    public override async execute(_query: CurrentUserQuery): Promise<ICurrentUserResponse | null> {
        const user = await this.dbContext.user.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });

        return user ? this.mapUserToResponse(user) : null;
    }

    private mapUserToResponse(user: DatabaseUserModel): ICurrentUserResponse {
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
